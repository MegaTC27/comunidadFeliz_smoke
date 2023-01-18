require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath

describe('Pruebas Invoke', () => {     
    
    it('Invoke Text', () => {        
        
        cy.viewport(1980, 1200)
        cy.visit('https://testpages.herokuapp.com/styled/validation/input-validation.html')
        cy.title('eq','Input Validation')
        
        cy.get('.page-body > :nth-child(5)').invoke('text').as('info')
        cy.get('@info').should('contain','The information').then(() => {
            cy.get('#firstname').should('be.visible').as('nombre')
            cy.get('@nombre').type('Carlos',{force:true})
        })
    })     

    it('Invoke Estilos - Ocultar y Mostrar elemento', () => {        
        
        cy.viewport(1980, 1000)
        cy.visit('https://testpages.herokuapp.com/styled/validation/input-validation.html')
        cy.title('eq','Input Validation')
        
        let delay = 500

        cy.get('.page-body > :nth-child(5)').should('be.visible').invoke('attr','style','color:green').wait(delay)
        
        cy.get('#firstname').invoke('hide').wait(delay)
        cy.get('#surname').invoke('hide').wait(delay)

        cy.get('#firstname').invoke('show').wait(delay)
        cy.get('#surname').invoke('show')

    }) 

    it('Invoke src', () => {        
        
        cy.viewport(1980, 1000)
        cy.visit('https://docs.cypress.io/guides/overview/why-cypress')
        cy.title('eq','Why Cypress? | Cypress Documentation')

        cy.get('a > .block').invoke('attr','src').should('include','/_nuxt/img/cypress-logo.a2e1292.svg')
    })  


    it.only('Invoke Remove Target', () => {        
        
        cy.viewport(1500, 700)
        cy.visit('https://norrik.com/target-blank-test-page/')
        cy.contains("this is a test").invoke('removeAttr','target').click({force:true})
    })  
});