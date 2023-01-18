require('cypress-xpath');

describe('Prueba Asserts', () =>{
    it('Prueba Contain & Have', () =>{
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA');

        // Input de datos
        cy.get('#userName').should('be.visible').and('have.class','mr-sm-2 form-control').type('Hyper');
        cy.get('#userEmail').should('be.visible').and('have.class','mr-sm-2 form-control').type('Hyper@gmail.com');
        cy.get('#currentAddress').should('be.visible').and('have.class','form-control').type('Domicilio currente 1234');
        cy.get('#permanentAddress').should('be.visible').and('have.class','form-control').type('Domicilio permanente 5678');

        cy.get('#submit').click();
    });
})
