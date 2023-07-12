require('cypress-xpath')        // Selector de Xpath
require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-iframe')

const dayjs = require('dayjs')  // Importar fecha
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, INICIO_ADMIN, BUSCAR_COMUNIDAD,
    CIERRE_MODALES, RES_CIERRE_MODALES, RES_TERMINOS_CONDICIONES, OBTENER_FECHA_MANIANA, INICIO_VERCEL, PAGINA_INICIAL_VERCEL } = require('../cf_functions');

describe('Smoke Test Residents', () => {

    // ADMIN
    let nombreAdmin = 'Cypress'
    let apellidoAdmin = 'Pruebas'
    let dateAux = dayjs().format('DDMMYY');
    let mailAdmin = nombreAdmin + dateAux + '@gmail.com'
    
    // RESIDENTE
    
    let nombreRes = 'Res_Cyp'
    let apellidoRes = 'Pruebas'

    let mailRes = nombreRes + '_' + dateAux +'@gmail.com'
    let pass = 'feliz21.' 

    const NRO_TARJETA = Cypress.env('NUMERO_DE_TARJETA')
    const EXP_TARJETA = Cypress.env('FECHA_EXPIRACION_TARJETA')
    const CVV = Cypress.env('CVV')

    const RUT_TRANSBANK = Cypress.env('RUT_TRANSBANK')
    const PASS_TRANSBANK = Cypress.env('PASS_TRANSBANK')

    // VARIABLES

    const DATE = dayjs().format('DD/MM/YY - HH:mm');
    const DATE2 = dayjs().format('DD/MM/YY');

    const NOMBRE = 'CC Cypress - ' + DATE;
    let NOMBRE2 = 'CC Cypress - ' + DATE2;

    // RUTS

    const RUT = [115057588,130314074,199598562,151932444,240642301,237966503,216315006,
        139968557,210185445,66777081,"23662403k",150022959,55351295,178564986,155893540,217517540,
        172284779,173224907,154119345,206526548,137780518,162109987,175406042,123910966,210714014,
        76577471,217345820,239704751,225185328,"20666990k",176579110,"13365657k","18122939k",65755297,
        209084740,218757707,153119538,64570706,53027881,233319643,70148420,232333383,110645848,
        221707125,106301239,188681344,159438317,171682878,170137477,139673778,186730828,161123021,
        206378654,144015541,116772973,"17320549k",204219729,133646337,144950844,69827187,133536604,
        178640348,182164429,162190768,155179406,88284267,75195761,228510211,193580696,"5757724k",
        91293943,156923982,244448534,169520267,177059382,169272328,156007692,115394533,223539769,
        232193980,"17935215k",248951591,214500345,174473595,126224974,195829853,102542924,199584472,
        197738871,53177506,180762752,184177544,99724544,59524720,216906667,110801734,50678245,148604339,
        "22141277k",198778893]

    // FUNCIONES

    const INICIO_COMUNIDAD_SUPERADMIN = () => {
        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD();
        // Acceder como SuperAdmin
        cy.xpath("(//div[@class='btn btn-xs btn-green-cf'][contains(.,'Superadmin')])[1]").click({force:true});
    }

    const INICIO_RES = () => {
        //INICIO_ADMIN(mailRes,pass)
        INICIO_VERCEL(mailRes, pass)
    }

    // TEST CASES

    before(()=>{
        cy.fixture('cf_fixture').then(data => {
            globalThis.data = data;

            // SUPER ADMIN
            globalThis.WEB = data.WEB_5
            globalThis.VERCEL = data.VERCEL
            globalThis.USER = data.USER_5
            globalThis.PASS = data.PASS_5

            // EXCEL
            globalThis.RUTA_PROPIEDADES = data.RUTA_EXCEL_PROPIEDADES_CC
            globalThis.RUTA_PAGOS = data.RUTA_EXCEL_PAGOS_CC
        })
    })

    beforeEach(() => {
        DIMENSIONES();
    })

    const ID_COMUNIDAD = '65958'

    it.only('Crear Comunidad', () => {                

        PAGINA_INICIAL(WEB);

        let delay = 2000

        INICIO_SUPERADMIN(USER,PASS);

        // Módulo 'Nueva Comunidad'
        cy.xpath("(//a[contains(.,'Nueva comunidad')])[2]").should('be.visible').click({force:true})
                
        let rut = '11.111.111-1';
        let nombrePublico = 'Nombre Publico Prueba'
        let correoPublico = 'tc27@cf.cl'
        let direccion = 'Santiago, Chile'

        // Primera y Segunda Página
        cy.get('#community_name').type(NOMBRE,{force:true})
        //cy.get('#community_name').type('SC CYPRESS - RES',{force:true})
        
        cy.get('#community_identifications_attributes_0_identity').type(rut,{force:true})
        cy.get('#community_contact_name').type(nombrePublico,{force:true})
        cy.get('#community_contact_email').type(correoPublico,{force:true})
        cy.get("#community_count_csm").click({force:true})
        // País
        cy.get('#community_country_code').select('Chile',{force:true}).should('have.value','CL')
        cy.get('#autocomplete').type(direccion,{force:true}).tab()
        cy.xpath("//input[@type='submit']").click({force:true}).as("Submit Primera página").wait(500)

        // Mail de contacto
        cy.get('#account_account_contacts_attributes_1__destroy').click({force:true})
        cy.xpath("//input[@type='submit'][contains(@value,'Guardar')]").click({force:true}).as("Submit Segunda página")

        // Otorgar permisos 
        cy.wait(500).reload().wait(1500)
        cy.get('.round').click({force:true})
        cy.xpath("//span[contains(@id,'notice')][contains(.,'Permisos otorgados exitosamente. Ahora tienes permisos temporales en esta comunidad')]").should('be.visible')
        cy.xpath("//a[contains(@data-title,'Actualmente cuentas con permisos en este módulo')]").should('be.visible')

        // Importar Propiedades
        cy.wait(1000).reload()
        cy.get('#excel_upload_name').select('Copropietarios',{force:true}).should('have.value','Copropietarios')
        cy.get('#excel_upload_excel').wait(delay).selectFile(RUTA_PROPIEDADES,{force:true}).wait(delay)
        cy.xpath("//input[contains(@value,'Subir')]").click({force:true})
        
        // Corroboar la importación de Propiedades
        for(let i=1; i < 6;i++ ){
            cy.xpath(`(//td[contains(.,'A${i}')])[1]`).should('be.visible')
        }
        
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        
        // Importar Pagos

        cy.wait(500).reload()
        cy.get('#excel_upload_name').select('Saldos',{force:true}).should('have.value','Saldos')
        cy.get('#excel_upload_excel').wait(delay).selectFile(RUTA_PAGOS,{force:true}).wait(delay)
        cy.xpath("//input[contains(@value,'Subir')]").click({force:true})

        // Corroboar la importación de Pagos
        for(let i=2; i < 6;i++ ){
            cy.xpath(`(//input[contains(@value,'A')])[${i}]`).should('be.visible')
        }
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        
        // Configurar Admin
        cy.get('#user_first_name').scrollIntoView()
        cy.get('#user_first_name').clear({force:true}).type(nombreAdmin,{force:true})
        cy.get('#user_last_name').clear({force:true}).type(apellidoAdmin,{force:true})
        cy.get('#user_email').clear({force:true}).type(mailAdmin,{force:true})
        cy.get('#user_password').clear({force:true}).type(pass,{force:true})
        cy.get('#user_password_confirmation').clear({force:true}).type(pass,{force:true})
        cy.xpath("//input[contains(@value,'Asignar Administrador')]").click({force:true})

        cy.xpath("//span[contains(@id,'notice')][contains(.,'Administrador ingresado')]").should('be.visible')
    })
//*******************************************************************************
    it('Redireccionamiento a Residents',() => {  

        PAGINA_INICIAL(WEB);

        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD();

        // Ver
        cy.xpath("//div[@class='btn btn-xs btn-default'][contains(.,'Ver')][1]").should('be.visible').click({force:true}).wait(1500)

        // Settings (Mostrar/Ocultar)
        cy.xpath("//div[contains(@target,'.collapse')]").should('be.visible').click({force:true})

        // Redireccionar a Residents (Si)
        cy.xpath("//div[@class='col-sm-3'][contains(.,'Redireccionar a Residents')]/following-sibling::div/select").select('Sí',{force:true}).should('have.value',1)
        // Guardar cambio individual
        cy.xpath("//div[@class='col-sm-3'][contains(.,'Redireccionar a Residents')]/following-sibling::div/following-sibling::div/input").should('be.visible').click({force:true})
        cy.xpath("//span[contains(@id,'flash_notice') and contains (.,'Setting actualizada')]").should('be.visible')
    })
//*******************************************************************************    
    it.only('Editar Comunidad',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()
        
        CIERRE_MODALES();

        // Editar comunidad
        cy.xpath("//a[@class='no-underline'][contains(.,'Editar comunidad')]").click({force:true});
        cy.get('#setting_edit_tab').wait(1000).click({force:true});
        
        // Residentes (Accesos)
        cy.get('#heading_property_users_conf').click({force:true})

        cy.xpath("//label[text()='Nivel de acceso']/following-sibling::select").select('Acceso completo',{force:true}).should('have.value','1')
        cy.xpath("//label[text()='Acceso a módulo de espacios comunes']/following-sibling::select").select('Administrador y residentes',{force:true}).should('have.value','2')

        // Con Control de Periodo
        cy.xpath("//label[contains(.,'La comunidad trabaja con Control por Período')]/following-sibling::select").select('Sí',{force:true}).should('have.value','0')
        //cy.xpath("//label[contains(.,'La comunidad trabaja con Control por Período')]/following-sibling::select").select('No',{force:true}).should('have.value','1')

        // Remuneraciones
        cy.xpath("//label[text()='Remuneraciones']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')

        // Enviar Correos
        cy.xpath("//label[text()='Correos enviados']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')
        
        cy.xpath("(//input[@value='Guardar'])[@name='commit'][11]").click({force:true})
        cy.get('.flash-success').should('be.visible')

    })
//*******************************************************************************
    it.only('Crear Publicación', () => {
                
        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()

        // ADMIN
        // INICIO_ADMIN(mailAdmin, pass)

        CIERRE_MODALES();

        const TITULO = 'Cypress - ' + DATE
        const CONTENIDO = 'Contenido de la publicación - ' + DATE

        for (let i = 1; i <= 4; i++){
            // Panel
            cy.get("#sidebar-panel").click({force:true})

            // Crear Publicacion
            cy.get("div").contains('Crear publicación').click({force:true});
            cy.get("#post_title").type(TITULO,{force:true})

            cy.get('#post_body').type(CONTENIDO,{force:true})

            // Adjuntar archivo
            if (i < 5 ) {
                cy.xpath("//input[@class='hidden']").selectFile(`cypress/e2e/CF/02_archivos/RES/publicacion${i}.jpg`, {force:true}).wait(2000)
            } else {
                cy.xpath("//input[@class='hidden']").selectFile("cypress/e2e/CF/02_archivos/RES/prueba3.png", {force:true}).wait(2000)
            }

            // Casilla 'Descargar al crear'
            cy.get('#post_download_on_create').uncheck()

            cy.get('#submit-button').should('be.visible').click({force:true})
            cy.get('#confirm-modal').should('be.visible').click({force:true})
            cy.get('.flash-success').should('be.visible').as(`Publicación N°${i} creada`)
        }
    })
//*******************************************************************************
    it('Eliminar Publicaciones', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()

        // INICIO_ADMIN(mailAdmin, pass);
        
        CIERRE_MODALES();

        cy.xpath("//div[@class='btn btn-default btn-xs'][contains(.,'Ver todas las publicaciones')]").click({force:true}).wait(1000)

        let cantidad = []

        cy.xpath("(//small[contains(.,'Borrar')])").each(($el,index) => {
            cantidad[index] = $el
        }).then(()=> {
            for(let i = 0; i < cantidad.length; i++) {
                cy.xpath("(//small[contains(.,'Borrar')])[1]").wait(500).click({force: true}).click({force: true}).wait(500)
                cy.xpath("//button[@type='submit']").click({force: true})
                cy.get('.flash-success').should('be.visible').as(`Publicación Eliminada`)
            }
        })
    })
//*******************************************************************************
    it('Editar Pago en Linea',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()

        // Editar comunidad
        cy.xpath("//a[@class='no-underline'][contains(.,'Editar comunidad')]").click({force:true});
        
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
        cy.get('#heading_payments_conf').should('be.visible').wait(2000).click({force:true}).wait(2000)

        cy.xpath("//label[contains(.,'Pago en línea')]/following-sibling::select").select('Habilitado',{force:true}).should('have.value',1)
        cy.xpath("(//input[@value='Guardar'])[11]").should('be.visible').click({force:true})

    })
//*******************************************************************************
    it.only('Crear Fondos', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()

        // INICIO_ADMIN(mailAdmin, pass);

        CIERRE_MODALES();

        // Fondos
        cy.xpath("//a[@class='no-underline'][contains(.,'Editar comunidad')]").click({force:true});

        for (let i = 1; i < 6; i++) {
            cy.get("#funds_edit_tab").click({force:true});

            // Nuevo fondo
            cy.xpath("//div[@data-intro='Agregar nuevo fondo']").click({force:true}).wait(1500)
            cy.get("#fund_name").type(`Fondo 00${i}`)
            cy.get("#fund_price").type(`Fondo ${i}000`)
            cy.xpath("//input[@value='Crear']").click({force:true})
            cy.get('.flash-success').should('be.visible').as(`Fondo N°${i}`)
        }
    })
//*******************************************************************************
    it('Eliminar Fondos', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        INICIO_COMUNIDAD_SUPERADMIN()
        
        // INICIO_ADMIN(mailAdmin, pass);

        CIERRE_MODALES(); // En caso de fallos al probar este Test individualmente como Admin, dejarlo comentado

        // Fondos
        cy.xpath("//div[@class='btn btn-success btn-block btn-home'][contains(.,'Editar comunidad')]").click({force:true}).wait(700);
        cy.get("#funds_edit_tab").click({force:true});
  
        let cantidad = []

        cy.xpath("//div[contains(@class,'fa fa-trash-o')]").each(($el,index) => {
            cantidad[index] = $el
        }).then(()=> {
            for(let i = 0; i < cantidad.length; i++) {
                cy.xpath("(//div[contains(@class,'fa fa-trash-o')])[1]").should('be.visible').click({force:true})
                cy.get('.flash-success').should('be.visible').wait(700).as(`Fondo eliminado`)
            }
        });     

    })
//*******************************************************************************
    it.only('Egresos contra Fondos', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin, pass);

        CIERRE_MODALES();

        const SELECT_FONDO = "Fondo 001" // Actualizar Value
        const DESCRIPCION = 'BBB FONDO'
        
        for (let i = 1; i < 4; i++) {
            // Egresos
            cy.xpath("//span[contains(.,'Egresos')]").click({force:true});
            cy.xpath("//div[@class='btn btn-green-cf btn-block '][contains(.,'Nuevo Egreso')]").click({force:true});
            cy.get("#service_billing_name").type(`${DESCRIPCION} ${i}`,{force:true})

            cy.get("#service_billing_price").type(`${i}000`,{force:true})
            cy.xpath("//select[contains(@class,'form-control proratable_select')]").select(SELECT_FONDO,{force:true})
            cy.get("#submit_button_service_billing").click({force:true})
            cy.get('.flash-success').should('be.visible').as(`Egreso N°${i}`)
        }
    })
//*******************************************************************************
    it.only('Ingresos contra Fondos', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()
        
        INICIO_ADMIN(mailAdmin, pass);

        CIERRE_MODALES(); // En caso de fallos al probar este Test individualmente como Admin, dejarlo comentado

        const SELECT_FONDO = "Fondo 001" // Actualizar Value
        const DESCRIPCION = 'AA INGRESO'
      
        for (let i = 1; i < 4; i++) {
            // Egresos
            cy.xpath("//span[contains(.,'Ingresos extraordinarios')]").click({force:true});
            cy.xpath("//div[@data-intro='Agregar nuevo ingreso.']").click({force:true});

            cy.get("#income_name").type(`${DESCRIPCION} 00${i}`,{force:true})
            cy.get("#income_price").type(`${i}000`,{force:true})
            cy.get("#income_note").type(`Ingreso de prueba ${DESCRIPCION} ${i}`)
            
            cy.get("#income_fund_id").select(SELECT_FONDO,{force:true})
            cy.xpath("//input[@type='submit']").click({force:true})
            cy.get('.flash-success').should('be.visible').as(`Ingreso N°${i}`)

        }
    })
//*******************************************************************************
    it.only('Crear Residente', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin, pass);

        CIERRE_MODALES();
        const RES_PASS = 'feliz21.'

        // Módulo Residentes
        cy.xpath("//span[contains(.,'Residentes')]").click({force:true})
        
        // Nuevo Residente
        cy.xpath("//div[@class='btn btn-green-cf btn-block height-search-btn'][contains(.,'Nuevo residente')]").click({force:true})
        cy.get("#search_email").type(mailRes,{force:true})
        cy.get('#search_email_btn').click({force:true}).wait(2000)

        cy.get("#user_first_name").type(nombreRes,{force:true})
        cy.get("#user_last_name").type(apellidoRes,{force:true})

        let unidad = 'A1'
        let rol = 'Arrendatario' // lessee
//      let rol = 'Dueño' // owner
//      let rol = 'Corredor' // broker

        cy.get('.multiselect').click({force:true})
        cy.xpath(`(//label[contains(.,'${unidad}')])[1]`).click({force:true})
        cy.get('#property_user_role').select(rol,{force:true}).should('have.value','lessee')
        cy.get('#property_user_in_charge').select('Si',{force:true}).should('have.value','true')

        cy.get("#property_user_save_btn").click({force:true})

        // Cambiar contraseña
        cy.get("div").contains('Enviar claves de acceso').click({force:true})
        cy.get('#new_password').clear().type(RES_PASS,{force:true})
        cy.get('#community_notify').click({force:true})
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        cy.get('.flash-success').should('be.visible')

    })
//*******************************************************************************
    it.only('Recaudación / Egresos / Cargos / Ingresos',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)

        CIERRE_MODALES()

        let descripcion = 'Egreso Cypress - ' + DATE;
        let monto = 10000;
        let cuotas = 5;
        let porcFondoReserva = 50

        // ----------------------------------------------------------------------------------------------------------------------

        // Módulo Recaudación
        for (let i = 1; i <= 4; i++) {

            cy.get("#sidebar-bill").should("be.visible").click({force: true});
        
            // Nuevo Pago
            cy.get("#new_payment").click({force:true})

            // Seleccionar unidad (Primer ciclo es pago no reconocido)
            cy.get('.multiselect').should("be.visible").click({force:true})
            
            if(i == 1){
                cy.xpath(`//label[contains(.,'Ninguno')]`).should("be.visible").click({force:true})
            }else{
                cy.xpath(`//label[contains(.,'A${i-1} -')]`).should("be.visible").click({force:true})
            }

            // Formas de cobro
            if (i == 1){
                cy.get('#payment_payment_type').select('Cheque',{force:true}).should('have.value','cheque');
            } else if (i == 2){
                cy.get('#payment_payment_type').select('Efectivo',{force:true}).should('have.value','cash');
            } else if (i == 3){
                cy.get('#payment_payment_type').select('Transferencia',{force:true}).should('have.value','transference');
            } else {
                cy.get('#payment_payment_type').select('Ajuste',{force:true}).should('have.value','adjustment');
            }

            // Monto
            let monto = i + '000'
            cy.get('#price_new_payment').should("be.visible").type(monto, {force: true});

            // Crear
            cy.get('#submit-button').click({force:true}).as(`Pago N°${i} realizado`)
        }

        // ----------------------------------------------------------------------------------------------------------------------

        // Módulo Egresos
        cy.get('#sidebar-service-billing').click({force:true})

        // Crear 3 Egresos diferentes
        for (let i = 0; i <= 2; i++) {
            cy.xpath("//div[contains(@data-intro,'Agregar nuevo egreso.')]").click({force:true})
            cy.get("#service_billing_name").type(`${descripcion} - ${i+1}`,{force:true})
            cy.get('#service_billing_price').type(monto, {force:true})

            // Pago sin cuotas
            if (i == 0){
                cy.get('#category_id').select('Administración', {force:true})
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true}).as(`Egreso sin cuotas realizado`)
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})

            // Pago con cuotas 
            } else if (i == 1){
                cy.get('#category_id').select('Mantención', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true}).as(`Egreso con cuotas realizado`)
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            
            // Pago con cuotas y porcentaje en fondo de reserva 
            } else {
                cy.get('#category_id').select('Reparación', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#show-advanced-proratable').click({force:true})
                cy.xpath("(//input[contains(@id,'sb-proratable')])[1]").clear({force:true}).type(porcFondoReserva,{force:true})
                
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true}).as(`Egreso con cuotas a fondos realizado`)
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            }
        } 
        
        // ----------------------------------------------------------------------------------------------------------------------

        // Módulo Cargos
        const MODULO_CARGOS = () => {
            cy.xpath("//div[@class='divLink'][contains(.,'Cargos')]").should("be.visible").click({force: true});
        }
    
        MODULO_CARGOS();

        // Crear 3 cargos con distintas formas de cobro
        for (let i = 1; i <= 3; i++) {
    
            // Nuevo Cargo
            cy.get("a").contains('Nuevo cargo').should("be.visible").click({force: true});

            // Seleccionar unidad
            cy.get('.multiselect').should("be.visible").click({force:true})
            cy.xpath(`//label[contains(.,'A${i} -')]`).should("be.visible").click({force:true})

            // Nombre y monto
            let monto = i + '0.000'
            cy.get("#property_fine_title").should("be.visible").type(`Cargo Cypress 0${i}`, {force: true});
            cy.get("#property_fine_price").should("be.visible").type(monto, {force: true});

            // Formas de cobro
            if (i == 1){
                cy.get('#charge_method').select('Cobrar en una próxima boleta',{force:true}).should('have.value',0);
            } else if (i == 2){
                cy.get('#charge_method').select('Se cobrará por otro medio',{force:true}).should('have.value',1);
            } else {
                cy.get('#charge_method').select('Cobrar ahora y generar deuda',{force:true}).should('have.value',2);
            }

            // Crear
            cy.xpath("//input[@type='submit']").click({force:true}).as(`Cargo N°${i} realizado`)
        }

        // ----------------------------------------------------------------------------------------------------------------------

        // Módulo Ingresos Extraordinarios
        const MODULO_INGRESOS = () => {
            cy.xpath("//span[contains(.,'Ingresos extraordinarios')]").click({force: true});
        }

        MODULO_INGRESOS();

        // Crear 3 ingresos con distintas formas de cobro
        for (let i = 1; i <= 3; i++) {

            // Nuevo Ingreso
            cy.xpath("//div[contains(@data-intro,'Agregar nuevo ingreso.')]").should("be.visible").click({force: true});

            // Nombre y monto
            let monto = i + '00'
            cy.get("#income_name").should("be.visible").type(`Ingreso Cypress 0${i}`, {force: true});
            cy.get("#income_price").should("be.visible").type(monto, {force: true});

            // Medio de pago
            if (i == 1){
                cy.get('#income_payment_type').select('Efectivo',{force:true}).should('have.value',1);
            } else if (i == 2){
                cy.get('#income_payment_type').select('Transferencia',{force:true}).should('have.value',2);
            } else {
                cy.get('#income_payment_type').select('Depósito',{force:true}).should('have.value',3);
            }

            // Comentario
            cy.get("#income_note").type(`Ingreso Cypress ${i}`,{force:true})

            // Crear
            cy.xpath("//input[@type='submit']").click({force:true}).as(`Ingreso N°${i} realizado`)
        }
    })
//*******************************************************************************
    it('Gasto Común (ADMIN)',() => {
        
        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin, pass);
        CIERRE_MODALES();

        cy.xpath("//div[@class='divLink'][contains(.,'Gastos comunes')]").should('be.visible').click({force:true}).wait(1500)
        
        cy.xpath("//a[contains(@id,'#warnings-button')]").should('be.visible').click({force:true})

        cy.xpath("//div[@class='btn btn-light-blue btn-xs pull-right'][contains(.,'Actualizar')]").click({force:true})
        cy.xpath("//input[@id='confirm-continue']").wait(1500).check({force:true}).wait(1500)
        cy.xpath("//input[@id='continue-button']").click({force:true}).wait(1500)

        // Confirmar cierre
        cy.get("#submit_button").wait(1000).click({force:true})
        cy.get('#confirm_button').click({force:true})
        cy.get('#confirm_password_password').type(pass,{force:true})
        cy.get('#password_confirmation_submit_button').click({force:true})

        cy.get('.flash-warning').each(($el) => {

        const TEXT1 = $el.text()
        const RESULTADO = TEXT1.includes('Procesos trabajando internamente')
        
        if (RESULTADO){
            cy.xpath("//span[contains(@id,'flash')]").should('contain','Procesos trabajando internamente').as('recalculando_gastos').wait(8000)
        }
        })
    })
//*******************************************************************************
    it.only('Registro solicitud de propiededad (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(5000)
        RES_CIERRE_MODALES()

        cy.wait(2000)
        
        // INDICAR EN EL PARAMETRO DEL FOR LAS UNIDADES A REGISTRAR
        const PRIMERA_UNIDAD = 2
        const ULTIMA_UNIDAD = 4

        for (let i = PRIMERA_UNIDAD; i <= ULTIMA_UNIDAD; i++){

            // Acceder a 'Mis Propiedades'
            cy.xpath('(//button[contains(@class,"css-o8riuk")])[2]').should('be.visible').wait(500).click({force:true});
            cy.xpath("//div[@role='menuitem'][contains(.,'Mi cuenta')]").should('be.visible').click({force:true}).wait(2000);
            cy.xpath("//button[contains(.,'Mis propiedades')]").should('be.visible').click({force:true});

            // Agregar Propiedad
            cy.get('.css-194oiu6 > .css-fulwq1').should('be.visible').click();
            cy.xpath("//label[text()='Nombre de tu comunidad']/following-sibling::input").type(NOMBRE2).wait(1000);
            cy.xpath(`//div[@role='menuitem'][contains(.,'${NOMBRE2}')]`).click();

            // Agregar Unidad
            cy.xpath("//label[text()='Número de tu propiedad']/following-sibling::input").type(`A${i}`,{force:true})
            cy.xpath("(//div[contains(@role,'menuitem')])[2]").wait(1000).click();

            // Rol
            if (i == PRIMERA_UNIDAD){
                cy.xpath("//button[@value='LESSEE']").click({force:true})    
            } else if (i == (PRIMERA_UNIDAD+1)){
                cy.xpath("//button[@value='BROKER']").click({force:true})    
            } else {
                cy.xpath("//button[@value='OWNER']").click({force:true})    
            }
           
            // Aceptar
            cy.xpath("//button[contains(.,'Continuar')]").click({force:true}).wait(1000)
            cy.xpath("//div[@role='alert'][contains(.,'Tu propiedad fue registrada con éxito')]")
            .should('be.visible').wait(3000).as(`Registro creado`)
        }
    })
//*******************************************************************************
    it('Eliminar registros de solicitud (ADMIN)',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.xpath("//a[@href='#herramientasSubmenu']").should('be.visible').click({force:true})
        cy.xpath("//div[@class='divLink'][contains(.,'Solicitudes de residentes')]").click({force:true})

        let cantidad = []
        
        cy.xpath("(//span[contains(@data-original-title,'Rechazar solicitud')])").each(($el,index) => {
            cantidad[index] = $el
        }).then(()=> {
            for(let i = 0; i < cantidad.length; i++) {
                cy.xpath("(//span[contains(@data-original-title,'Rechazar solicitud')])[1]").should('be.visible').click({force:true})
                cy.xpath("//span[contains(@id,'flash_notice')]").should('be.visible')
            }
        });     
    })
//*******************************************************************************
    it.only('Aceptar registros de solicitud (ADMIN)',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()
        
        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.xpath("//a[@href='#herramientasSubmenu']").should('be.visible').click({force:true})
        cy.xpath("//div[@class='divLink'][contains(.,'Solicitudes de residentes')]").click({force:true})

        let cantidad = []
        
        cy.xpath("(//span[contains(@data-original-title,'Confirmar solicitud')])").each(($el,index) => {
            cantidad[index] = $el
        }).then(()=> {
            for(let i = 0; i < cantidad.length; i++) {
                cy.xpath("(//span[contains(@data-original-title,'Confirmar solicitud')])[1]").should('be.visible').click({force:true})
                cy.xpath("//span[contains(@id,'flash_notice')]").should('be.visible')
            }
        });     
    })
//*******************************************************************************
    it.only('Validación de solicitud (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()
        
        cy.wait(8000)
        RES_CIERRE_MODALES()
       
        // Acceder a 'Mis Propiedades'
        cy.xpath('(//button[contains(@class,"css-o8riuk")])[2]').should('be.visible').click({force:true});
        cy.xpath("//div[@role='menuitem'][contains(.,'Mi cuenta')]").should('be.visible').click({force:true}).wait(2000);
        cy.xpath("//button[contains(.,'Mis propiedades')]").should('be.visible').wait(1500).click({force:true}).wait(1500);

        // Validar propiedades
        // Los elementos no tienen los tags suficientes como para implementar un for each estable
        for (let i = 1; i <= 3; i ++){
          
            cy.xpath("(//div[contains(.,'Sin Validar')])[6]/following-sibling::div/button[1]").click({force:true}).wait(2000)
            // Documento de titulo
            cy.xpath(`(//input[@type='file'])[1]`).selectFile('cypress/e2e/CF/02_archivos/RES/prueba.pdf',{force:true}).wait(1500)
            cy.xpath("//button[contains(.,'Enviar documentos')]").click({force:true}).wait(2000)
            cy.xpath("//div[@role='alert'][contains(.,'Documentos enviados con éxito')]").should('be.visible')
        }
    })
//*******************************************************************************
    it.only('Aceptación de validación (ADMIN)',() => {  

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()
        
        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.xpath("//a[@href='#herramientasSubmenu']").click({force:true})
        cy.xpath("//div[@class='divLink'][contains(.,'Solicitudes de residentes')]").click({force:true})

        let cantidad = []
        
        cy.xpath("//span[contains(@data-original-title,'Ver documento')]").each(($el,index) => {
            cantidad[index] = $el
        }).then(()=> {
            for(let i = 0; i < cantidad.length; i++) {
                cy.xpath("(//span[contains(@data-original-title,'Ver documento')])[1]").should('be.visible').click({force:true}).wait(3000)
                cy.xpath("//div[@class='btn btn-success w-100 mt-5 mb-5'][contains(.,'Aprobar')]").click({force:true})

                cy.get("#flash_notice").should('be.visible')
            }
        });     
    })
//*******************************************************************************
    it.only('Publicaciones (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        let cantidad = 0
        let aux = 2

        // Publicaciones en Home
        cy.get("article[type=button]").each(($el,index,$list) => {
            cantidad = $list.length
            aux = index + 1
            
            if (cantidad > 1 && index > 0) {
                
                cy.get(`article[type=button]:nth-child(${aux})`).should("be.visible").click({force:true})
                cy.get("button[type='button']").contains('Entendido').click({force:true}).as(index + "° Publicacion")
            }
        })

        // Publicaciones en Módulo
        cy.get("button[href='/comunidad/publicaciones']").click({force:true})
        cy.get("button[data-state*='closed'] > span").each(($el,index,$list) => {
             cantidad = $list.length
           
            if (cantidad > 1) {
                 cy.wrap($el).should("be.visible").click({force:true})
                 cy.get("button[type='button']").contains('Entendido').click({force:true}).as((index+1) + "° Publicacion")
            }
        })
    })
//*******************************************************************************
    it.only('Cartola (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        cy.xpath("//h2[contains(.,'Tu total a pagar es de')]/following-sibling::h1").invoke('text').then(($value_home) => { 
            cy.xpath("//div[@data-state='open'][contains(.,'Propiedad')]").click({force:true})
            cy.xpath("//p[contains(.,'Cartola')]").click({force:true}).wait(3000)
    
            // Verificar montos del home y cartola
            cy.xpath("//p[contains(.,'Tu total a pagar es de')]/following-sibling::p").invoke('text').then(($value_cartola) => { 
                if ($value_home == $value_cartola){
                    cy.xpath("//p[contains(.,'Tu total a pagar es de')]/following-sibling::p").should("be.visible").as('MONTO CARTOLA = HOME')
                } else {
                    // En caso que hayan diferencias de montos, lo cual no deberia suceder, se marca error
                    cy.console.error();
                }
            })
               
            cy.get('p').each(($el) => {
                    
                const TEXT1 = $el.text()
                const SALDO_INICIAL = TEXT1.includes('Saldo inicial')
                const PAGO = TEXT1.includes('Pago por')
                const GASTO_COMUN = TEXT1.includes('Gasto común')
                
                if (SALDO_INICIAL){
                    cy.wrap($el).as("Saldo inicial")
                }
                if (PAGO){
                    cy.wrap($el).as("Pago")
                }
                if (GASTO_COMUN){
                    cy.wrap($el).as("Gasto común")
                }
            })
        })
    })
//*******************************************************************************
    it.only('Crear Encomiendas (ADMIN)',() => {
        
        PAGINA_INICIAL(WEB);

        const MODAL_ENCOMIENDA = () => {

            cy.get('span').each(($el) => {
              
              const TEXT1 = $el.text()
              const RESULTADO = TEXT1.includes('Sumamos un nuevo módulo de Encomiendas')
          
              if (RESULTADO){
                cy.get("a[class*='shepherd-button shepherd-button-secondary-margin']").click({force:true}).as("MODAL ENCOMIENDA")
              } 
            })
        }

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.get("li").contains("Encomiendas").click({force:true}).wait(1000)

        MODAL_ENCOMIENDA()

        let nombre_recepcionado = "Cypress"
        let apellido_recepcionado = "Reciever"
        let comentario_encomienda = "Encomienda Cypress"

        // Crear x cantidad de encomiendas
        for (let i = 0; i < 6; i ++){

            // Seleccionar unidad
            cy.get("#package_property_id").select("A1",{force:true})

            let empleado = false

            // Verificar si existe el empleado
            cy.xpath("//*[@id='package_receiver']/option").each(($el)=>{
                const TEXT1 = $el.text()
                const RESULTADO = TEXT1.includes(`${nombre_recepcionado} ${apellido_recepcionado}`)

                if (RESULTADO){
                    empleado = true
                }

            }).then(()=>{

                // Si existe, lo selecciona
                if (empleado){
                    cy.get('#package_receiver').wait(1000).select(`${nombre_recepcionado} ${apellido_recepcionado}`,{force:true}).wait(1000)
                
                // Si no existe, lo crea
                } else {
                    cy.get('#package_receiver').wait(1000).select("Otro empleado",{force:true}).wait(1000)
                    cy.get("#collaborators_package_employee_first_name").type(nombre_recepcionado,{force:true}) 
                    cy.get("#collaborators_package_employee_last_name").type(apellido_recepcionado,{force:true})
                    cy.get("#submit-employee-form").click({force:true}) 
                }
            })

            // Comentario
            cy.get("#package_comment").wait(1000).type(comentario_encomienda,{force:true})
            
            // Crear
            cy.get('#submit-package-form-btn').wait(1000).click({force:true})
            cy.get("#flash_notice").should("be.visible").as("Encomienda Creada")
        }
    })
//*******************************************************************************
    it.only('Retirar Encomiendas (ADMIN)',() => {

        PAGINA_INICIAL(WEB);

        const MODAL_ENCOMIENDA = () => {

            cy.get('span').each(($el) => {
            
            const TEXT1 = $el.text()
            const RESULTADO = TEXT1.includes('Sumamos un nuevo módulo de Encomiendas')
        
            if (RESULTADO){
                cy.get("a[class*='shepherd-button shepherd-button-secondary-margin']").click({force:true}).as("MODAL ENCOMIENDA")
            } 
            })
        }

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.get("li").contains("Encomiendas").click({force:true}).wait(1000)

        MODAL_ENCOMIENDA()

        // Marcar salida a x cantidad de encomiendas
        for (let i = 1; i <= 3; i ++){
            cy.xpath(`(//span[@class='fa fa-check'])[1]`).wait(1000).click({force:true})
            cy.get("#submit-btn").click({force:true})
            cy.get("#flash_notice").should("be.visible").as("Encomienda Retirada").wait(1000)
            cy.xpath("(//a[@href='/encomiendas'][contains(.,'Por retirar')])[1]").click({force:true})
        }
    })
//*******************************************************************************
    it.only('Verificar Encomiendas (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(8000)
        RES_CIERRE_MODALES()

        cy.xpath("//button[contains(.,'Encomiendas')]").click({force:true})

        // Encomiendas por retirar
        let aux = 4

        cy.xpath("(//div[contains(.,'Nueva')])").each(($el,$index) => {
            if ($index >= aux) {
                cy.get($el).click({force:true})
                cy.get("button").contains("Cerrar").should("be.visible").click({force:true})
            }
        })

        // Encomiendas retiradas
        aux = 7
        cy.xpath("//button[contains(@id,'DELIVERED')]").click({force:true}).as("Retiradas").wait(1000)

        cy.xpath("(//div[contains(.,'Retirada')])").each(($el,$index) => {
            if ($index >= aux) {
                cy.get($el).click({force:true})
                cy.get("button").contains("Cerrar").should("be.visible").click({force:true})
            }
        })
    })
//*******************************************************************************
    it.only('Crear Visitas (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        // Visitas autorizadas
 
        // Default: i = 4
        for (let i=1; i <= 4; i++){

            let nombre_visita = "Visita Cypress - " + i 
            let mail_visita = USER

            cy.xpath("//button[contains(.,'Visitas')]").click({force:true}).wait(4000)

            cy.xpath("(//button[contains(.,'Nueva visita')])[1]").should("be.visible").click({force:true})
            cy.xpath("//button[contains(.,'Continuar')]").should("be.visible").wait(1000).click({force:true})

            cy.get('[name = "name"]').type(nombre_visita,{force:true})

            if (i == 2){
                cy.xpath("//input[@value='Visita']").click({force:true}).should("be.visible")
                cy.xpath("//div[@role='menuitem'][contains(.,'Proveedor')]").click({force:true}).as("Proveedor")
            } else if (i == 3){
                cy.xpath("//input[@value='Visita']").click({force:true}).should("be.visible")
                cy.xpath("//div[@role='menuitem'][contains(.,'Arrendatario')]").click({force:true}).as("Arrendatario")
            } else if (i == 4){
                cy.xpath("//input[@value='Visita']").click({force:true}).should("be.visible")
                cy.xpath("//div[@role='menuitem'][contains(.,'Otro')]").click({force:true}).as("Otro")
            } else {
                cy.xpath("//input[@value='Visita']").click({force:true}).should("be.visible")
                cy.xpath("//div[@role='menuitem'][contains(.,'Visita')]").click({force:true}).as("Visita")
            }

            // Compartir por mail
            cy.xpath("//button[@value='yes']").click({force:true})
            cy.xpath("//button[@value='mail']").click({force:true})
            cy.get('[name = "email"]').type(mail_visita,{force:true})

            // Guardar y compartir
            cy.xpath("//button[contains(.,'Guardar y compartir')]")
            .click({force:true}).as(`Visita Creada`)
        }
    })
//*******************************************************************************
    it('Eliminar Visitas (RES)',() => {  
   
        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        cy.xpath("//button[contains(.,'Visitas')]").click({force:true}).wait(1500)

        const ELIMINAR_VISITAS = () => {
            cy.xpath("(//span[@type='button'])").each(($el,$index) => {
                cy.wrap($el).click({force:true})
                cy.xpath("//div[@role='menuitem'][contains(.,'Eliminar')]").click({force:true})
                cy.xpath("//button[contains(.,'Quitar de esta lista')]").click({force:true})

                cy.xpath("(//div[contains(.,'Visita  eliminada con éxito')])[8]").should("be.visible").wait(1500)
            })
        }
        
        ELIMINAR_VISITAS()
    })
//*******************************************************************************
    it.only('Crear Visitas no autorizadas (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        let nombre_no_autorizado = "Persona no grata"
        let comentario = "Comentario de prueba"

        // Visitas no autorizadas

        for (let i =0;i<=2;i++){
            let randomNumber = Math.floor(Math.random() * 99) + 1;

            cy.xpath("//button[contains(.,'Visitas')]").click({force:true}).wait(2000)
            cy.get("button").contains('Nueva visita no autorizada').click({force:true})
            
            cy.xpath("//label[contains(.,'Nombre')]/following-sibling::input").type(nombre_no_autorizado,{force:true})
            cy.xpath("//label[contains(.,'RUT')]/following-sibling::input").type(RUT[randomNumber],{force:true})
            cy.xpath("//label[contains(.,'Comentario')]/following-sibling::input").type(comentario,{force:true})

            cy.xpath("//button[contains(.,'Guardar')]").click({force:true})
            cy.get("div").contains("Visita no autorizada registrada con éxito").should("be.visible").wait(1000)
        }
    })
//*******************************************************************************
    it('Eliminar Visitas no autorizadas (RES)',() => {  

        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        cy.xpath("//button[contains(.,'Visitas')]").click({force:true}).wait(3000)

        const ELIMINAR_VISITAS = () => {
            cy.xpath("//p[contains(.,'Persona no grata')]").each(($el,$index) => {
                cy.xpath("(//p[contains(.,'Persona no grata')])[1]").click({force:true})
                cy.get("span").contains("Quitar de esta lista").click({force:true})
                cy.get("span").contains("Sí").click({force:true})
                
                cy.xpath("//button[contains(.,'Quitar de esta lista')]").click({force:true})
                cy.get("div").contains("Visita no autorizada eliminada con éxito").should("be.visible").as("Visita Eliminada").wait(1500)
            })
        }
        ELIMINAR_VISITAS()
    })
//*******************************************************************************
    it.only('Votaciones (ADMIN)', () => {

        PAGINA_INICIAL(WEB);
        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        const TITLE_1 = "CIERRE HOY - " + DATE2
        const TITLE_2 = "CIERRE FUTURO - " + OBTENER_FECHA_MANIANA()
        const DESCRIPTION = "Fecha de creación: " + DATE
        const MOCION = "Mocion Cypress"      
        
        cy.get("span").contains("Votaciones").click({force:true})

        for (let i = 1; i <= 2; i++) {
        
            // Nueva votación
            cy.get("button").contains("Nueva votación").click({force:true})

            // Descripcion
            const IFRAME = cy.get('.cke_wysiwyg_frame').its('0.contentDocument.body')
            .should('be.visible').then(cy.wrap)

            IFRAME.clear().type(DESCRIPTION,{force:true})

            // Titulo
            if (i % 2 == 1) {
                cy.get('#survey_form_title').wait(500).type(TITLE_1,{force:true})
            } else {
                cy.get('#survey_form_title').wait(500).type(TITLE_2,{force:true})
            }

            // Mocion
            cy.get('#add_question').wait(500).click({force:true})
            cy.get('#question_name').type(MOCION,{force:true})

            // Fecha
            if (i % 2 == 1) {
                cy.get('#survey_end_at').type(DATE2,{force:true}).as("CIERRE HOY")
            } else {
                cy.get('#survey_end_at').type(OBTENER_FECHA_MANIANA(),{force:true}).as("CIERRE FUTURO")
            }

            // Submit
            cy.get("input").contains("Guardar y publicar").wait(2000).click({force:true})
            cy.get('.flash-success').should("be.visible")
        }
    })
//*******************************************************************************
    it.only('Votaciones (RES)', () => {
        
        PAGINA_INICIAL_VERCEL(VERCEL)
        INICIO_RES()

        cy.wait(4000)
        RES_CIERRE_MODALES()

        cy.get("button").contains("Votaciones").click({force:true}).wait(2000)

        cy.get("article").each(($el) =>{
            cy.wrap($el).click({force:true})
            cy.xpath("(//button[contains(@data-state,'unchecked')])[1]").click({force:true})
            cy.get("button").contains("respuesta").click({force:true})
            cy.get("div").contains("Tu respuesta fue enviada exitosamente").should("be.visible")
        })
    })
//*******************************************************************************
    it('Eliminar Votaciones (ADMIN)', () => {

        PAGINA_INICIAL(WEB);

        // SUPER ADMIN
        //INICIO_COMUNIDAD_SUPERADMIN()

        INICIO_ADMIN(mailAdmin,pass)
        CIERRE_MODALES()

        cy.get("span").contains("Votaciones").click({force:true}).wait(1500)

        cy.xpath("(//div[contains(@data-title,'Eliminar')])").each(($el) => {
            cy.xpath("(//div[contains(@data-title,'Eliminar')])[1]").click({force:true}).wait(1500)    
        })
    })
//*******************************************************************************
    it('Pago WebPay (RES)', () => {

        const DELAY = 500;

        PAGINA_INICIAL_VERCEL(VERCEL)
  
        cy.wait(5000)
        RES_CIERRE_MODALES()

        // Pagar en Linea
        cy.xpath("//button[contains(.,'Pagar en línea')]").invoke('attr','target','_self').click({ force: true });

        // Pagar $100 
        const MONTO_PAGAR = 100

        cy.get('#in_full_false').click({force:true}).wait(DELAY)
        cy.get('#amount').type(MONTO_PAGAR,{force:true})
        
        // Seleccionar WebPayPlus
        cy.xpath("//div[contains(@data-info,'WebpayPlus')]").click({force:true}).wait(DELAY).click({force:true})
        
        // Checkbox Términos y condiciones
        cy.get('#terms_and_conditions').click({force:true})

        cy.get('#submit-button').should('be.visible').click({force:true}).wait(1000)

        // Confirmar pago
        cy.xpath("//button[contains(.,'Confirmar Pago')]").click({force:true})
        
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
    it('Pago WebPay OneClick (RES)', () => {

        const AUX_MAIL = 'Cypress_231222_155314@gmail.com' 
        const DELAY = 500;

        PAGINA_INICIAL_VERCEL(VERCEL)
        RES_CIERRE_MODALES()

        // Pagar en Linea
        cy.xpath("//input[contains(@value,'Pagar en línea')]").click({force:true}).wait(DELAY)

        // Pagar $100 
        const MONTO_PAGAR = 100

        cy.get('#in_full_false').click({force:true}).wait(DELAY)
        cy.get('#amount').type(MONTO_PAGAR,{force:true})
        
        // Seleccionar WebPayPlus
        cy.xpath("//div[contains(@data-info,'WebpayOneClick')]").click({force:true}).wait(DELAY).click({force:true})
        
        // Checkbox Términos y condiciones
        cy.get('#terms_and_conditions').click({force:true})

        cy.get('#submit-button').should('be.visible').click({force:true}).wait(1000)

        // Confirmar pago
        cy.xpath("//button[contains(.,'Confirmar Pago')]").click({force:true})
        
        // Aceptar Modal de Términos y condiciones 
        RES_TERMINOS_CONDICIONES() 

        // Seleccionar Credito
        cy.xpath("//button[contains(.,'Crédito')]").click({force:true}).wait(DELAY)

        cy.get('#card-number').clear().type(NRO_TARJETA,{force:true}).wait(DELAY)
        cy.get('#card-exp').clear().type(EXP_TARJETA,{force:true}).wait(DELAY)
        cy.get('#card-cvv').clear().type(CVV,{force:true}).wait(DELAY)
        cy.get('.alert__terms > span').click({force:true}).wait(DELAY)    //  PARA EL OTRO MEDIO DE PAGO

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
    it('Desactivar Comunidad', () => { 

        PAGINA_INICIAL(WEB);

        let aux = 'CC Cypress -'

        INICIO_SUPERADMIN(USER,PASS);
        BUSCAR_COMUNIDAD(aux);
        
        let valorAsociado = 1000;
        let delay = 1500;

        cy.xpath("(//div[@type='button'])[contains(.,'Desactivar')][1]").wait(delay).click().wait(delay)
        cy.get('.btn-group > .multiselect').click({force: true})

        for (let i = 2; i < 6; i++ ){
            cy.xpath(`(//input[@type='checkbox'])[${i}]`).click({force: true})
        }

        cy.get('#leaving_community_currency_type').select('USD',{force: true}).should('have.value', 'USD')
        cy.get('#leaving_community_associated_value').clear().type(valorAsociado,{force: true})
        cy.get('#leaving_community_immediate_deactivation').check({force: true})
        cy.xpath("//input[contains(@value,'Guardar')]").click({force: true})

        cy.get('.flash-success').should("be.visible")
    })
});