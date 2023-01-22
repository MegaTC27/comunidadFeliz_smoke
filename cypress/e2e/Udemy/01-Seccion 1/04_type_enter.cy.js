/// <reference types="cypress" />
// Para que funcione el predictivo de los comandos

describe('Funcion Type-Enter', () => {                  // describe --> titulo de la test suite
    
    it('Type: ENTER', () => {

        cy.visit('https://www.google.com');        
        cy.title().should('eq','Google');
        cy.wait(1000);

    //  let buscador = cy.get('body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input');
        let buscador = cy.get("[name='q']");
        buscador.type('osos pandas {enter}');
        cy.wait(1000);
        
        cy.get('[href="https://www.nationalgeographic.com.es/animales/osos-panda"] > .LC20lb').click();

        cy.log('Todo ok');                             
    })
});