export class Pages_Home {

    constructor(){
        this.buttonComunidades = ".left-bar-menu > ul > :nth-child(1) > a";
        this.search = "#search";
        this.buscar = "[value=Buscar]";
        this.tabla = ".table-root";
        this.inputNombreComundad = '#community_name'
        this.inputRutComundad = '#community_identifications_attributes_0_identity'
        this.inputNombrePublico = '#community_contact_name'
        this.inputCorreoPublico = '#community_contact_email'
        this.checkComunidadReal = "#community_count_csm"
        this.selctPais = '#community_country_code'
        this.direccion = '#autocomplete'
        this.buttonGuadar = "[value=Guardar]"
        this.checkCorreoDeContacto = '#account_account_contacts_attributes_1__destroy'
        this.buttonGuar2Paso = '#account_submit'
        this.inputTipo = '#excel_upload_name'
        this.inputExaminar = '#excel_upload_excel'
        this.buttonSubir = "[value=Subir]"
        this.buttonSiguiente = "[type=submit]"
        this.inputNombreAdmin = '#user_first_name'
        this.inputApellidoAdmin = '#user_last_name'
        this.inputEmailAdmin = '#user_email'
        this.inputPassword = '#user_password'
        this.inputConfirPassword = "#user_password_confirmation"
        this.buttonDesactivarComunidad = "(//div[@type='button'])[contains(.,'Desactivar')]"
        this.selectRazonDeSalidad = ".btn-group > .multiselect"
        this.selectTipoMoneda = "#leaving_community_currency_type"
        this.inputValorAsociado = '#leaving_community_associated_value'
        this.checkDesactivarInmediatamente = '#leaving_community_immediate_deactivation'
        
    }
    buscarComunidad(comunidad) {
        cy.get(this.buttonComunidades).should('be.visible').click({force:true})
        cy.get(this.search).type(comunidad,{force:true})
        cy.get(this.buscar).click({force:true})
    }

    desactivarComunidad(nomComunidad){
        let delay = 2000
        let valorAsociado = 1000
        if(cy.get('.wrap-text').should('be.visible').contains(nomComunidad)){
            cy.xpath(this.buttonDesactivarComunidad).wait(delay).click().wait(delay);
            cy.get(this.selectRazonDeSalidad).click({force: true});

            for (let i = 2; i < 6; i++ ){
                cy.xpath(`(//input[@type='checkbox'])[${i}]`).click({force: true})
            }
            cy.get(this.selectTipoMoneda).select('USD',{force: true}).should('have.value', 'USD')
            cy.get(this.inputValorAsociado).clear().type(valorAsociado,{force: true})
            cy.get(this.checkDesactivarInmediatamente).check({force: true})
            cy.xpath("//input[contains(@value,'Guardar')]").click({force: true})
            cy.get('.flash-success').should("be.visible")
        }
        else{
            cy.get('.wrap-text').should("not.exist")
                cy.log ("no exite comunidad")
            }
        
    }

    crearComunidad(nomComunidad){
        let rutComunidad = '11.111.111-1';
        let nombrePublico = 'Nombre Publico Prueba'
        let correoPublico = 'smokepruebas@cf.cl'
        let direccion = 'Santiago, Chile'
        // Módulo 'Nueva Comunidad'
       cy.xpath("(//a[contains(.,'Nueva comunidad')])[2]").click({force:true})
        // Primera y Segunda Página
        cy.get(this.inputNombreComundad).type(nomComunidad,{force:true})
        cy.get(this.inputRutComundad).type(rutComunidad,{force:true})
        cy.get(this.inputNombrePublico).type(nombrePublico,{force:true})
        cy.get(this.inputCorreoPublico).type(correoPublico,{force:true})
        cy.get(this.checkComunidadReal).click({force:true})
        // País
        cy.get(this.selctPais).select('Chile',{force:true}).should('have.value','CL')
        cy.get(this.direccion).type(direccion,{force:true})
        cy.get(this.buttonGuadar).click({force:true}).wait(500)
        // Mail de contacto
        cy.get(this.checkCorreoDeContacto).click({force:true})
        cy.get(this.buttonGuar2Paso).click({force:true})
        // Otorgar permisos 
        cy.wait(500).reload().wait(1500)
        cy.get('.round').click({force:true})
        cy.xpath("//span[contains(@id,'notice')][contains(.,'Permisos otorgados exitosamente. Ahora tienes permisos temporales en esta comunidad')]").should('be.visible')
        cy.xpath("//a[contains(@data-title,'Actualmente cuentas con permisos en este módulo')]").should('be.visible')        
    }
    agregarExelComunidad(excelPropiedades, excelSaldos){
        // Importar Propiedades
        let delay = 2000
        cy.wait(500).reload()
        cy.get(this.inputTipo).select('Copropietarios',{force:true}).should('have.value','Copropietarios')
        cy.get(this.inputExaminar).wait(delay).selectFile(excelPropiedades,{force:true}).wait(delay)
        cy.get(this.buttonSubir).click({force:true})
        //cy.xpath("//input[contains(@value,'Subir')]").click({force:true})
        // Corroboar la importación de Propiedades
        for(let i=1; i < 6;i++ ){
            cy.xpath(`(//td[contains(.,'A${i}')])[1]`).should('be.visible')
        }
        cy.get(this.buttonSiguiente).click()
        // Importar Saldos
        cy.wait(500).reload()
        cy.get(this.inputTipo).select('Saldos',{force:true}).should('have.value','Saldos')
        cy.get(this.inputExaminar).wait(delay).selectFile(excelSaldos,{force:true}).wait(delay)
        cy.get(this.buttonSubir).click({force:true})
        //cy.xpath("//input[contains(@value,'Subir')]").click({force:true})
        // Corroboar la importación de Pagos
        for(let i=2; i < 6;i++ ){
            cy.xpath(`(//input[contains(@value,'A')])[${i}]`).should('be.visible')
        }
        cy.get(this.buttonSiguiente).click()
    }    

    configurarAdministrador(){
        //datos Administrador
        const dayjs = require('dayjs') 
        let fecha = dayjs().format('DDMMYY');
        let nombreAdmin = 'adminSmoke'
        let apellidoAdmin = 'Pruebas'
        let mailAdmin = nombreAdmin + fecha + '@gmail.com'
        let pass = 'feliz21.' 
        
        // Configurar Admin
         cy.get(this.inputNombreAdmin).scrollIntoView()
         cy.get(this.inputNombreAdmin).clear({force:true}).type(nombreAdmin,{force:true})
         cy.get(this.inputApellidoAdmin ).clear({force:true}).type(apellidoAdmin,{force:true})
         cy.get(this.inputEmailAdmin).clear({force:true}).type(mailAdmin,{force:true})
         cy.get(this.inputPassword).clear({force:true}).type(pass,{force:true})
         cy.get(this.inputConfirPassword).clear({force:true}).type(pass,{force:true})
         cy.xpath("//input[contains(@value,'Asignar Administrador')]").click({force:true})
 
         cy.xpath("//span[contains(@id,'notice')][contains(.,'Administrador ingresado')]").should('be.visible')
     
    }
}
