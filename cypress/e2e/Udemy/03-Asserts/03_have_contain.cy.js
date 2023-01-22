require('cypress-xpath');

describe('Prueba Asserts', () =>{
    it('Prueba Contain & Have', () =>{
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA');

        // Input de datos
        cy.get('#userName').should('be.visible').type('Hyper');
        cy.get('#userEmail').should('be.visible').type('Hyper@gmail.com');
        cy.get('#currentAddress').should('be.visible').type('Domicilio currente 1234');
        cy.get('#permanentAddress').should('be.visible').type('Domicilio permanente 5678');

        cy.get('#submit').click();

        // Assert 'contain' & 'have.text'
        
        cy.get('#name').should('contain','Hyper'); // Si lo contiene, es TRUE

        cy.get('#name').should('have.text','Hyper') // Si es exactamente igual, es TRUE

    });

    it.only('Prueba Contain & Have - 2', () =>{
        cy.visit('https://demoqa.com/text-box');
        cy.title().should('eq','ToolsQA');

        // Input de datos
        cy.get('#userName').should('be.visible').type('Hyper');
        cy.get('#userEmail').should('be.visible').type('Hyper@gmail.com');
        cy.get('#currentAddress').should('be.visible').type('Domicilio currente 1234');
        cy.get('#permanentAddress').should('be.visible').type('Domicilio permanente 5678');

        cy.get('#submit').click();

        // Assert 'contain' & 'have.text'
        
        cy.get('#name').should('contain','Hyper').then(()=>{
            cy.get('#submit').click();
        }); 

    });

})
