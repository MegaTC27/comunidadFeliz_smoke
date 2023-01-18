/// <reference types="cypress" />
// Para que funcione el predictivo de los comandos

describe('Seccion 1 - Validando el titulo', () => {
    
    it('Test validar el titulo', () => {
   
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA');
        cy.log('Todo ok');
    })
});