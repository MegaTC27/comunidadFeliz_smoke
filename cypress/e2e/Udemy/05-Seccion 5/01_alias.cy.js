require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath

describe('Alias', () => {     
    
    it.only('Prueba Alias 01', () => {        
        
        cy.viewport(1360, 768)
        cy.visit('https://testpages.herokuapp.com/styled/validation/input-validation.html')
        cy.title('eq','Input Validation')
        
        cy.get('#firstname').should('be.visible').as('nombre')
        cy.get('#surname').should('be.visible').as('apellido')
        cy.get('#age').should('be.visible').as('edad')
        cy.get('#country').should('be.visible').as('pais')
        cy.get('#notes').should('be.visible').as('notas')
        cy.get('[type="submit"]').should('be.visible').as('enviar')

        cy.get('@nombre').type('Assasniation')
        cy.get('@apellido').type('assasinado assn')
        cy.get('@edad').type('59')
        cy.get('@pais').select('Argentina').should('have.value','Argentina')
        cy.get('@notas').type('Un elefante se columpiaba sobre la tela de una araña')
        cy.get('@enviar').click()
    })     
});