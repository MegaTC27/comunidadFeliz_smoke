require('cypress-xpath')

// Comandos configurados en 'supports > commands.js'

describe('HOOKS', () => {

    it('04', () => {
        cy.viewport(1360, 768)
        cy.visit('https://demoqa.com/text-box')
        cy.title('eq','Titulo')

       cy.texto_visible('#userName','Rin')

       cy.prueba_toolsQA('Roberto Gomez Bolainos', 'RGB@gmail.com','AV. Falsa 123', 'Misma avenida')
    })
})