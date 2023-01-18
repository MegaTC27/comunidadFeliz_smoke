require('cypress-xpath');

describe('Prueba Asserts', () =>{
    it('Prueba Contains', () =>{
        cy.visit('http://automationpractice.com/index.php');
        cy.title().should('eq','My Store');

        cy.get('#block_top_menu').contains('Women').should('be.visible');
        
        cy.get('.product-container').find('.product-image-container').eq(3).click();
    });

})
