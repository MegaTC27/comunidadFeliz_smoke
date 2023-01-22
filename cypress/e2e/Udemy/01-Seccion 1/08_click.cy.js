describe('Funciones click()', () => {     
    
    it('Click & Force Click', () => {                
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');  

        cy.get("[name='username']").should('be.enabled').type('Admin');
        cy.get("[name='password']").should('be.enabled').type('admin123');                          

        cy.get("button[class='oxd-button oxd-button--medium oxd-button--main orangehrm-login-button']").should('be.enabled').click();
        
        cy.get(':nth-child(1) > .oxd-main-menu-item > .oxd-text').click({force:true});  // force click
        
    })

    it.only ('Click por coordenadas', ()=>{
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');  
    
        cy.get("[name='username']").should('be.enabled').type('Admin');
        cy.get("[name='password']").should('be.enabled').type('admin123');                          
    
        cy.get("button[class='oxd-button oxd-button--medium oxd-button--main orangehrm-login-button']").should('be.enabled').click();
            
        cy.get(':nth-child(1) > .oxd-main-menu-item > .oxd-text').click(50,5);
        cy.get(':nth-child(1) > .oxd-main-menu-item > .oxd-text').click(20,1);
    })
});