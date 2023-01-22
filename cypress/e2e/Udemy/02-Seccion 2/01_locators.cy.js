require('cypress-xpath');
// Necesario para indicar por Xpaths

describe('PRUEBA DE SELECTORES', () => {     
    
    // Locator por ID
    it('Locator por ID', () => {                
        cy.visit('https://demoqa.com/text-box');        
        cy.get('#userName').should('be.visible').type('Selección por ID');                              
    })

    // Locator por Atributo
    it('Locator por Atributo', () => {                
        cy.visit('https://demoqa.com/text-box');        
        cy.get("[placeholder='Full Name']").should('be.visible').type('Selección por ID');                              
    })

    // Locator por Xpath
    it('Locator por Xpath', () => {                
        cy.visit('https://demoqa.com/text-box');        
        cy.xpath('//*[@id="userName"]').type('Selección por Xpath');                              
        cy.xpath("//textarea[contains(@id,'currentAddress')]").should('be.visible').type('Tambien por Xpath')
    })
    
    // Locator por Contains
    it('Locator por Contains', () => {                
        cy.visit('https://demoqa.com/automation-practice-form');        
        cy.get('.custom-control-label').contains('Female').should('be.visible').click();
        cy.wait(1000);
        cy.get('.custom-control-label').contains('Other').should('be.visible').click();                     
    })

    // Locator por Copy Selector
    it.only('Locator por Copy Selector', () => {                
        cy.visit('https://demoqa.com/automation-practice-form');        
        cy.get('#userNumber').should('be.visible').type('Copy Selector');    
    })

});