require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath

describe('TITULO DEL PACKETE DE PRUEBAS', () => {     
    
    it('Test validar el titulo', () => {                
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','Upload Files | TestingQaRvn');      
        cy.log('Todo ok, modificado desde git');                              
    })
});
