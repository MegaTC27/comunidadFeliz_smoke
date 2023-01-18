require('cypress-xpath')        // Selector de Xpath
require('cypress-plugin-tab')   // Tabulacion por comando
const dayjs = require('dayjs')  // Importar fecha

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

    // FUNCIONES

    const DIMENSIONES = () => {
        cy.viewport(1360, 768)
      }

       const PAGINA_INICIAL  = (w = WEB) => {
        cy.visit(w);
        cy.title().should('eq','ComunidadFeliz');      
      }

    const INICIO_SUPERADMIN = (u= USER, p = PASS) => {
        cy.get('#email').should('be.visible').type(u)
        cy.get('#password').type(p)
        cy.xpath("//span[contains(.,'Inicia sesión')]").click({force:true})
      }

    const INICIO_ADMIN = (mAdmin = mailAdmin, p =PASS) => {
        cy.get('#email').should('be.visible').type(mAdmin)
        cy.get('#password').type(p)
        cy.xpath("//span[contains(.,'Inicia sesión')]").click({force:true})
      }

    const BUSCAR_COMUNIDAD = (comunidad = NOMBRE) => {
        cy.xpath("(//a[contains(.,'Comunidades')])[2]").should('be.visible').click({force:true})
        cy.get('#search').type(comunidad,{force:true});
        cy.xpath("//input[contains(@value,'Buscar')]").click({force:true})
      }
      
    const MODAL_TYC = () => {
        // Verifcar modal de Términos y Condiciones
        cy.get('h1').each(($el,index, $list) => {
      
          const TEXT1 = $el.text()
          const RESULTADO = TEXT1.includes('Condiciones')
          
          if (RESULTADO){
            cy.get('.btn').should('be.visible').click({force:true})
          } else {
            cy.log(TEXT1 + ' - NO CONTENIDO EN H1')
          }
      })
        
      }

    const MODAL_CAMBIAR_PASS = () => {
        // Verifcar modal de Cambia tu contraseña
        cy.get('h1').each(($el,index, $list) => {
      
          const TEXT1 = $el.text()
          const RESULTADO = TEXT1.includes('Cambia tu')
          
          if (RESULTADO){
            cy.get(':nth-child(3) > .btn').should('be.visible').click({force:true})
          } else {
            cy.log(TEXT1 + ' - NO CONTENIDO EN H1')
          }
        })
      
      }

    const SELECCIONAR_COMUNIDAD = () => {
        // Seleccionar comunidad si tiene más de una
      
        cy.get('h1').each(($el,index, $list) => {
      
          const TEXT1 = $el.text()
             
          if (TEXT1.includes('Comunidades que')){
      
            cy.get('h4').each(($el,index, $list) => {
                let text2 = $el.text()
            
                if (text2.includes(NOMBRE)){
                    cy.wrap($el).click({force:true})
                } else {
                    cy.log(text2 + ' - NO CONTENIDO EN H4')
                }
            })
      
          } else {
            cy.log('ADMIN CON UNA SOLA COMUNIDAD')
          }
        })   
      }

    const MODAL_BIENVENIDA = () => {
        // Verificar modal de Bienvenido a CF
        cy.get('h1').each(($el,index, $list) => {
            
            const text1 = $el.text()
            const resultado = text1.includes('¡Bienvenido a')
            
            if (resultado){
                cy.get('#btn-start-admin-tour').should('be.visible').click({force:true})
            }else{
                cy.log('Modal de Bienvenida inexistente- ' + text1)
            }
        })
      }

    const MODAL_BIBLIOTECA = () => {
        // Verifcar modal de Tutorial de Bibliteca
        cy.get('h1').each(($el,index, $list) => {
      
            const TEXT1 = $el.text()
            const RESULTADO = TEXT1.includes('Actualizamos la')
            
            if (RESULTADO){
                cy.xpath("//a[contains(.,'Saltar Tutorial')]").should('be.visible').click({force:true})
            }else{
                cy.log('Modal Tutorial de Biblitoteca Inexistente - ' + TEXT1)
            }
        })
      }

    const CIERRE_MODALES = () => {
          
        MODAL_TYC();
        MODAL_CAMBIAR_PASS();
        SELECCIONAR_COMUNIDAD();
        MODAL_BIENVENIDA();
        MODAL_BIBLIOTECA();
        
      }

    // TEST CASES

//*******************************************************************************

    it.only('Crear Comunidad', () => {                

        let delay = 1000

        DIMENSIONES();
        PAGINA_INICIAL();
        INICIO_SUPERADMIN();

        cy.xpath("(//a[contains(.,'Nueva comunidad')])[2]").should('be.visible').click({force:true})
                
        let rut = '11.111.111-1';
        let nombrePublico = 'Nombre Publico Prueba'
        let correoPublico = 'tc27@cf.cl'
        let direccion = 'Santiago, Chile'

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

        for(let i=1; i < 5;i++ ){
            cy.xpath(`(//td[contains(.,'A${i}')])[1]`).should('be.visible')
        }
   
        cy.xpath("//input[contains(@type,'submit')]").click({force:true})
        
        // Importar Pagos
        cy.get('#excel_upload_name').select('Saldos',{force:true}).should('have.value','Saldos')
        
        cy.get('#excel_upload_excel').wait(delay).selectFile(RUTA_PAGOS,{force:true}).wait(delay)
        
        cy.xpath("//input[contains(@value,'Subir')]").click({force:true})

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

    it.only('Activar correos',() => {  
        
        DIMENSIONES();
        PAGINA_INICIAL();
        INICIO_SUPERADMIN()
        BUSCAR_COMUNIDAD();
        
        // Editar comunidad
        
        cy.xpath("//td[9]/a[5]").should('be.visible').click({force:true});
        cy.xpath("//div[@class='btn btn-success btn-block btn-home'][contains(.,'Editar comunidad')]").click({force:true});
        
        cy.get('#setting_edit_tab').wait(1000).click({force:true});
        
        cy.xpath("//label[text()='Correos enviados']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')
        cy.xpath("//label[text()='Remuneraciones']/following-sibling::select").select('Activado',{force:true}).should('have.value','1')

        cy.xpath("(//input[@value='Guardar'])[@name='commit'][11]").click({force:true})
        cy.get('.flash-success').should('be.visible')
    
    })

//*******************************************************************************

    it.only('Egresos (Admin)',() => {  
        
    //    let aux = "CC Cypress - 07/12/22 - 11:23"
    //    let auxMailAdmin = 'pruebacypress@cf.cl'

        DIMENSIONES();
        PAGINA_INICIAL();
        INICIO_ADMIN();

        CIERRE_MODALES();

        let descripcion = 'Egreso Cypress - ' + DATE;
        let monto = 10000;
        let cuotas = 5;
        let porcFondoReserva = 50

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

    it.only('Recaudación (Admin)', () => {
        
        let aux = "CC Cypress - 07/12/22 - 11:23"
        let auxMailAdmin = 'pruebacypress@cf.cl'

        DIMENSIONES();
        PAGINA_INICIAL();
        INICIO_ADMIN(aux);

        CIERRE_MODALES();
        
        cy.get("#sidebar-bill").should("be.visible").click({force: true});

    })

//*******************************************************************************

    it.only('Desactivar Comunidad', () => { 
        
        DIMENSIONES();
        PAGINA_INICIAL();
        INICIO_SUPERADMIN();
        BUSCAR_COMUNIDAD(NOMBRE);
         
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