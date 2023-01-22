require('cypress-xpath');

describe('Prueba Asserts', () =>{
    it('Prueba Contain & Have', () =>{
        cy.visit('https://mdbootstrap.com/docs/b4/jquery/tables/pagination/');
        cy.title().should('eq','Bootstrap 4 table pagination - examples & tutorial.');

        // Input de datos
        cy.get('#dtBasicExample > tbody > tr > td').should('have.length',60).and('have.css','padding','17.6px 12px 16px');
    });
})
