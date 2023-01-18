require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath

/// <reference types="cypress" />
// Para que funcione el predictivo de los comandos

describe('TITULO DEL PACKETE DE PRUEBAS', () => {     // describe --> titulo de la test suite
    
    it('Test validar el titulo', () => {                // it --> titulo del test case
        Cypress.config('defaultCommandTimeout',3000)
        cy.visit('https://demoqa.com/text-box');        // cy.visit() --> abrir url
        cy.log('Todo ok');                              // cy.log() --> console.log()
    })
});