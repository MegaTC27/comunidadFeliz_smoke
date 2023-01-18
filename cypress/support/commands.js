// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("texto_visible", (selector, texto) => {
    cy.get(selector).should('be.visible').type(texto,{force:true})
})

Cypress.Commands.add("prueba_toolsQA", (name,email,dir1,dir2) => {
    
    cy.visit('https://demoqa.com/text-box')

    cy.get('#userName').should('be.visible').type(name,{force:true})
    cy.get('#userEmail').should('be.visible').type(email,{force:true})
    cy.get('#currentAddress').should('be.visible').type(dir1,{force:true})
    cy.get('#permanentAddress').should('be.visible').type(dir2,{force:true})
})