require('cypress-plugin-tab')

describe('Funcion Tab', () => {     
    
    it('Test validar el titulo', () => {                
        cy.visit('https://demoqa.com/automation-practice-form');
        cy.get('#firstName').type('Pablito').tab().type('Pesadilla').tab().type('pablinskiNightmare@yahoo.com');       
        cy.log('Todo ok'); 
                                    
    })
});