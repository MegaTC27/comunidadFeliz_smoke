require('cypress-xpath')        // Selector de Xpath
import '@4tw/cypress-drag-drop'

describe('PRUEBAS EVENTOS DEL MOUSE', () => {     

    const dataTransfer = new DataTransfer();

    it('Drag and Drop', () => {                
        cy.visit('https://the-internet.herokuapp.com/drag_and_drop');
        cy.title().should('eq','The Internet');      
        cy.get("#column-b").drag("#column-a");
                                  
    })

    it('Drag and Drop', () => {    
                       
        cy.visit('https://the-internet.herokuapp.com/drag_and_drop');
        
        cy.get("#column-a").trigger('dragstart', {
            dataTransfer
        })
       cy.get("#column-b").trigger('drop', {
            dataTransfer
        })
                                  
    })


    it.only('Drag and Drop 2', () => { 
        cy.viewport(1200, 700)
        let time = 500;
        
        cy.visit('https://demo.automationtesting.in/Static.html');
        
        cy.get("#angular").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#droparea").trigger('drop', {
            dataTransfer
        })
                
        cy.get("#mongo").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#droparea").trigger('drop', {
            dataTransfer
        })

        cy.get("#node").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#droparea").trigger('drop', {
            dataTransfer
       })
    })

    it.only('Drag and Drop', () => {                
        cy.visit('https://kitchen.applitools.com/ingredients/drag-and-drop');
                        
        cy.get("#menu-fried-chicken").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#plate-items").trigger('drop', {
            dataTransfer
        })
                        
        cy.get("#menu-hamburger").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#plate-items").trigger('drop', {
            dataTransfer
        })
                        
        cy.get("#menu-ice-cream").trigger('dragstart', {
            dataTransfer
        })
        cy.get("#plate-items").trigger('drop', {
            dataTransfer
        })
    })
});

