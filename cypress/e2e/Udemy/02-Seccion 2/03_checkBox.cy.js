/// <reference types="cypress" />
require('cypress-plugin-tab')
require('cypress-xpath');


describe('Prueba CheckBox',() => {
    it('CheckBox simple', () => {
        
        // Ingresar a la pagina
        cy.visit('https://testingqarvn.com.es');
        cy.title().should('eq','TestingQaRvn | Mundo del Testing');

        // Seleccionar pagina de CheckBoxes
        cy.get('#menu-item-179').should('be.visible').click();
        cy.xpath('(//a[@href="https://testingqarvn.com.es/prueba-de-campos-checkbox/"])[3]').click();

        // Completar formulario
        cy.get('#wsf-1-field-29').type('Jaimito').tab().
        type('Perez').type('Jaimez@gmail.com').tab().
        type('Jaimito').tab().
        type('555-2222-800').tab().
        type('Mosconi y Nazca, todo esta en Mosconi y Nazca')

        // CheckBoxes
   
        // Tildar y destildar todos los CheckBoxes
        cy.get('[type="checkbox"]').should('not.be.visible').check({ force: true }).should('be.checked');
        cy.get('[type="checkbox"]').should('not.be.visible').uncheck({ force: true }).should('not.be.checked');
        cy.wait(500);

        // Seleccion individual
        cy.get('#wsf-1-field-36-row-1').check({ force: true }).should('be.checked');
        cy.get('#wsf-1-field-36-row-3').check({force: true}).should('be.checked');
        cy.wait(500);
        cy.get('[type="checkbox"]').should('not.be.visible').uncheck({ force: true }).should('not.be.checked');

        // Seleccion individual por clicks
        cy.get('#wsf-1-field-36-row-1').click({ force: true }).should('be.checked');
        cy.get('#wsf-1-field-36-row-2').click({force: true}).should('be.checked');
        cy.wait(500);
        cy.get('[type="checkbox"]').should('not.be.visible').uncheck({ force: true }).should('not.be.checked');

        // Seleccion por valores
        cy.get('[type="checkbox"]').should('not.be.visible').check(['PYTHON','JS'],{ force: true }).should('be.checked');
        })

    it.only('CheckBox Radio button', () => {

        cy.visit('https://demos.jquerymobile.com/1.4.5/checkboxradio-radio/');
        cy.title().should('eq','Radio buttons - jQuery Mobile Demos');

        cy.get('#radio-choice-0a').should('be.visible').check({force:true});
        cy.wait(1000)

        cy.get('#radio-choice-0b').should('be.visible').check({force:true});
        cy.wait(1000)
            
    //---------------------------
            
        cy.get('#radio-choice-v-2c').should('be.visible').check({force:true});
        cy.wait(1000)

        cy.get('#radio-choice-v-2b').should('be.visible').check({force:true});
        cy.wait(1000)

        cy.get('#radio-choice-v-2a').should('be.visible').check({force:true});
        cy.wait(1000)

    //---------------------------

        cy.get('#radio-choice-h-2b').should('be.visible').check({force:true});
        cy.wait(1000)

        cy.get('#radio-choice-h-2a').should('be.visible').check({force:true});
        cy.wait(1000)

        cy.get('#radio-choice-h-2c').should('be.visible').check({force:true});
        cy.wait(1000)
    });
});