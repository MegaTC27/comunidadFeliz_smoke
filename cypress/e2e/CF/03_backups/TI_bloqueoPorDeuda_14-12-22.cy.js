require('cypress-xpath')        // Selector de Xpath
const dayjs = require('dayjs')  // Importar fecha

describe('Pruebas TI', () => {     
    
    const WEB = 'https://test5.comunidadfeliz.com/';
    const USER = 'juan.treppo@comunidadfeliz.cl';
    const PASS = 'feliz21.';

    let comPrueba = 'test de bloqueo';
    let btnVer = '[href="/admin/communities/test-de-bloqueo-no-usar"] > .btn'

    let rutaComprobante = 'cypress/e2e/CF/02_archivos/1.jpg'
    
    const paginaInicial  = () => {
        cy.visit(WEB);
        cy.title().should('eq','ComunidadFeliz');      
    }

    const inicioSuperAdmin = () => {
        cy.get('#email').should('be.visible').type(USER)
        cy.get('#password').type(PASS)
        cy.xpath("//span[contains(.,'Inicia sesión')]").click({force:true})
    }

    const buscarComunidad = () => {
        cy.xpath("(//a[contains(.,'Comunidades')])[2]").should('be.visible').click({force:true})
        cy.get('#search').type(comPrueba,{force:true});
        cy.xpath("//input[contains(@value,'Buscar')]").should('be.visible').click({force:true})
    }

    const dimensiones = () => {
        cy.viewport(1400, 1000)
    }

    it('Crear deuda excedida', () => {                

        dimensiones();
        paginaInicial();
        inicioSuperAdmin();

        // Buscar Comunidad

        buscarComunidad();
        
        // Ver
        cy.get(btnVer).click({force:true});
        
        // Facturacion
        cy.xpath("//div[@class='btn btn-warning pull-right'][contains(.,'Facturación')]").should('be.visible').click({force:true})
        
        // Nuevo Invoice Manual
        let date = dayjs().format('DD/MM/YY - HH:mm');

        let day =  parseInt(dayjs().format('DD'));
        let month = parseInt(dayjs().format('MM'));
        let year = parseInt(dayjs().format('YY'));;

        const uf = 3500;

        cy.xpath("//div[@class='btn btn-default btn-sm pull-right'][contains(.,'Nuevo invoice manual')]").should('be.visible').click({force:true})
       
        cy.xpath('//*[@id="invoice_lines__description"]').type('Descripcion: ' + date, {force:true})
        cy.xpath('//*[@id="invoice_lines__unit_price"]').type(uf, {force:true})
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
            month = 12
            day = day + 14
        }else {
            day = day - 16
        };
        
        let expDate = `${day}/${month}${year}`;

        cy.get('#invoice_expiration_date').clear().type(expDate,{force:true})
        cy.xpath("//input[@type='submit']").should('be.visible').click({force:true})
    })

    Cypress.env('MI_ID')
    it('Saldar deuda excedida', () => { 
       
        dimensiones();
        paginaInicial();
        inicioSuperAdmin();
        buscarComunidad();

        // Iniciar sesión como Admin
        cy.get('[href="/admin/communities/log_as_user?user_id=1267142"] > .btn').click({force:true})
        cy.get('.in_middle > :nth-child(1) > a > .panel > .panel-body').click({force:true})
        cy.xpath("//div[@class='col-xs-12 commImg minReso content'][contains(.,'Test de bloqueo (No usar)')]").should('be.visible').click()

        // Verificar Bloqueo
        const alertaPresente = () => {
            cy.xpath("//strong[contains(.,'Servicio suspendido. Al parecer hay un atraso en el pago de tu servicio en ComunidadFeliz')]").should('be.visible')
        }
        
        // Recorrer todos los modulos
        const alertaEnModulos = () => {
            for(let i = 2; i < 11; i++){
                cy.xpath(`//html/body/div[1]/nav/ul/li[${i}]/a`).click({force:true})
                alertaPresente();
            }
        }
    
        alertaEnModulos()

        // Saldar deuda
        cy.get('#payment_type_transference').check({force:true}).should('be.checked');
        cy.get('#invoice_payment_document').selectFile(rutaComprobante, {force:true});
        cy.get('.total-billing').click({force:true});

        const recorrerModulos = () => {
            for(let i = 2; i < 11; i++){
                cy.xpath(`//html/body/div[1]/nav/ul/li[${i}]/a`).should('be.visible').click({force:true})
            }
        }

        recorrerModulos()

        cy.log('*** FIN DEL TEST ***')
    })
});