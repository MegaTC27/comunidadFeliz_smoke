require('cypress-xpath')        // Selector de Xpath
require('cypress-plugin-tab')   // Tabulacion por comando

const dayjs = require('dayjs')  // Importar fecha
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, INICIO_ADMIN, BUSCAR_COMUNIDAD, RES_CIERRE_MODALES, RES_TERMINOS_CONDICIONES } = require('../cf_functions');

describe('WebPay CC (Web 1)', () => {     
 
    // SUPER ADMIN
    const WEB = Cypress.env('WEB_SMOKE');
    const USER = Cypress.env('USER_5');
    const PASS = Cypress.env('PASS_5');

    // ADMIN
    let nombreAdmin = 'Cypress'
    let apellidoAdmin = 'Pruebas'
    let dateAux = dayjs().format('DDMMYY');
    let mailAdmin = nombreAdmin + dateAux + '@gmail.com'

    // RESIDENTE
    let nombreRes = 'Cypress'
    let apellidoRes = 'Pruebas'
    let dateRes = dayjs().format('DDMMYY_HHmmss');
    let mailRes = nombreRes + '_' + dateRes + '@gmail.com'

    const NRO_TARJETA = Cypress.env('NUMERO_DE_TARJETA')
    const EXP_TARJETA = Cypress.env('FECHA_EXPIRACION_TARJETA')
    const CVV = Cypress.env('CVV')

    const RUT_TRANSBANK = Cypress.env('RUT_TRANSBANK')
    const PASS_TRANSBANK = Cypress.env('PASS_TRANSBANK')

    // VARIABLES

    const DATE = dayjs().format('DD/MM/YY - HH:mm');
    const NOMBRE = 'CC Cypress - ' + DATE;
    
    const RUTA_PROPIEDADES = Cypress.env("RUTA_EXCEL_PROPIEDADES_CC")
    const RUTA_PAGOS = Cypress.env("RUTA_EXCEL_PAGOS_CC")

    // TEST CASES

    beforeEach(() => {
      DIMENSIONES();
      PAGINA_INICIAL(WEB);
    })

    it.only('Crear Comunidad', () => {                

        let delay = 1000

        INICIO_SUPERADMIN(USER,PASS);

        // Módulo 'Nueva Comunidad'
        cy.xpath("(//a[contains(.,'Nueva comunidad')])[2]").should('be.visible').click({force:true})
                
        let rut = '11.111.111-1';
        let nombrePublico = 'Nombre Publico Prueba'
        let correoPublico = 'tc27@cf.cl'
        let direccion = 'Santiago, Chile'

        // Primera y Segunda Página
        cy.get('#community_name').type(NOMBRE,{force:true})
        cy.get('#community_identifications_attributes_0_identity').type(rut,{force:true})
        cy.get('#community_contact_name').type(nombrePublico,{force:true})
        cy.get('#community_contact_email').type(correoPublico,{force:true})
        cy.get('#community_country_code').select('Chile',{force:true}).should('have.value','CL')
        cy.get('#autocomplete').type(direccion,{force:true}).tab()
        cy.xpath("//input[@type='submit']").click({force:true})
        cy.xpath("//input[@type='submit'][contains(@value,'Guardar')]").click({force:true})

        // Importar Propiedades
        cy.get('#excel_upload_name').select('Copropietarios',{force:true}).should('have.value','Copropietarios')
        cy.get('#excel_upload_excel').wait(delay).selectFile(RUTA_PROPIEDADES,{force:true}).wait(delay)
        cy.xpath("//input[contains(@value,'Subir')]").click({force:true})
        
        // Corroboar la importación de Propiedades
        for(let i=1; i < 5;i++ ){
            cy.xpath(`(//td[contains(.,'A${i}')])[1]`).should('be.visible')
        }
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        
        // Importar Pagos
        cy.get('#excel_upload_name').select('Saldos',{force:true}).should('have.value','Saldos')
        cy.get('#excel_upload_excel').wait(delay).selectFile(RUTA_PAGOS,{force:true}).wait(delay)
        cy.xpath("//input[contains(@value,'Subir')]").click({force:true})

        // Corroboar la importación de Pagos
        for(let i=2; i < 6;i++ ){
            cy.xpath(`(//input[contains(@value,'A')])[${i}]`).should('be.visible')
        }
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        
        // Configurar Admin
        cy.get('#user_first_name').clear({force:true}).type(nombreAdmin,{force:true})
        cy.get('#user_last_name').clear({force:true}).type(apellidoAdmin,{force:true})
        cy.get('#user_email').clear({force:true}).type(mailAdmin,{force:true})
        cy.get('#user_password').clear({force:true}).type(PASS,{force:true})
        cy.get('#user_password_confirmation').clear({force:true}).type(PASS,{force:true})
        cy.xpath("//input[contains(@value,'Asignar Administrador')]").click({force:true})

        cy.xpath("//span[contains(@id,'notice')][contains(.,'Administrador ingresado')]").should('be.visible')
    })
//*******************************************************************************
    it.only('Editar Comunidad',() => {  

        let aux = 'Cypress - 23/12/22 - 10:07'
        
        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD();
        
        // Acceder como SuperAdmin
        cy.xpath("//div[@class='btn btn-sm btn-success'][contains(.,'Entrar a comunidad')][1]").should('be.visible').click({force:true});

        // Editar comunidad
        cy.xpath("//div[@class='btn btn-success btn-block btn-home'][contains(.,'Editar comunidad')]").click({force:true});
        
        //----------------
        
        const CODIGO_COMERCIO = 597055555537
        const COMISION_CREDITO = 0.0270725
        const COMISION_DEBITO = 0.0270725

        // Portal de pagos
        cy.get("#payment-gateways_edit_tab").wait(1000).click({force:true}).wait(1000);

        // WebPay
        cy.get('#community_webpay_setting_attributes_commerce_code').should('be.visible').clear().type(CODIGO_COMERCIO,{force:true})
        cy.get('#community_webpay_setting_attributes_credit_commission').should('be.visible').clear().type(COMISION_CREDITO,{force:true})
        cy.get('#community_webpay_setting_attributes_debit_commission').should('be.visible').clear().type(COMISION_DEBITO,{force:true})

        // OneClick
        cy.get('#community_webpay_setting_attributes_commerce_code_oneclick').should('be.visible').clear().type(CODIGO_COMERCIO,{force:true})
        cy.get('#community_webpay_setting_attributes_credit_commission_oneclick').should('be.visible').clear().type(COMISION_CREDITO,{force:true})
        cy.get('#community_webpay_setting_attributes_debit_commission_oneclick').should('be.visible').clear().type(COMISION_DEBITO,{force:true})

        cy.xpath("(//input[@value='Guardar'])[12]").should('be.visible').click({force:true})
        cy.get('.flash-success').should('be.visible')

        // Configuración
        cy.get('#setting_edit_tab').should('be.visible').wait(2000).click({force:true});
        cy.get('#heading_payments_conf').should('be.visible').click({force:true})

        cy.xpath("//label[contains(.,'Habilitar pago en línea')]/following-sibling::select").select('Sí',{force:true}).should('have.value',1)
        cy.xpath("(//input[@value='Guardar'])[11]").should('be.visible').click({force:true})

        //----------------

        // Copropietario

        cy.xpath("//a[@href='/copropietarios']").should('be.visible').click({force:true})
        cy.xpath("//div[contains(@data-intro,'Agregar nuevo copropietario.')]").should('be.visible').click({force:true})

        // Crear Residente
        cy.get('#search_email').type(mailRes,{force:true})
        cy.get('#search_email_btn').click({force:true})

        cy.get('#user_first_name').type(nombreRes,{force:true})
        cy.get('#user_last_name').type(apellidoRes,{force:true})

        cy.get('#property_user_save_btn').click({force:true})

        // Cambiar clave
        cy.xpath("//div[contains(@data-intro,'Configurar claves de acceso')]").click({force:true})
        cy.get('#new_password').clear().type(PASS,{force:true})
        cy.xpath("//input[@type='submit']").click({force:true})
    })
//*******************************************************************************
    it.only('Inicio Residente', () => {

        const AUX_MAIL = 'Cypress_231222_155314@gmail.com' 
        const DELAY = 500;

        INICIO_SUPERADMIN(mailRes,PASS)
        RES_CIERRE_MODALES()

        // Pagar en Linea
        cy.xpath("//input[contains(@value,'Pagar en línea')]").click({force:true}).wait(DELAY)

        // Pagar $100 
        const MONTO_PAGAR = 100

        cy.get('#in_full_false').click({force:true}).wait(DELAY)
        cy.get('#amount').type(MONTO_PAGAR,{force:true})
        
        // Seleccionar WebPayPlus
        cy.xpath("//div[contains(@data-info,'WebpayPlus')]").click({force:true}).wait(DELAY).click({force:true})
        
        // Checkbox Términos y condiciones
        cy.get('#terms_and_conditions').click({force:true})

        cy.get('#submit-button').should('be.visible').click({force:true}).wait(1000)

        // Aceptar Modal de Términos y condiciones 
        RES_TERMINOS_CONDICIONES() 

        // Seleccionar Credito
        cy.xpath("//button[contains(.,'Crédito')]").click({force:true}).wait(DELAY)

        cy.get('#card-number').clear().type(NRO_TARJETA,{force:true}).wait(DELAY)
        cy.get('#card-exp').clear().type(EXP_TARJETA,{force:true}).wait(DELAY)
        cy.get('#card-cvv').clear().type(CVV,{force:true}).wait(DELAY)
        //cy.get('.alert__terms > span').click({force:true}).wait(DELAY)    //  PARA EL OTRO MEDIO DE PAGO

        cy.get('.submit').should('be.visible').click({force:true})

        // Transbank
        cy.get('#rutClient').clear().type(RUT_TRANSBANK,{force:true})
        cy.get('#passwordClient').clear().type(PASS_TRANSBANK,{force:true})
        cy.xpath("//input[@value='Aceptar']").click({force:true})

        cy.get("#vci").select("Aceptar",{force:true}).should('have.value','TSY')

        cy.xpath("//input[@type='submit']").click({force:true}).wait(3000)

        // Verificar Pago
        cy.get('.title-container').contains('¡Tu pago fue realizado con éxito!').should('be.visible')
        cy.xpath("//div[@class='btn btn-default btn-xs pull-right hidden-xs'][contains(.,'Volver')]").click({force:true}).wait(DELAY)
        cy.get('.btn-link').click({force:true}).wait(DELAY)
    })
//*******************************************************************************
    it.only('Desactivar Comunidad', () => { 

        let aux = 'Cypress - 23/12/22 - 10:07'

        INICIO_SUPERADMIN(USER,PASS);
        BUSCAR_COMUNIDAD();
         
        let valorAsociado = 1000;
        let delay = 500;

        cy.xpath("(//div[@type='button'])[contains(.,'Desactivar')][1]").wait(delay).click().wait(delay)
        cy.get('.btn-group > .multiselect').click({force: true})

        for (let i = 2; i <6; i++ ){
            cy.xpath(`(//input[@type='checkbox'])[${i}]`).click({force: true})
        }

        cy.get('#leaving_community_currency_type').select('USD',{force: true}).should('have.value', 'USD')
        cy.get('#leaving_community_associated_value').clear().type(valorAsociado,{force: true})
        cy.get('#leaving_community_immediate_deactivation').check({force: true})
        cy.xpath("//input[contains(@value,'Guardar')]").click({force: true})

        cy.log('*** FIN DEL TEST ***')

    })
});