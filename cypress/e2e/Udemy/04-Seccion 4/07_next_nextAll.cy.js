require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath
/// <reference types= "Cypress"/>
        

describe('FUNCIONES DE SELECCION', () => { 

    it('Seleccionar con .next()', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        //Funcion .next() y .nextAll()

        // .next() selecciona el elemento siguiente al seleccionado, excluyendolo
        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(0).next()

        
        // .nextAll() selecciona todos los elementos siguientes al seleccionado, excluyendolo
        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(0).nextAll()
    })

    it('Seleccionar con .parent()', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        // .parent() selecciona elemento padre
        cy.get('.menu-list').parent().should('have.length','6')
        })

    it.only('Reto tablas', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        // cy.xpath("//li[@class='btn btn-light '][contains(.,'Check Box')]").should('contain','Check Box').click({force:true})
        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(1).should('contain','Check Box').click({force:true})
        
        const expandEach = () => {
            cy.get(".rct-icon-expand-close").each(($el,index, $list) => {
                cy.wrap($el).should('be.visible').click({force:true})
            })
        }
        
        for (let i = 0; i < 3; i++) {
            expandEach()
        }
              
        cy.get(".rct-checkbox").each(($el,index, $list) => {
            if (index == 0 || index == 1 || index == 4 || index == 5 || index == 9 || index == 14 ){
                cy.log('NOPE')
            } else{
            cy.wrap($el).should('be.visible').click({force:true})
            }
        })
    })
});