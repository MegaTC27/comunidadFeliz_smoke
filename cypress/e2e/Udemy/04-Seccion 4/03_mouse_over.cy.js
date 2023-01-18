require('cypress-xpath')    

describe('PRUEBAS EVENTOS DEL MOUSE', () => {     
    
    it('Mouse hover using trigger ', () => {
        cy.viewport(1500, 700)
        cy.visit('https://www.idrlabs.com/personality-type/test.php')
  
        cy.xpath("//input[contains(@type,'range')]").trigger('mouseover')
        //cy.xpath("//input[contains(@type,'range')]").invoke('attr','value','20')
   
   
    })                   
});

