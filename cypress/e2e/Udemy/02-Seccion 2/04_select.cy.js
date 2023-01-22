/// <reference types="cypress" />
require('cypress-plugin-tab')
require('cypress-xpath');


describe('Prueba Selects',() => {
    it('Select DropDown', () => {
        
        // Ingresar a la pagina
        cy.visit('https://demos.jquerymobile.com/1.4.5/selectmenu/');
        cy.title().should('eq','Selects - jQuery Mobile Demos');

        // Seleccionar elementos individualmente
        cy.get('#select-native-1').select('The 4th Option').should('have.value','4')
        cy.wait(500)
        cy.get('#select-native-1').select('The 3rd Option').should('have.value','3')
        cy.wait(500)
        cy.get('#select-native-1').select('The 2nd Option').should('have.value','2')
        cy.wait(500)
        cy.get('#select-native-1').select('The 1st Option').should('have.value','1')
    })

    /*
    it.only('Multi Select', () => { 

        // Ingresar a la pagina
        cy.visit('https://ej2.syncfusion.com/demos/multi-select/checkbox/');
        //cy.title().should('eq','Select Multiple select Example | Mobiscroll');

        // Seleccionar varios elementos
        cy.get('.e-multi-select-wrapper e-down-icon').select(['Australia','Canada'])

    })
    */

    it.only('Promise', () => {
        
        // Ingresar a la pagina
        cy.visit('https://demos.jquerymobile.com/1.4.5/selectmenu/');
        cy.title().should('eq','Selects - jQuery Mobile Demos');

        // Promise 
        cy.get('#select-native-1').select('The 4th Option').should('have.value','4').then(() => {
            cy.get(':nth-child(6) > .jqm-view-source-link').click()
        })

    })
});