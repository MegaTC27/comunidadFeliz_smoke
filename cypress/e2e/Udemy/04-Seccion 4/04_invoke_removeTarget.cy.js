describe('PRUEBAS EVENTOS DEL MOUSE', () => {     
    
    it('Abrir en misma pestaña', () => {

        cy.viewport(1500, 700)
        cy.visit('https://norrik.com/target-blank-test-page/')
        //cy.title().should('eq','Get Online Selenium Certification Course | Way2Automation')
  
        cy.contains("this is a test").invoke('removeAttr','target').click({force:true})
   
    })                   
});

