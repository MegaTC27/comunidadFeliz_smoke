require('cypress-xpath')        // Selector de Xpath
require('cypress-plugin-tab')   // Tabulacion por comando

const dayjs = require('dayjs')  // Importar fecha
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, INICIO_ADMIN, BUSCAR_COMUNIDAD, CIERRE_MODALES, MEDIDORES, MODULO_CARGOS, MODAL_NUEVA_FUNCIONALIDAD} = require('../cf_functions');

describe('Smoke Test SC', () => {     

    // ADMIN
    let nombreAdmin = 'Cypress'
    let apellidoAdmin = 'Pruebas'
    let dateAux = dayjs().format('DDMMYY');
    let mailAdmin = nombreAdmin + dateAux + '@gmail.com'

    // RESIDENTE
    let nombreRes = 'Res_Cyp'
    let apellidoRes = 'Pruebas'
    let dateAux2 = dayjs().format('DDMMYY_hhmm');

    let mailRes = nombreRes + '_' + dateAux2 +'@gmail.com'

    // VARIABLES

    const DATE = dayjs().format('DD/MM/YY - HH:mm');
    const DATE2 = dayjs().format('DD/MM/YY');
    const NOMBRE = 'SC Cypress - ' + DATE;

    // TEST CASES

    before(()=>{
        cy.fixture('cf_fixture').then(data => {
            globalThis.data = data;

            // SUPER ADMIN
            globalThis.WEB = data.WEB_5
            globalThis.USER = data.USER_5
            globalThis.PASS = data.PASS_5

            // EXCEL
            globalThis.RUTA_PROPIEDADES = data.RUTA_EXCEL_PROPIEDADES_SC
            globalThis.RUTA_PAGOS = data.RUTA_EXCEL_PAGOS_SC

            // FACTURACION
            globalThis.FACT_SC = data.FACTURACION_SC
            globalThis.FACT_CER_SC = data.FACTURACION_CER_SC
        })
    })

    beforeEach(() => {
      DIMENSIONES();
      PAGINA_INICIAL(WEB);
    })

    it.only('Crear Comunidad', () => {                

        let delay = 1000

        INICIO_SUPERADMIN(USER,PASS);

        // Módulo 'Nueva Comunidad'
        cy.xpath("(//a[contains(.,'Nueva comunidad')])[2]").should('be.visible').click({force:true})
                
    //  let curp = '11.111.111-1';
        let nombrePublico = 'Nombre Publico Prueba'
        let correoPublico = 'tc27@cf.cl'
        let direccion = 'Monterrey, N.L., México'

        // Primera y Segunda Página
        cy.get('#community_name').type(NOMBRE,{force:true})
    //  cy.get('#community_identifications_attributes_0_identity').type(curp,{force:true}) // CURP (OPCIONAL EN SC)
        cy.get('#community_contact_name').type(nombrePublico,{force:true})
        cy.get('#community_contact_email').type(correoPublico,{force:true})
        cy.get("#community_count_csm").click({force:true})

        // País
        cy.get('#community_country_code').select('México',{force:true}).should('have.value','MX')
        cy.get('#autocomplete').type(direccion,{force:true}).tab()
        cy.get("#community_timezone").select("America/Mexico_City",{force:true}).should('have.value','America/Mexico_City')
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
    it.only('Editar Comunidad', () => {  

        let aux = 'cypress'
        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD(aux);
        
        // Acceder como SuperAdmin
        cy.xpath("(//div[@class='btn btn-sm btn-success'][contains(.,'Entrar a comunidad')])[1]").should('be.visible').click({force:true});

        // Editar comunidad
        cy.xpath("//div[@class='btn btn-success btn-block btn-home'][contains(.,'Editar comunidad')]").click({force:true});
        cy.get('#setting_edit_tab').wait(1000).click({force:true});
        
        // Con Control de Periodo
        cy.xpath("//label[contains(.,'La comunidad trabaja con Control por Período')]/following-sibling::select").select('No',{force:true}).should('have.value','1')

        // Remuneraciones
        cy.xpath("//label[text()='Remuneraciones']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')

        // Enviar Correos
        cy.xpath("//label[text()='Correos enviados']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')
        
        cy.xpath("(//input[@value='Guardar'])[@name='commit'][11]").click({force:true})
        //cy.get("#flash_notice").should('be.visible')

        // Facturacion
        let compania = 'ESCUELA KEMPER URGATE'
        let RFC = 'EKU9003173C9'
        let domFiscal = '20928'
        let passCSD = '12345678a'
        let regimen_fiscal = 'Personas Morales con Fines no Lucrativos'
        let periodicidad = '04 - Mensual'
        let archivo = FACT_SC
        let archivoCer =  FACT_CER_SC

        cy.get('#irs-mx_edit_tab').wait(300).click({force:true}).wait(300)

        cy.get('#mx_company_business_name').clear().type(compania,{force:true})
        cy.get('#mx_company_rfc').clear().type(RFC,{force:true})
        cy.get('#mx_company_postal_code').clear().type(domFiscal,{force:true})
        cy.get('#mx_company_fiscal_regime').select(regimen_fiscal,{force:true}).should('have.value','603')
        cy.get('#mx_company_periodicity').select(periodicidad,{force:true}).should('have.value','04')
        cy.get('#mx_company_csd_password').clear().type(passCSD,{force:true})

        cy.get('#mx_company_csd_key').should('be.visible').selectFile(archivo,{force:true})
        cy.get('#mx_company_csd_cer').should('be.visible').selectFile(archivoCer,{force:true})

        cy.xpath("(//input[@value='Guardar'])[@name='commit'][12]").should('be.visible').click({force:true})
        cy.get("#flash_notice").should('be.visible')
        
    })
//*******************************************************************************
    it('Editar Usuario', () => {

        let aux = 'cypress'
        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD(aux);

        // Acceder como SuperAdmin
        cy.xpath("(//div[@class='btn btn-sm btn-success'][contains(.,'Entrar a comunidad')])[1]").should('be.visible').click({force:true});

        let delay = 300
        let RFC = 'EKU9003173C9'
        let domFiscal = '20928'
        let razonSocial = "Razon Social Cypress"

        // Mi cuenta
        cy.xpath("(//a[contains(@data-title,'Mi Cuenta')])[1]").click({force:true})

        // Nombre (Primera opción)
        cy.xpath("(//span[contains(@class,'name')])[1]").click({force:true})
        // Editar
        cy.xpath("//button[contains(.,'Editar')]").click({force:true})
        
        // País
        cy.get("#user_country_code").select("México",{force:true}).should('have.value','MX')
        // RFC
        //cy.get("#user_identifications_attributes_0_identity").type(RFC,{force:true})
        // Razón Social
        cy.get("#user_fiscal_identification_attributes_name").clear().type(razonSocial,{force:true})
        // Domicilio Fiscal
        cy.get("#user_fiscal_identification_attributes_postal_code").clear().type(domFiscal,{force:true})
        // Regimen Fiscal
        cy.get("#user_fiscal_identification_attributes_fiscal_regime")
        .select("605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",{force:true})
        .should('have.value','605')
        // CFDI
        cy.get("#user_fiscal_identification_attributes_cfdi_use")
        .select("S01 - Sin efectos fiscales",{force:true})
        .should('have.value','S01')

        // Guardar
        cy.xpath("//input[contains(@value,'Guardar cambios')]").wait(1000).click({force:true}).click({force:true})
        cy.get("#flash_notice").should("be.visible")
    })
//*******************************************************************************
    it.only('Recaudación (Admin)', () => {

        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        const EXCEL_RECAUDACIONES = 'cypress/e2e/CF/02_archivos/CC/importar_recaudacion.xlsx'
        const DELAY = 1000
    
        const CREAR_PAGOS = (ciclos = 4, duplicados = false) =>{

            // Crear 4 pagos con distintos medios de pago
            for (let i = 1; i <= ciclos; i++) {
                    
                // Módulo Recaudación
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
                let monto = i + '0000'
                cy.get('#price_new_payment').should("be.visible").type(monto, {force: true});

                // Crear
                cy.get('#submit-button').click({force:true})

                // Verificar
                cy.get('.flash-success').should('be.visible')

                // Verificar alerta de posible pago duplicado
                if (duplicados == true){
                    cy.xpath("//span[contains(@id,'flash')]").each(($el) => {

                        const TEXT1 = $el.text()
                        const RESULTADO = TEXT1.includes('podría estar duplicado')
                        
                        if (RESULTADO){
                            cy.xpath("//span[contains(@id,'flash')]").should('contain','podría estar duplicado').as('alerta_duplicado')
                        }
                    })
                }
            }
        }

        // Crear pagos 
        CREAR_PAGOS()
    /*
        // Crear 'x' duplicados y verificar alerta (true)
        CREAR_PAGOS(2,true)

        // Notificar pagos
        cy.xpath("(//div[@data-original-title='Notificar pagos'])[1]").click({force:true})
        cy.xpath("//div[@class='btn btn-success btn-block pull-right'][contains(.,'Notificar')]").click({force:true})
        cy.get('#flash_notice').should('contain','Notificando comprobantes de pago')

        // Importar recaudaciones
        cy.get('#dropdown_menu_button_no_period_bills').should('be.visible').click({force:true})
        cy.xpath("//div[@class='dropdown-item dropdown-option weight-500'][contains(.,'Importar desde Excel')]").click({force:true})
        cy.get('#excel-file').wait(DELAY).selectFile(EXCEL_RECAUDACIONES,{force:true}).wait(DELAY)
        cy.get('#excel-upload-submit').click({force:true})

        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('contain','En proceso').wait(5000).reload()
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('contain','Importado')

        cy.get("#sidebar-bill").should("be.visible").click({force: true});

    */
        
    })
//*******************************************************************************
    it.only('Recaudación - Asignación Manual / Facturación', () => {
        
        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        let delay = 300

        // Módulo Recaudación
        cy.get("#sidebar-bill").should("be.visible").click({force: true});
        
        for (let i = 1; i <= 3; i++){

            let unidad_nro = 1
            let monto = i+'00'
            let descripcion = 'Asignacion manual 0' + i
            
            // Ver Unidad 1
            cy.xpath("(//button[contains(@class,'payment')])[1]").wait(delay).click({force:true})
            
            // Fecha
            cy.xpath(`(//input[contains(@name,'payment[paid_at]')])[${unidad_nro}]`).type(DATE2,{force: true});
            // Monto
            cy.xpath(`(//input[contains(@id,'payment_price')])[${unidad_nro}]`).type(monto,{force: true})
            
            // Medio
            if (i == 1){
                cy.xpath(`(//select[@id='payment_payment_type'])[${unidad_nro}]`).select('Cheque',{force: true}).should('have.value','cheque')
            } else if (i == 2){
                cy.xpath(`(//select[@id='payment_payment_type'])[${unidad_nro}]`).wait(delay).select('Efectivo',{force: true}).wait(delay).should('have.value','cash')
            } else {
                cy.xpath(`(//select[@id='payment_payment_type'])[${unidad_nro}]`).wait(delay).select('Transferencia',{force: true}).wait(delay).should('have.value','transference')
            } 

            // Descripcion
            cy.xpath(`(//input[@id='payment_description'])[${unidad_nro}]`).clear({force:true}).type(descripcion,{force: true})
            // Guardar
            cy.xpath(`(//button[@type='submit'])[1]`).should('be.visible').click({force: true}).wait(2000);
        }

        // Facturar
        cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Facturas')]").click({force:true}).wait(2000)

        MODAL_NUEVA_FUNCIONALIDAD()

        cy.xpath("//span[contains(.,'Facturar todo')]").wait(delay).click({force:true}).wait(delay)
        cy.xpath("//button[@class='btn btn-success'][contains(.,'Facturar todo')]").should('be.visible').click({force:true}).wait(5000)

    /*      Demora demasiado en finalizar internamente los procesos anteriores por lo que no puede cancelar, podemos agregar este codigo mas adelante
        // Cancelar factura
        cy.xpath("//a[contains(.,'Facturado')]").should('be.visible').click({force:true}).wait(1000)
        cy.xpath("(//div[@class='btn btn-xs btn-default btn-cancel'])[1]").click({force:true})
        cy.get("#cancel-motive-select").wait(delay).select("03 - No se llevó a cabo la operación",{force:true}).should('have.value','03')
        cy.get("#submit-cancel-form-btn").wait(4000).click({force:true})

        cy.get("#flash_notice").should('be.visible')
    */
    })
//*******************************************************************************
    it('Medidores (Admin)', () => {

        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        const NOMBRE_MEDIDOR = 'Medidor Smoke'
        const DESCRIPCION_MEDIDOR = 'Descripción Smoke'
        const PRECIO_M3 = '6.32'
        let datos = []

        MEDIDORES()

        // Gestionar Medidores
        cy.xpath("//div[@class='btn btn-success btn-xs pull-right'][contains(.,'Gestionar Medidores')]").click({force:true})

        cy.xpath("(//input[contains(@value,'Guardar')])").each(($el,index) => {
            datos[index]=$el.text()
        }).then(()=> {
            let total = datos.length;
            cy.xpath(`(//input[contains(@id,'meter_name')])[${total}]`).type(NOMBRE_MEDIDOR,{force:true})
            cy.xpath(`(//input[contains(@id,'meter_description')])[${total}]`).type(DESCRIPCION_MEDIDOR,{force:true})
            cy.xpath(`(//input[contains(@id,'meter_unit_price')])[${total}]`).type(PRECIO_M3,{force:true})
            cy.xpath(`(//input[contains(@value,'Guardar')])[${total}]`).click({force:true})
        })

        cy.get('.flash-success').should('be.visible')

        // Importar lecturas desde Excel

        MEDIDORES()
        cy.xpath("//span[contains(.,'Importar desde Excel')]").click({force:true})

        cy.get('#excel_upload_excel').wait(1000).selectFile("cypress/e2e/CF/02_archivos/SC/SC_Medidores_LecturasIniciales.xlsx",{force:true}).wait(1000)
        cy.xpath("//input[@type='submit']").click({force:true})

        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('contain','En proceso').wait(6000).reload()
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('contain','Importado')

    })
//*******************************************************************************
    it.only('Cargos (Admin)', () => {

        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();
        let delay = 500

        MODULO_CARGOS();

        // Crear 5 cargos 
        for (let i = 1; i <=5; i++) { //DEBEN SER 5 CICLOS

            // Nuevo Cargo
            cy.xpath("//div[contains(@data-intro,'nuevo cargo')]").should("be.visible").click({force: true});

            // Nombre y Descripcion 
            cy.get('#charge_name_txt').should("be.visible").type(`Cargo Cypress 0${i}`, {force: true});

            let monto = i + '0000'

            // A una unidad
            if (i == 1){
                cy.get('#add_property_fine_btn').wait(delay).click({force:true})
                cy.get('#property_fine_group_description').type(`Descripción 0${i} - Cargo a 1 unidad`, {force: true});
                cy.xpath(`(//input[contains(@id,'price')])[${i}]`).type(monto,{force: true}).wait(delay);

            // A todas las unidades
            } else if (i == 2){
                cy.get("#transient_distribution_slct").select("Todas las unidades",{force: true}).wait(delay).should('have.value','all_properties')
                cy.get('#property_fine_group_value').type(monto,{force: true});
                cy.get('#property_fine_group_description').type(`Descripción 0${i} - Cargo a todas las unidades`, {force: true}).wait(delay);

            // A algunas unidades
            } else if (i == 3){
                cy.get('#add_property_fine_btn').wait(delay).click({force:true})
                cy.get("#transient_distribution_slct").select("Personalizado",{force: true}).wait(delay).should('have.value','personalized')
                cy.get('#property_fine_group_description').type(`Descripción 0${i} - Cargo a algunas unidades`, {force: true}).wait(delay);

                // Cargar x cantidad de unidades
                for (let j = 1; j <=3; j++){
                    let monto2 = j + '0000'
                    if (j == 1){
                        cy.xpath(`(//input[contains(@id,'price')])[${j}]`).type(monto2,{force: true}).wait(delay);
                    } else {
                        cy.get('#add_property_fine_btn').click({force:true})
                        cy.xpath(`(//input[contains(@id,'price')])[${j}]`).type(monto2,{force: true}).wait(delay);
                    }
                }
            
            // A 1 unidad destinando a fondo de reserva                
            } else if (i == 4){
                cy.get("#transient_fund_slct").select("Fondo de reserva",{force: true}).wait(delay)
                cy.get('#add_property_fine_btn').wait(delay).click({force:true})
                cy.get('#property_fine_group_description').type(`Descripción 0${i} - Cargo a 1 unidad (Fondo de reserva)`, {force: true});
                cy.xpath(`(//input[contains(@id,'price')])[1]`).type(monto,{force: true}).wait(delay);

            // A 1 unidad con Descuento                
            } else {

                let desc_descuento = `Descripción 0${i} - Descuento`
                let monto_descuento = 2500

                cy.get('#property_fine_group_description').type(`Descripción 0${i} - Cargo a 1 unidad con DESCUENTO`, {force: true});
                cy.get('#add_property_fine_btn').wait(delay).click({force:true})
                cy.xpath(`(//input[contains(@id,'price')])[1]`).type(monto,{force: true});

                cy.xpath("//div[contains(@data-target-id,'deduction_body')]").click({force:true})
                cy.xpath("//a[contains(@id,'add_deduction_btn')]").wait(delay).click({force:true})
                cy.xpath("(//input[@value='Descuento por pronto pago'])[1]").clear().type(desc_descuento,{force:true})
                cy.xpath("(//input[contains(@placeholder,'$ 100.00')])[3]").clear().type(monto_descuento,{force:true}).wait(delay)

            }

            cy.xpath("//input[@type='submit']").click({force:true})
            cy.get('.flash-success').should('be.visible')   

        } 

        // Borrar todos los cargos 'Por cargo' 
        cy.xpath("//a[contains(.,'Por cargo')]").click({force:true})

        cy.xpath("(//span[contains(@class,'fa fa-trash-o')])").each(($list) => {
            
            for (let k = 1; k < $list.length; k++){
                cy.xpath(`(//span[contains(@class,'fa fa-trash-o')])[1]`).should('be.visible').wait(300).click({force: true})
                cy.xpath("//button[contains(.,'Confirmar')]").should('be.visible').wait(300).click({force: true}).wait(300)
            }
        })

        // Borrar cargos 'Por unidad' 
        cy.xpath("//a[contains(.,'Por unidad')]").click({force:true})
        cy.get('.multiselect').click({force:true})
        cy.xpath("//label[@class='radio'][contains(.,'Todas las unidades')]").click({force:true})
        cy.xpath("//input[contains(@value,'Buscar')]").click({force:true})

/*      Borrar todos (redirectionLimit)

        cy.xpath("(//span[contains(@class,'fa fa-trash-o')])").each(($list) => {
            for (let k = 1; k <= $list.length; k++){  // Borrar todos los cargos
                cy.xpath(`(//span[contains(@class,'fa fa-trash-o')])[1]`).should('be.visible').wait(300).click({force: true})
                cy.xpath("//div[@class='btn btn-danger'][contains(.,'Eliminar')]").should('be.visible').wait(300).click({force: true}).wait(300)
            }
        })
*/  
        for (let k = 1; k <= 3; k++){  // Borrar 3 cargos
            cy.xpath(`(//span[contains(@class,'fa fa-trash-o')])[1]`).should('be.visible').wait(300).click({force: true})
            cy.xpath("//div[@class='btn btn-danger'][contains(.,'Eliminar')]").should('be.visible').wait(300).click({force: true}).wait(300)
        }
    })
//*******************************************************************************
    it.only('Cargos (Admin) - Recargos y Descuentos', () => {
        
        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();
        let delay = 500

        MODULO_CARGOS();

        // Nuevo Cargo
        cy.xpath("//div[contains(@data-intro,'nuevo cargo')]").should("be.visible").click({force: true});
        // Nombre y Descripcion 
        cy.get('#charge_name_txt').should("be.visible").type(`Prueba Cypress - Recargo y Descuento`, {force: true});
        // A una unidad
        cy.get('#add_property_fine_btn').wait(delay).click({force:true})
        cy.get('#property_fine_group_description').type(`Descripción RyC - Cargo a 1 unidad`, {force: true});
        cy.xpath(`(//input[contains(@id,'price')])[1]`).type('1037',{force: true});

        cy.xpath("//input[@type='submit']").click({force:true})
        cy.get('.flash-success').should('be.visible').wait(300).reload()
        
        // Aplicar Recargo
        let monto_recargo = 500

        cy.xpath("(//a[contains(@data-original-title,'Configurar recargos y descuentos')])[1]").click({force:true})
        cy.get('#debt_surcharges_link').click({force:true})

        cy.xpath("//input[@class='form-control'][contains(@id,'price')]").clear().wait(500).type(monto_recargo,{force:true})
        cy.xpath("//select[@class='form-control']").select('Fondo de reserva',{force:true})
        cy.xpath("//input[contains(@id,'submitSurchargeBtn')]").click({force:true})

        cy.get('.flash-success').should('be.visible')

        // Aplicar Descuento
        let nombre_descuento = 'Descuento Cypress'
        let monto_descuento = 100

        cy.get('#debt_deductions_link').click({force:true})

        cy.xpath("//input[@id='deduction_name']").clear().type(nombre_descuento,{force:true})
        cy.xpath("//input[@id='deduction_price']").clear().type(monto_descuento,{force:true})
        cy.xpath("//input[contains(@id,'deduction_form_submit_btn')]").click({force:true})

        cy.get('.flash-success').should('be.visible')

        // *********** CARGOS POR MEDIDOR ***********

        MEDIDORES()
        let monton_cargoMedidor = 10050
        let descripcion_cargoMedidor = 'Cargo por Medidor - Cypress'

        cy.xpath("//div[@class='btn btn-success btn-xs pull-right'][contains(.,'Cargos por medidores')]").click({force:true})
        cy.xpath("//div[contains(@data-intro,'Agregar nuevo cargo.')]").click({force:true})

        cy.xpath("//input[contains(@id,'charge_name_txt')]").should("be.visible").type(descripcion_cargoMedidor, {force: true});

        // A una unidad
        cy.xpath("//a[@id='add_property_fine_btn']").wait(delay).click({force:true})
        cy.get('#property_fine_group_description').type(`Descripción - Cargo a 1 unidad`, {force: true});
        cy.xpath(`(//input[contains(@id,'price')])[1]`).type(monton_cargoMedidor,{force: true}).wait(delay);

        cy.xpath("//input[@type='submit']").click({force:true})
        cy.get('.flash-success').should('be.visible')   
    })
//*******************************************************************************
    it('Egresos (Admin)', () => {  

        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        let descripcion = 'Egreso Cypress - ' + DATE;
        let monto = 10000;
        let cuotas = 5;
        let porcFondoReserva = 50

        // Módulo Egresos
        cy.get('#sidebar-service-billing').click({force:true})

        // Crear 3 Egresos distintos

        for (let i = 0; i <= 2; i++) {
            cy.xpath("//div[@class='btn btn-success pull-right btn-block '][contains(.,'Nuevo Egreso')]").click({force:true})
            cy.get("#service_billing_name").type(`${descripcion} - ${i+1}`,{force:true})
            cy.get('#service_billing_price').type(monto, {force:true})

            // Pago sin cuotas
            if (i == 0){
                cy.get('#category_name').type('Administración', {force:true})
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})

            // Pago con cuotas 
            } else if (i == 1){
                cy.get('#category_name').type('Mantención', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            
            // Pago con cuotas y porcentaje en fondo de reserva 
            } else {
                cy.get('#category_name').type('Reparación', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#show-advanced-proratable').click({force:true}).wait(500)
                cy.xpath("//input[contains(@id,'sb-proratable-Fund')]").clear().type(porcFondoReserva,{force:true})
                
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            }
        }
            
        // Anular egresos

        let cantidad = 5;

        cy.xpath("(//div[contains(@data-original-title,'Opciones')])").each(($list) => {
            cantidad = $list.length
            }).then(() => {
                for (let i = 0; i < cantidad; i++) {
                    cy.xpath("(//div[@data-original-title='Opciones'])[1]").click({force:true})
                    cy.xpath("(//div[@class='dropdown-item'][contains(.,'Anular egreso')])[1]").should('be.visible').click({force:true})
                    cy.xpath("//a[contains(.,'Egresos cuota de mantenimiento')]").click({force:true})
                }
            })
    })
//*******************************************************************************
    it('Condóminos (Admin)', () => {
        
        let domFiscal = '20928'
        let RFC = 'EKU9003173C9'
        let passCSD = '12345678a'
        let regimen_fiscal = 'Personas Morales con Fines no Lucrativos'

        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        // Módulo Condóminos
        cy.xpath("//span[contains(.,'Condóminos')]").click({force:true})
        
        // Nuevo Condómino
        cy.xpath("//div[@class='btn btn-success pull-right btn-block'][contains(.,'Nuevo condómino')]").click({force:true})
        cy.get("#search_email").type(mailRes,{force:true})
        cy.get('#search_email_btn').click({force:true})

        cy.get("#user_first_name").type(nombreRes,{force:true})
        cy.get("#user_last_name").type(apellidoRes,{force:true})

        cy.get("#user_fiscal_identification_attributes_postal_code").clear({force:true}).type(domFiscal,{force:true})
        cy.get("#user_fiscal_identification_attributes_fiscal_regime").select("605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",{force:true}).should("have.value","605")
        cy.get("#user_fiscal_identification_attributes_cfdi_use").select("S01 - Sin efectos fiscales",{force:true}).should("have.value","S01")
        cy.get("#user_identifications_attributes_0_identity").clear({force:true}).type(RFC,{force:true})

        let unidad = 'A17'
        let rol = 'Arrendatario' // lessee
//      let rol = 'Dueño' // owner
//      let rol = 'Corredor' // broker

        cy.get('.multiselect').click({force:true})
        cy.xpath(`(//label[contains(.,'${unidad}')])[1]`).click({force:true})
        cy.get('#property_user_role').select(rol,{force:true}).should('have.value','lessee')
        cy.get('#property_user_in_charge').select('Si',{force:true}).should('have.value','true')

        cy.get("#property_user_save_btn").click({force:true})

        // Cambiar contraseña
        cy.xpath("//div[contains(@data-intro,'Configurar claves de acceso')]").click({force:true})
        cy.get('#new_password').clear().type(PASS,{force:true})
        cy.get('#community_notify').click({force:true})
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        cy.get('.flash-success').should('be.visible')

    })
//*******************************************************************************
    it('Recaudación - Anular Facturas', () => {
        
        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

        let delay = 300
        
        // Módulo Recaudación
        cy.get("#sidebar-bill").should("be.visible").click({force: true});

        // Facturar
        cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Facturas')]").click({force:true}).wait(2000)

        MODAL_NUEVA_FUNCIONALIDAD()

        // Cancelar factura
        cy.xpath("//a[contains(.,'Facturado')]").should('be.visible').click({force:true}).wait(1000)
        cy.xpath("(//div[@class='btn btn-xs btn-default btn-cancel'])[1]").click({force:true})
        cy.get("#cancel-motive-select").wait(delay).select("03 - No se llevó a cabo la operación",{force:true}).should('have.value','03')
        cy.get("#submit-cancel-form-btn").wait(4000).click({force:true})

        cy.get("#flash_notice").should('be.visible')

    })
//*******************************************************************************
    it.only('Desactivar Comunidad', () => { 

        //let aux = 'Cypress'
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