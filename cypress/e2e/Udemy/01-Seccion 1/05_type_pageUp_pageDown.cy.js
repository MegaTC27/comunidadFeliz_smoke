/// <reference types="cypress" />
// Para que funcione el predictivo de los comandos

describe('Funcion Type-PageUp/PageDown', () => {     // describe --> titulo de la test suite
    
    it('Type PageUp', () => {                
        cy.visit('https://demoqa.com/text-box');        
        cy.title().should('eq','ToolsQA')
        
        cy.get('#userName').type('Pablito Pesadilla {pageup}')

    })

    it.only('Type PageDown', () => {                
        cy.visit('https://demoqa.com/text-box');        
        cy.title().should('eq','ToolsQA')
        
        cy.get('#userName').type('Pablito Pesadilla 2 {pagedown}')

    })


});