require('cypress-xpath');

describe('Prueba Asserts', () =>{
    it.only('Desafio 1',()=>{
        
        let billetera = 80;

        for (let i=0; i<6 ; i++){

            cy.visit('http://automationpractice.com/index.php');
            //cy.title().should('eq','My Store');
            
            cy.get('.product-container').find('.product-image-container').eq(i).click();
            
            // Validar estado
            cy.get('#product_condition').contains('New').then((e)=>{
                let estado = e.text();
                
                if (estado =='New'){
                    cy.get('#product_condition').should('be.visible')
                    cy.log((i+1) + ' = ' + estado)
                        
                } else {
                    cy.get('#product_condition').should('be.visible')
                    cy.log((i+1) + ' = ' + 'Used')
                }
            });

            // Validar precio y Agregar al carrito
            
            cy.get('#our_price_display').then((e)=>{
                let precio = e.text().slice(1,10);
                
                if (billetera - precio >= 0){
                    
                    cy.get('#add_to_cart').click();
                    cy.get('#our_price_display').should('be.visible')
                    cy.log('Agregado al carrito. Saldo Actual: $' + billetera.toFixed(2));
                    
                } else {
                    cy.get('#our_price_display').should('be.visible')
                    cy.log('Saldo insuficiente: $' + billetera.toFixed(2));
                }
            })
        }
    })
})
