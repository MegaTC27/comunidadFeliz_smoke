require('cypress-xpath')        // Selector de Xpath
const { DIMENSIONES, PAGINA_INICIAL, INICIO_SUPERADMIN, BUSCAR_COMUNIDAD } = require('../cf_functions');

describe('Pruebas TI', () => {     
    
    const WEB = Cypress.env('WEB_SMOKE');
    const USER = Cypress.env('USER_5');
    const PASS = Cypress.env('PASS_5');

    const COMUNIDAD_PRUEBA = 'Smoke 20/10/2022';
    const BTN_VER = "//div[@class='btn btn-sm btn-primary'][contains(.,'Ver')]"

    it('Crear x cantidad de invoices', () => {                

        DIMENSIONES();
        PAGINA_INICIAL(WEB);
        INICIO_SUPERADMIN(USER,PASS);

        // Buscar Comunidad
        BUSCAR_COMUNIDAD(COMUNIDAD_PRUEBA);
        
        // Ver
        cy.xpath(BTN_VER).click({force:true});
        
        // Facturacion
        cy.xpath("//div[@class='btn btn-warning pull-right'][contains(.,'Facturación')]").should('be.visible').click({force:true})

        // ID de la cuenta
        cy.xpath("(//strong[contains(.,'#')])[1]").should('be.visible').click({force:true})
        
        // Nuevo Invoice Manual

        cy.xpath("//div[@class='btn btn-default btn-sm pull-right'][contains(.,'Nuevo invoice manual')]").should('be.visible').click({force:true})

        // Carga de invoices
        for (let i = 1; i <= 20; i++){

            let monto = i+'000'

            if ( i < 10){
                cy.xpath(`(//input[@name='invoice_lines[][description]'])[${i}]`).type('0' + i, {force:true})
            } else {
                cy.xpath(`(//input[@name='invoice_lines[][description]'])[${i}]`).type(i, {force:true})  
            }
            cy.xpath(`(//input[@id='invoice_lines__unit_price'])[${i}]`).type(monto, {force:true})
            cy.xpath(`(//input[contains(@id,'quantity')])[${i}]`).type('1', {force:true})
            cy.xpath(`(//div[@class='btn btn-default addAdditionalInfo'][contains(.,'Agregar')])[${i}]`).click({force:true})
            }
       
        cy.xpath("//input[@type='submit']").should('be.visible').click({force:true})
    })

});