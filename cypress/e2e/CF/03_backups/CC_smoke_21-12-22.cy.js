require('cypress-xpath')        // Selector de Xpath
require('cypress-plugin-tab')   // Tabulacion por comando
const dayjs = require('dayjs')  // Importar fecha

//import { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, INICIO_ADMIN,BUSCAR_COMUNIDAD,CIERRE_MODALES } from 'T:/UDEMY/Cypress/cypress/e2e/CF/functions.js';
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, INICIO_ADMIN, BUSCAR_COMUNIDAD, CIERRE_MODALES } = require('../functions');

describe('Pruebas CC', () => {     
 
    // SUPER ADMIN
    const WEB = Cypress.env('WEB_5');
    const USER = Cypress.env('USER_5');
    const PASS = Cypress.env('PASS_5');

    // ADMIN
    let nombreAdmin = 'Cypress'
    let apellidoAdmin = 'Pruebas'
    let dateAux = dayjs().format('DDMMYY');
    let mailAdmin = nombreAdmin + dateAux + '@gmail.com'

    // VARIABLES

    const DATE = dayjs().format('DD/MM/YY - HH:mm');
    const NOMBRE = 'CC Cypress - ' + DATE;
    
    const RUTA_PROPIEDADES = Cypress.env("RUTA_EXCEL_PROPIEDADES_CC")
    const RUTA_PAGOS = Cypress.env("RUTA_EXCEL_PAGOS_CC")

    // TEST CASES

    it('Crear Comunidad', () => {                

        let delay = 1000

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
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
    it('Editar Comunidad',() => {  

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_SUPERADMIN(USER,PASS)
        BUSCAR_COMUNIDAD();
        
        // Acceder como SuperAdmin
        cy.xpath("//td[9]/a[5]").should('be.visible').click({force:true});

        // Editar comunidad
        cy.xpath("//div[@class='btn btn-success btn-block btn-home'][contains(.,'Editar comunidad')]").click({force:true});
        cy.get('#setting_edit_tab').wait(1000).click({force:true});
        
        // Con Control de Periodo
        cy.xpath("//label[contains(.,'La comunidad trabaja con Control por Período')]/following-sibling::select").select('Sí',{force:true}).should('have.value','0')

        // Remuneraciones
        cy.xpath("//label[text()='Remuneraciones']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')

        // Enviar Correos
        cy.xpath("//label[text()='Correos enviados']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')
        
        cy.xpath("(//input[@value='Guardar'])[@name='commit'][11]").click({force:true})
        cy.get('.flash-success').should('be.visible')

    })
//*******************************************************************************
    it('Recaudación (Admin)', () => {

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
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

        // Crear 'x' duplicados y verificar alerta (true)
        CREAR_PAGOS(2,true)

        // Notificar pagos
        cy.xpath("(//div[@data-original-title='Notificar pagos'])[1]").click({force:true})
        cy.get('#flash_notice').should('contain','Notificando comprobantes de pago')

        // Importar recaudaciones
        cy.get('#bills-import-excel-btn').click({force:true})
        cy.get('#excel-file').wait(DELAY).selectFile(EXCEL_RECAUDACIONES,{force:true}).wait(DELAY)
        cy.get('#excel-upload-submit').click({force:true})

        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('contain','En proceso').wait(2000).reload()
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('contain','Importado')

        cy.get("#sidebar-bill").should("be.visible").click({force: true});
    })
//*******************************************************************************
    it('Egresos (Admin)',() => {  
        
        DIMENSIONES();
        PAGINA_INICIAL(WEB);
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
                cy.get('#category_id').select('Administración', {force:true})
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})

            // Pago con cuotas 
            } else if (i == 1){
                cy.get('#category_id').select('Mantención', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            
            // Pago con cuotas y porcentaje en fondo de reserva 
            } else {
                cy.get('#category_id').select('Reparación', {force:true})
                cy.get('#service_billing_number_of_fees').select(cuotas, {force:true}).should('have.value',cuotas+1)
                cy.get('#show-advanced-proratable').click({force:true})
                cy.xpath("//input[contains(@id,'sb-proratable')]").clear({force:true}).type(porcFondoReserva,{force:true})
                
                cy.get('#submit_button_service_billing').should('be.visible').click({force:true})
                cy.xpath("//div[@class='btn btn-default btn-xs pull-right'][contains(.,'Volver')]").should('be.visible').click({force:true})
            }
        }
            
        // Anular egresos

        let cantidad = 5;

        cy.xpath("(//div[contains(@data-original-title,'Opciones')])").each(($el,index, $list) => {
            cantidad = $list.length
            }).then(() => {
                for (let i = 0; i < cantidad; i++) {
                    cy.xpath("(//div[@data-original-title='Opciones'])[1]").click({force:true})
                    cy.xpath("(//div[@class='dropdown-item'][contains(.,'Anular egreso')])[1]").should('be.visible').click({force:true})
                    cy.xpath("//a[contains(.,'Egresos gasto común')]").click({force:true})
                }
            })
    })
//*******************************************************************************
    it('Cargos (Admin)', () => {

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();
        
        // Módulo Cargos
        const MODULO_CARGOS = () => {
            cy.xpath("//div[@class='divLink'][contains(.,'Cargos')]").should("be.visible").click({force: true});
        }

        MODULO_CARGOS();

        // Crear 3 cargos con distintas formas de cobro
        for (let i = 1; i <= 3; i++) {
       
            // Nuevo Cargo
            cy.xpath("//div[contains(@data-intro,'nuevo cargo')]").should("be.visible").click({force: true});

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
            cy.xpath("//input[@type='submit']").click({force:true})

            // Verificar
            cy.get('.flash-success').should('be.visible')

            if (i==1) {
                cy.xpath("(//td[@class='hidden-xs text-right'])[1]").should('contain', monto)
            } else if(i==2) {
                cy.xpath("//a[contains(.,'Cobrados por otro medio')]").should("be.visible").click({force:true})
                cy.xpath("(//td[@class='hidden-xs text-right'])[1]").should('contain', monto)
            } else {
                cy.xpath("//a[contains(.,'Cobrar ahora y generar deuda')]").should("be.visible").click({force:true})
                cy.xpath("(//td[@class='hidden-xs text-right'])[1]").should('contain', monto)
            }
        }

        // Verificar en Conciliacion Bancaria
        
        let suma = 0;

        cy.xpath("//a[contains(.,'Cobrados por otro medio')]").should("be.visible").click({force:true})
        
        // Sumar todos los montos de 'Cobrados por otro medio' 
        cy.xpath("(//td[@class='hidden-xs text-right'])").each(($el)=>{
            // Convertir campos en int
            let aux= parseInt($el.text().slice(2,20).replace('.',''))
            suma += aux

        }).then(()=>{

            // Comprobar con la Conciliación Bancaria
            cy.xpath("//span[@class='sidebar_text'][contains(.,'Finanzas')]").wait(300).click({force:true}).wait(300)
            cy.xpath("//span[contains(.,'Conciliación bancaria')]").should("be.visible").click({force:true})

            // Iniciar conciliación, si es necesario
            cy.get('h1').each(($el) => {

                const TEXT1 = $el.text()
                const RESULTADO = TEXT1.includes('Configuración de conciliación bancaria')
                    
                if (RESULTADO){
                    cy.xpath("//input[@value='Guardar e iniciar']").click({force:true}).wait(300)
                    cy.log('*** CONCILIACION BANCARIA INCIADA ***')
                } else {
                    cy.log('*** CONCILIACION BANCARIA YA HABÍA SIDO INCIADA ***')
                }
            })

            // Convertir campo de Conciliacion en int
            cy.xpath("(//div[@class='pull-right'][@class='pull-right'][contains(.,'$')])[3]").each(($el)=>{
                let aux2 = parseInt($el.text().slice(2,20).replace('.',''))
                cy.xpath("//h4[contains(.,'Total libro banco')]").as('libro')
                cy.get('@libro').should('be.visible')

                // Verificar si los montos Coinciden
                cy.log('*******************************')
                cy.log('COBRADO POR OTRO MEDIO = CONCILIACION BANCARIA --> ' + (suma == aux2))
                cy.log('*******************************')

            })
        })

        // Anular cobros (OPCIONAL)
        const ANULAR_COBROS = () =>{
            cy.get('#select_all_checkboxes').click({force:true}).wait(100).click({force:true})
            cy.xpath("//span[contains(.,'Eliminar cargos seleccionados')]").click({force:true})
        }

        MODULO_CARGOS();
        
        for (let i = 0; i <= 2; i++) {
            if (i==0) {
                cy.xpath("//a[contains(.,'Cobrados en boleta')]").should("be.visible").click({force:true})
                ANULAR_COBROS()

            } else if(i==1) {
                cy.xpath("//a[contains(.,'Cobrados por otro medio')]").should("be.visible").click({force:true})
                ANULAR_COBROS()

            } else {
                cy.xpath("//a[contains(.,'Cobrar ahora y generar deuda')]").should("be.visible").click({force:true})
                ANULAR_COBROS()
            }
        }
    })
//*******************************************************************************
    it.only('Gasto Común (Admin)', () => {
        
        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_ADMIN(mailAdmin, PASS);
        CIERRE_MODALES();

    })
//*******************************************************************************
    it('Desactivar Comunidad', () => { 
          
        DIMENSIONES();
        PAGINA_INICIAL(WEB);
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