// Primer test

describe('Clase 1 del curso de Cypress', () => {    // describe --> titulo de la test suite

    it.only('Mi primer test', () => {                   // it --> titulo del test case
        cy.log('Hola pepe');                         // cy.log() --> console.log()
        cy.wait(20);                              // cy.wait() --> un delay de 1000 milisegundos (1 segundo)

    });

    it('Mi segundo test', () => {
        cy.visit('https://demoqa.com/text-box');    // cy.visit() --> abrir url
        cy.wait(1000).get('#userName').type('Juan Ignacio');   // cy.get() obtener elemento ('#'=id // '.'=clase)

    });

    
});