require('cypress-plugin-tab')

describe('PRIMER DESAFIO', () => {     
    
    it('Pruebas basicas', () => {     
        
        // Acceder y validar titulo
        cy.visit('https://demoqa.com/');
        cy.title().should('eq','ToolsQA');

        // Ingresar a la seccion WebTables
        cy.get('.category-cards > :nth-child(1)').should('be.visible').click({force:true});
        cy.get(':nth-child(1) > .element-list > .menu-list > #item-3').should('be.visible').click({force:true});

        // Agregar unu nuevo usuario
        cy.get('#addNewRecordButton').should('be.enabled').click({force:true});
        cy.get('#firstName').should('be.visible').type('Pablito')
        .tab().type('Pesadilla')
        .tab().type('pab@gmail.com')
        .tab().type('27')
        .tab().type('1500')
        .tab().type('Av. falsa 123');
        
        cy.get('#submit').should('be.enabled').click({force: true});

        // Buscar por nombre
        cy.get('#searchBox').should('be.enabled').type('Pablito');
        
        // Editar
        cy.get('#edit-record-4 > svg > path').click();
        cy.get('#firstName').should('be.visible').clear().type('Marquitos')
        .tab().type('Maldiciones')
        .tab().type('cursedMarked@gmail.com')
        .tab().type('19')
        .tab().type('2700')
        .tab().type('Av. falsa 666');

        cy.get('#submit').click({force: true});

        // Buscar por nombre
        cy.get('#searchBox').should('be.enabled').clear().type('Marquitos');

        // Borrar
        cy.get('#delete-record-4 > svg > path').click();

        // Limpiar filtro de busqueda
        cy.get('#searchBox').clear();
        
        // Log final
        cy.log('Hasta aca llegamos pa');
        
    })
});