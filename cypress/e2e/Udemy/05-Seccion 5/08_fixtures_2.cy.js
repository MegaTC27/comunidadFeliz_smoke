require('cypress-xpath');
require('cypress-plugin-tab')   // Tabulacion por comando

describe('PRUEBA FIXTURE CON ARRAY', () => {     
   
    // Fixture con varios objetos, con variables repetidas
    it('Prueba 01 - Array', () => {       
        cy.viewport(1280, 900)         
        
        cy.fixture('02_fixture_ejemplo').then(testData =>{
            testData.forEach(data => {
                const d_nombre = data.nombre
                const d_email = data.email
                const d_direccion = data.direccion
                const d_direccion2 = data.direccion2

                cy.visit('https://demoqa.com/text-box');
                cy.title().should('eq','ToolsQA')

                cy.get('#userName').should('be.visible')

                .type(d_nombre).tab()
                .type(d_email).tab()
                .type(d_direccion).tab()
                .type(d_direccion2)
                
                cy.get('#submit').click()
                })
            })
    })

    it.only('Prueba 02 - Mockaroo', () => {       
        cy.viewport(1280, 900)         
        
        cy.fixture('mockaroo').then(testData =>{
            testData.forEach(data => {
                const d_nombre = data.first_name
                const d_email = data.email
                const d_direccion = data.Adress
                const d_direccion2 = data.Permanent_Adress

                cy.visit('https://demoqa.com/text-box');
                cy.title().should('eq','ToolsQA')

                cy.get('#userName').should('be.visible')

                .type(d_nombre).tab()
                .type(d_email).tab()
                .type(d_direccion).tab()
                .type(d_direccion2)
                
                cy.get('#submit').click()
                })
            })
    })
 }) 
