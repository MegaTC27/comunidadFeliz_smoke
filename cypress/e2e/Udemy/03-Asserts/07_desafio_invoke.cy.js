require('cypress-xpath');
/// <reference types="cypress" />

let mensaje = 'Yoshi TV, para todo el mundo';
let a = 27;
let b = 30;

describe('Desafio Asserts', () =>{
    it('Primera vuelta', () =>{

        cy.visit('https://syntaxprojects.com/basic-first-form-demo.php');

        cy.get('#user-message').should('be.visible'). and('have.class','form-control').type(mensaje);
        cy.xpath('//button[@type="button"][contains(.,"Show Message")]').should('be.visible').click({force:true});

        cy.get('#sum1').should('be.visible').and('have.class','form-control').type(a);

        cy.get('#sum2').should('be.visible').and('have.class','form-control').type(b);
    
        cy.contains('[type="button"]',"Get Total").should('be.visible').click({force:true});
        //cy.xpath('//button[contains(.,"Get Total")]').click({force:true});

        cy.get('#displayvalue').should('be.visible').then((e) => {
            cy.log(e.text());
        });
    });

    it('Segunda vuelta', () =>{

        mensaje = 'Ultitmo mundial de messi';
        a = 7;
        b = 3;

        cy.get('#user-message').should('be.visible'). and('have.class','form-control').clear().type(mensaje);
        cy.xpath('//button[@type="button"][contains(.,"Show Message")]').should('be.visible').click({force:true});

        cy.get('#sum1').should('be.visible').and('have.class','form-control').clear().type(a);
        cy.get('#sum2').should('be.visible').and('have.class','form-control').clear().type(b);
    
        cy.contains('[type="button"]',"Get Total").should('be.visible').click({force:true});
        //cy.xpath('//button[contains(.,"Get Total")]').click({force:true});

        cy.get('#displayvalue').should('be.visible').then((e) => {
            cy.log(e.text());
        });
    });

    it('Tercera vuelta', () =>{

        mensaje = 'Ultitmo mundial de messi';
        a = 10;
        b = 15;

        cy.get('#user-message').should('be.visible'). and('have.class','form-control').clear().type(mensaje);
        cy.xpath('//button[@type="button"][contains(.,"Show Message")]').should('be.visible').click({force:true});

        cy.get('#sum1').should('be.visible').and('have.class','form-control').clear().type(a);
        cy.get('#sum2').should('be.visible').and('have.class','form-control').clear().type(b);
    
        cy.contains('[type="button"]',"Get Total").should('be.visible').click({force:true});
        //cy.xpath('//button[contains(.,"Get Total")]').click({force:true});

        cy.get('#displayvalue').should('be.visible').then((e) => {
            
            let suma = e.text();
            let limite = 30;

            if (suma > limite){
                cy.log('Flaco te pasaste del limite, te borro todo');

                cy.get('#user-message').clear();
                cy.get('#sum1').clear();
                cy.get('#sum2').clear();
            } else {
                cy.log('Flaco todo bien, no superes los ' + limite + ' en tu puta vida')
            }
            
            cy.log(e.text());
        });
    });

    it('Cuarta vuelta (Invoke)', () =>{

        mensaje = 'Prueba Invoke';
        a = 7;
        b = 3;

        cy.visit('https://syntaxprojects.com/basic-first-form-demo.php');

        cy.get('#user-message').should('be.visible'). and('have.class','form-control').clear().type(mensaje);
        cy.xpath('//button[@type="button"][contains(.,"Show Message")]').should('be.visible').click({force:true});

        cy.get('#sum1').invoke('attr','placeholder','Mete el primer valor perro')
        .invoke('attr','style','color:red')
        .should('be.visible')
        .type(a);

        cy.get('#sum2').invoke('attr','placeholder','Mete el segundo valor perro')
        .invoke('attr','style','color:blue')
        .should('be.visible')
        .type(b);
    
        cy.contains('[type="button"]',"Get Total")
        .should('be.visible')
        .click({force:true});
      
        cy.get('#displayvalue')
        .should('be.visible')
        .invoke('attr','style','color:orange')
        .then((e) => {
            cy.log(e.text());
        });
    
    });

})
