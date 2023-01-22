require('cypress-plugin-tab')   // Tabulacion por comando
require('cypress-xpath')        // Selector de Xpath

describe('PRUEBAS EACH', () => {     
    
    // Recorrer e imprimir por consola todos los elementos con each
    it('Each 01', () => {                
        cy.visit('https://www.montagne.com.ar/');
        cy.title().should('eq','Montagne - Indumentaria Outdoors y artículos de camping - Montagne Outdoors');      
        cy.get('.home-categories-item-inside').each(($el,index, $list) => {
            cy.log($el.text())
            //cy.log($list.text())

        });     
    })

    // Recorrer y darle click a un elemento especifico con each
    it('Each 02', () => {                
        cy.visit('https://www.montagne.com.ar/');
        cy.title().should('eq','Montagne - Indumentaria Outdoors y artículos de camping - Montagne Outdoors');      
        
        cy.get('.home-categories-item-inside').each(($el,index, $list) => {
            let objeto = $el.text()
            
            if (objeto.includes('Pantalones y Shorts')){
                cy.wrap($el).click({force:true})
            }
        });     
    })

    // Recorrer y darle click a todos los elementos con each.
    it('Each 03', () => {                
        cy.visit('https://www.montagne.com.ar/');
        cy.title().should('eq','Montagne - Indumentaria Outdoors y artículos de camping - Montagne Outdoors');      
        
        cy.get('.home-categories-item-inside').each(($el,index, $list) => {
            cy.wrap($el).should('be.visible').click({force:true})
            cy.log('Click sobre el elemento "' + $el.text() + '"')
            
        });
    });
    
    // Recorrer y darle like a todos los elementos con each y for.
    it.only('Each 04', () => {             
        
        cy.viewport(1800, 1200)

        let time = 0
        cy.visit('https://www.montagne.com.ar/');
        cy.title().should('eq','Montagne - Indumentaria Outdoors y artículos de camping - Montagne Outdoors');      
        cy.xpath("//a[@class='btn btn-ghost btn-black'][contains(.,'Camping')]").click({force:true})

        let datos = []

        cy.get('.product-list-image-container').each(($el,index, $list) => {
            datos[index]=$el.text()
        }).then(()=> {

            let totalArticulos = datos.length;
            cy.log('Cantidad de articulos: ' + totalArticulos)

            for(let i = 0; i < 10; i++) {
                cy.get('.product-list-image-container').eq(i).should('be.visible').click()
                
                cy.get('#btn-producto-fav').should('be.visible').click({force:true})
                cy.visit('https://www.montagne.com.ar/categoria/11-camping')
                cy.xpath("//span[@itemprop='name'][contains(.,'Camping')]").click({force:true});
            }
        })            
    })
});