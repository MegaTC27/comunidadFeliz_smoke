require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath
/// <reference types= "Cypress"/>
        

describe('FUNCIONES DE SELECCION', () => { 

    it('Seleccionar con: .children() - .eq() - .first() - .filter()', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        //Funcion .children() y .eq()
        cy.xpath("(//div[contains(@class,'rt-tr -')])[1]").children('.rt-td').eq(0).should('contain','Cierra');
        cy.xpath("(//div[contains(@class,'rt-tr -')])[1]").children('.rt-td').first().should('contain','Cierra');

        cy.get('.rt-tbody > :nth-child(1) > .rt-tr > :nth-child(1)')

        cy.get("[type='button']").filter('.btn-primary').should('be.visible').should('contain','Add')
    })
   
    it('Seleccionar con .find() - .contains()', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        //Funcion .children() y .eq()
        cy.get(".menu-list").find('.btn-light').first().should('contain','Text Box').first().click({force:true})
        cy.get(".menu-list").find('#item-5').should('contain','Links').first().click({force:true})
        cy.get(".menu-list").contains('Radio Button')

        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(3).should('contain','Web Tables')
        cy.get("[type='button']").last().should('be.visible')
    })

    it.only('Seleccionar con .next()', () => {                
        cy.visit('https://demoqa.com/webtables');
        cy.title().should('eq','ToolsQA');      

        //Funcion .next() y .nextAll()

        // .next() selecciona el elemento siguiente al seleccionado, excluyendolo
        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(0).next()

        
        // .nextAll() selecciona todos los elementos siguientes al seleccionado, excluyendolo
        cy.get(".element-group").find('.menu-list').find('.btn-light').eq(0).nextAll()
    })
     
});