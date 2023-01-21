require('cypress-xpath')        // Selector de Xpath
const dayjs = require('dayjs');  // Importar fecha
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, BUSCAR_COMUNIDAD } = require('../cf_functions');

describe('Pruebas TI', () => {     
    
    const WEB = Cypress.env('WEB_5');
    const USER = Cypress.env('USER_5');
    const PASS = Cypress.env('PASS_5');

    const COMUNIDAD_PRUEBA = 'test de bloqueo';
    const BTN_VER = '[href="/admin/communities/test-de-bloqueo-no-usar"] > .btn'

    const RUTA_COMPROBANTE = "cypress/e2e/CF/02_archivos/1.jpg"
    const UF = 3500;

    it('Crear deuda excedida', () => {                

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_SUPERADMIN(USER,PASS);

        // Buscar Comunidad
        BUSCAR_COMUNIDAD(COMUNIDAD_PRUEBA);
        
        // Ver
        cy.get(BTN_VER).click({force:true});
        
        // Facturacion
        cy.xpath("//div[@class='btn btn-warning pull-right'][contains(.,'Facturación')]").should('be.visible').click({force:true})

        // ID de la cuenta
        cy.xpath("(//strong[contains(.,'#')])[1]").should('be.visible').click({force:true})
        
        // Nuevo Invoice Manual
        let date = dayjs().format('DD/MM/YY - HH:mm');

        let day =  parseInt(dayjs().format('DD'));
        let month = parseInt(dayjs().format('MM'));
        let year = parseInt(dayjs().format('YY'));;

        cy.xpath("//div[@class='btn btn-default btn-sm pull-right'][contains(.,'Nuevo invoice manual')]").should('be.visible').click({force:true})
       
        cy.xpath('//*[@id="invoice_lines__description"]').type('Descripcion: ' + date, {force:true})
        cy.xpath('//*[@id="invoice_lines__unit_price"]').type(UF, {force:true})
        cy.get('#invoice_lines__quantity').type('1', {force:true})
        cy.get('#invoice_lines__community_id').select('Test de bloqueo (No usar)').should('have.value','58483')
        cy.xpath("//input[@type='submit']").click({force:true})

        // Editar fecha del Invoice
        cy.xpath("//div[@class='btn btn-default btn-sm pull-right'][contains(.,'Editar')]").should('be.visible').click({force:true})

        // Fecha con 1 dia de expiración
        if ((day - 16) < 1 && (month !=1)) {
            month = month -1;
            day = day + 14;
        } else if (((day - 16) < 1 && (month == 1))){
            day = day + 14
            month = 12
            year = year - 1
        }else {
            day = day - 16
        };
        
        if (month < 10){
            month = '0' + month 
        }
        
        let expDate = `${day}/${month}${year}`;

        cy.get('#invoice_expiration_date').clear().type(expDate,{force:true})
        cy.xpath("//input[@type='submit']").should('be.visible').click({force:true})
    })

    it('Saldar deuda excedida', () => { 
       
        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_SUPERADMIN(USER,PASS);

        // Buscar Comunidad

        BUSCAR_COMUNIDAD(COMUNIDAD_PRUEBA);

        // Iniciar sesión como Admin en la comunidad 'Test de Bloqueo'
        cy.get('[href="/admin/communities/log_as_user?user_id=1267142"] > .btn').click({force:true})
        cy.get('.in_middle > :nth-child(1) > a > .panel > .panel-body').click({force:true})
        cy.xpath("//div[@class='col-xs-12 commImg minReso content'][contains(.,'Test de bloqueo (No usar)')]").should('be.visible').click()

        // Verificar alerta de Bloqueo
        const ALERTA_PRESENTE = () => {
            cy.xpath("//strong[contains(.,'Servicio suspendido. Al parecer hay un atraso en el pago de tu servicio en ComunidadFeliz')]").should('be.visible')
        }
        
        // Verificar alerta de Bloqueo en todos los modulos
        const ALERTA_EN_MODULOS = () => {
            for(let i = 2; i < 11; i++){
                cy.xpath(`//html/body/div[1]/nav/ul/li[${i}]/a`).click({force:true})
                ALERTA_PRESENTE();
            }
        }
    
        ALERTA_EN_MODULOS()

        // Saldar deuda
        cy.get('#payment_type_transference').check({force:true}).should('be.checked');
        cy.get('#invoice_payment_document').selectFile(RUTA_COMPROBANTE, {force:true});
        cy.get('.total-billing').click({force:true});

        // Recorrer modulos
        const RECORRER_MODULOS = () => {
            for(let i = 2; i < 11; i++){
                cy.xpath(`//html/body/div[1]/nav/ul/li[${i}]/a`).should('be.visible').click({force:true})
            }
        }

        RECORRER_MODULOS()
    })
});