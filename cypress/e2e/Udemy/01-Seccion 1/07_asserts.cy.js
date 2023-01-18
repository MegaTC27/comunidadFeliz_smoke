describe('Introducción a los Asserts', () => {     
    
    it('Test Asserts', () => {                
        cy.visit('https://demoqa.com/automation-practice-form');
        cy.get('#firstName').should('be.visible',{timeout:5000}).type('Should be visible');
        cy.get('#lastName').should('be.enabled').type('Should be enabled');
        cy.get('#userEmail').should('be.ok').should('be.visible').type('prueba@shouldbeok.com');
                                   
    })
});