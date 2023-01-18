require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath
/// <reference types= "Cypress"/>
        

describe('FUNCIONES DE SELECCION', () => { 

    it('Desafio tablas)', () => {        
        cy.visit("https://demoqa.com/webtables")
        cy.title().should('eq','ToolsQA')
        
        let campos = []
        let suma = 0
   
        // Seleccionar todos los campos con info
        cy.get(".rt-tr .rt-td").each(($el,$list,index) =>{
            
            if ($el.text().length > 1){
                campos[index] = $el.text()
                cy.log($el.text())
            }

            // Sumar el campo de Edades
            if(Number(campos[index]) && Number(campos[index] < 100)){
                suma = suma + Number(parseInt(campos[index]));
            }

        // Promise .then() para mantener el valor de la variable 'suma'               
        }).then(() =>{
            cy.log('La suma de todas las edades es de ' + suma)
            expect(suma).to.equal(113)
        })
    })

    it.only('Averiguar Edad', () => {   
        cy.visit("https://demoqa.com/webtables")
        cy.title().should('eq','ToolsQA')
        
        let nombre = 'Cierra'
        let edad = 0

        cy.get(".rt-tr .rt-td").each(($el,$list,index) =>{
           
            if ($el.text().includes(nombre)){
                edad = $el.next().next().text()
            }
        
        }).then(() => {
        
            if (edad != 0 && Number(edad)){
                cy.log('La edad de ' + nombre + ' es de ' + edad + ' años')
            }else{
                cy.log('Input inexistente en la columna de nombres')
            }
        })
    })
});  