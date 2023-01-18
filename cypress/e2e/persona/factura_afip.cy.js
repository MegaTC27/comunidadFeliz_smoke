require('cypress-xpath')
const dayjs = require('dayjs')  // Importar fecha

const PAG_AFIP = 'https://www.afip.gob.ar/'

const CUIT = '20390664258'
const PASS = 'Jitc27061995'

const DIA = 30
const MES = dayjs().format('MM');
const YEAR = dayjs().format('YYYY');

const DATE = `${DIA}/${MES}/${YEAR}`

describe('Nombre_Del_Test_Suite', () => {
    it('Nombre_Del_Test_Case', () => {

        cy.viewport(1360, 768)
        cy.visit(PAG_AFIP)
        cy.title('eq','AFIP | Portal principal')

        cy.xpath('//*[@id="cajaClaveFiscal"]/div[1]/a').invoke('removeAttr','target').click()

        cy.xpath("//input[contains(@id,'username')]").type(CUIT,{force:true})
        cy.xpath("//input[contains(@id,'Siguiente')]").click({force:true})

        cy.xpath("//input[contains(@id,'password')]").type(PASS,{force:true})
        cy.xpath("//input[contains(@id,'Ingresar')]").click({force:true})

        cy.xpath("//h3[contains(.,'Comprobantes en línea')]").invoke('removeAttr','target').click({force:true})

        cy.xpath("//input[contains(@value,'TREPPO CAVARRA JUAN IGNACIO')]").click({force:true})

        cy.xpath("//span[contains(.,'Generar Comprobantes')]").click({force:true})

        cy.get('#puntodeventa').select('00001-Perdriel 1740 - Villa Maipu, Buenos Aires',{force:true}).should('have.value','1')
        cy.get('#universocomprobante').select('Factura C',{force:true}).should('have.value','2')

        cy.xpath("//input[contains(@value,'Continuar')]").click({force:true})

        cy.get('#fc').type(DATE, {force:true})
    })
})