require('cypress-xpath');
/// <reference types="cypress" />

describe('Prueba Asserts', () =>{
    it('Propiedades de la pagina', () =>{
       
       // cy.viewport(1000, 700)

        cy.visit('https://testsheepnz.github.io/random-number.html');
        cy.title().should('eq','The Number Game');

        // Validacion de propiedades de la pagina
        cy.document().should('have.property','charset').and('eq','UTF-8');

        // Validacion de URL
        cy.url().should('include','random-number');
        cy.url().should('eq','https://testsheepnz.github.io/random-number.html');
    });

})
