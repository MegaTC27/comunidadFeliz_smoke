require('cypress-xpath');
require('cypress-plugin-tab')   // Tabulacion por comando

describe('PRUEBA DE FIXTURES', () => {     
    
    before(()=>{
        cy.fixture('01_fixture').then((data)=>{
            globalThis.data = data;
        })
    })

    beforeEach(()=>{
        cy.fixture('01_fixture').as('datos_json')
    })

    it.only('Prueba 01 - Global', () => {       
        cy.viewport(1360, 768)         
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA')       
        cy.get('#userName').should('be.visible')

        .type(data.nombre).tab()
        .type(data.email).tab()
        .type(data.direccion).tab()
        .type(data.direccion2)     
    })
    

    it.only('Prueba 02 - Alias', () => {       
        cy.viewport(1360, 768)         
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA')       
        cy.get('#userName').should('be.visible')

  //    cy.fixture('01_fixture').as('datos_json')
        
        cy.get('@datos_json').then((info)=>{
            cy.get('#userName').should('be.visible')

            .type(info.nombre).tab()
            .type(info.email).tab()
            .type(info.direccion).tab()
            .type(info.direccion2)     
        })
    })
}) 
