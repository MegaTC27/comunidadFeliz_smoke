require('cypress-xpath')

describe('HOOKS', () => {
    
    before(() => {
        cy.log('Esto se ejecuta al comienzo de la Test Suite')
    })
    
    beforeEach(() => {
        cy.log('Esto se ejecuta al comienzo de cada Test Case')
    })

    afterEach(() => {
        cy.log('Esto se ejecuta después de cada Test Case')
    })

    after(()=>{
        cy.log('Esto se ejecuta después de la Test Suite')
    })

    it('01', () => {
        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com')
        cy.title('eq','Titulo')
    })

    it('02', () => {
        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com')
        cy.title('eq','Titulo')
    })

    it('03', () => {
        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com')
        cy.title('eq','Titulo')
    })

    it('04', () => {
        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com')
        cy.title('eq','Titulo')
    })
})