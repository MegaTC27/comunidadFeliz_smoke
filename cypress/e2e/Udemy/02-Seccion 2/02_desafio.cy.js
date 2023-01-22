require('cypress-xpath');
// Necesario para indicar por Xpaths
require('cypress-plugin-tab')

let name = 'iphone';
let date1= '2022-10-30';
let date2= '2030-06-27';

describe('SEGUNDO DESAFIO', () => {

    it.only('Testeando la Web', () => {     
        
        // Acceder y validar
        cy.visit('http://computer-database.gatling.io/computers');
        cy.title().should('eq','Computers database')

        // Buscar
        cy.get('#searchbox').should('be.visible').type(name);
        cy.get('#searchsubmit').should('be.visible').click();

        // Seleccionar
        cy.xpath('//a[@href="/computers/523"][contains(.,"iPhone 4")]').click();
        cy.wait(1000);

        // Editar
        cy.get('#name').should('be.visible').type(name + '- Tre-pc');
        cy.get('#introduced').should('be.visible').type(date1);
        cy.get('#discontinued').should('be.visible').type(date2);
        cy.get('#company').should('be.visible').select('Nokia').should('have.value','16').wait(1000);
        
        cy.xpath('//input[@value="Save this computer"]').should('be.visible').click();

        //cy.xpath('//a[@href="/computers"][contains(.,"Cancel")]').click();
   
    })
});