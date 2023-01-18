require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath
//import 'cypress-file-upload'


describe('UPLOAD ARCHIVOS', () => {     
    
    it.only('Primera prueba', () => {                
        cy.visit('https://testingqarvn.com.es/upload-files/').title().should('eq','Upload Files | TestingQaRvn');        
        cy.get('#wsf-1-field-80').should('be.visible').type('Jai me')
        .tab().type('Bajame laja')
        .tab().type('ula@gmail.com')
        .tab().type('Telefono, ni idea')
        .tab().type('AV. FALSA 123')

        cy.get('#wsf-1-field-85-row-2').should('not.be.visible').check({force:true})
        cy.get('#wsf-1-field-85-row-1').should('not.be.visible').check({force:true})
        cy.get('#wsf-1-field-85-row-3').should('not.be.visible').check({force:true})

        cy.get('#wsf-1-field-86-row-3').should('not.be.visible').check({force:true})
        cy.get('#wsf-1-field-86-row-2').should('not.be.visible').check({force:true})
        cy.get('#wsf-1-field-86-row-1').should('not.be.visible').check({force:true})

        cy.get('#wsf-1-field-87').select('Linux').should('have.value','Linux')
        cy.get('#wsf-1-field-89').select('Ubuntu').should('have.value','Ubuntu')

        cy.get('#wsf-1-field-91').type('Noviembre 19, 2022')
        .tab().type('Noviembre 20, 2022')

        cy.get('#wsf-1-field-94').selectFile('T:/UDEMY/Cypress/cypress/e2e/04-Seccion 4/01.jpg')
        //cy.get('#wsf-1-field-94').attachFile('T:/UDEMY/Cypress/cypress/e2e/04-Seccion 4/01.jpg')
        //cy.get("[type='file']").selectFile('C:\Users\Juan Ignacio\Downloads\prueba.pdf')

        cy.get('#wsf-1-field-93').click()
    })

    it('Segunda prueba', () => {

        cy.visit(' https://demoqa.com/upload-download')
        //cy.get('#uploadFile').attachFile('01.jpg') 
        cy.get('#uploadFile').selectFile('T:/UDEMY/Cypress/cypress/e2e/04-Seccion 4/prueba.pdf')
        cy.get('.total-billing').click({force:true})
    })     
});