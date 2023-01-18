// Segundo test

describe ('Prueba - testingqarvn.com.es',() => {

        it ('Ejercicio 1', () => {

            cy.visit('https://testingqarvn.com.es/datos-personales/');

            cy.get('#wsf-1-field-21').type('Don Corleone');
            cy.get('#wsf-1-field-22').type('De las Praderas');

            cy.get('input[name="field_23"]').type('mrdoncorleone@hotmail.com') // Obtener elemento por name

            cy.get('#wsf-1-field-24').type('8000-1612023');
            cy.get('#wsf-1-field-28').type('Esta es una direccion muy larga de prueba, no dice nada importante, solamente es de prueba');
    
            cy.get('#wsf-1-field-27').click();
        });
    
});
