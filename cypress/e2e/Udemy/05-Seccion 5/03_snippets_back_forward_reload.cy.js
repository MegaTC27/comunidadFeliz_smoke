require('cypress-xpath')

describe('Nombre_Del_Test_Suite', () => {
    it('Nombre_Del_Test_Case', () => {

        const DELAY = 2000

        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com')
        cy.title('eq','ToolsQA')

        cy.get('.category-cards > :nth-child(1)').click({force:true}).wait(DELAY)

        cy.go('back').wait(DELAY)
        cy.go('forward')
        cy.reload()
    })
})