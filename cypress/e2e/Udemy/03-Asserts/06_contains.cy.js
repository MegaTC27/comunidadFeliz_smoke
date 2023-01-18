require('cypress-xpath');
/// <reference types="cypress" />

describe('Prueba Asserts', () =>{
    it('Prueba Contain & Have', () =>{
        cy.visit('https://example.cypress.io/commands/querying');
        cy.title().should('eq','Cypress.io: Kitchen Sink');

        // Input de datos
        cy.get('#query-btn').should('contain', 'Button').click()
        
        // cy.get() yields a jQuery object, you can get its attribute by invoking the .attr() method. 
        cy.get('[data-test-id="test-example"]')
        .invoke('attr', 'data-test-id')
        .should('equal', 'test-example')

        // or you can get an element's CSS property
        cy.get('[data-test-id="test-example"]')
        .invoke('css', 'position')
        .should('equal', 'static')

        cy.get('.query-list').contains('bananas').should('have.class', 'third')

        // We can find elements within a specific DOM element .within()
        cy.get('.query-form').within(() => {
            cy.get('input:first').should('have.attr', 'placeholder', 'Email')
            cy.get('input:last').should('have.attr', 'placeholder', 'Password')
          })

        // BEST PRACTICES:

        // Much better. But still coupled to text content that may change.
        cy.get('#main').contains('Submit').click()
    });
})
