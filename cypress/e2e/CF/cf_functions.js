const dayjs = require('dayjs')  // Importar fecha

const WEB = Cypress.env('WEB_5');
const USER = Cypress.env('USER_5');
const PASS = Cypress.env('PASS_5');

const DATE = dayjs().format('DD/MM/YY - HH:mm');
const DATE2 = dayjs().format('DD/MM/YY');
const DATE_AUX = dayjs().format('DDMMYY');
const NOMBRE = 'Cypress - ' + DATE2;

let nombreAdmin = 'Cypress'
let mailAdmin = nombreAdmin + DATE_AUX + '@gmail.com'

export const DIMENSIONES = () => {
  cy.viewport(1360, 768)
}

export const PAGINA_INICIAL  = (w = WEB) => {
  cy.visit(w);
  cy.title().should('eq','ComunidadFeliz');      
}

export const PAGINA_INICIAL_VERCEL  = (w = WEB) => {
  cy.visit(w);
}

export const INICIO_SUPERADMIN = (u= USER, p = PASS) => {
  cy.get('#email').should('be.visible').type(u)
  cy.get('#password').type(p)
  cy.xpath("//span[contains(.,'Inicia sesión')]").click({force:true})
}

export const INICIO_ADMIN = (mAdmin = mailAdmin, p =PASS) => {
  cy.get('#email').should('be.visible').type(mAdmin)
  cy.get('#password').type(p)
  cy.xpath("//span[contains(.,'Inicia sesión')]").click({force:true})
}

export const BUSCAR_COMUNIDAD = (comunidad = NOMBRE) => {
  cy.xpath("(//a[contains(.,'Comunidades')])[2]").should('be.visible').click({force:true})
  cy.get('#search').type(comunidad,{force:true});
  cy.xpath("//input[contains(@value,'Buscar')]").click({force:true})
}

// CIERRE DE MODALES

export const MODAL_TYC = () => {
  // Verifcar modal de Términos y Condiciones

  let aux = false

  cy.get('a').each(($el,index, $list) => {

    const TEXT1 = $el.text()
    const RESULTADO = TEXT1.includes('He leído y acepto las Condiciones de Uso')
    
    if (RESULTADO){
      aux = true
    }

  }).then(()=>{

    if (aux){
      cy.xpath("//div[contains(@class,'btn btn-success')]").should('be.visible').click({force:true})
      cy.log('MODAL DE TERMINOS Y CONDICIONES').as("MODAL TyC CERRADO")
    }
  })
}

export const MODAL_CAMBIAR_PASS = () => {
  // Verifcar modal de Cambia tu contraseña

  cy.get('a').each(($el,index, $list) => {

    const TEXT1 = $el.text()
    const RESULTADO = TEXT1.includes('No por ahora')

    if (RESULTADO){
      cy.xpath("//a[contains(@href,'now=true')]").should('be.visible').click({force:true})
      cy.log('MODAL CAMBIAR CONTRASEÑA').as("MODAL CAMBIAR PASS CERRADO")
    }
  })  
}

export const SELECCIONAR_COMUNIDAD = (aux = NOMBRE) => {
  // Seleccionar ultima comunidad al iniciar como Admin

  let cantidad = 0

  cy.get('div').each(($el) => {
    
    const TEXT1 = $el.text()
    const RESULTADO = TEXT1.includes('Comunidades que')

    if (RESULTADO){
      cy.xpath("(//div[contains(@class,'col-xs-12 no-padding')])").each(($el,index, $list) => {
        cantidad = $list.length
      })
    } 
    
  }).then(()=> {
    if (cantidad > 0){
      cy.xpath(`(//div[contains(@class,"col-xs-12 no-padding")])[${cantidad}]`).click({force: true})
      cy.log('SELECCIÓN DE COMUNIDAD').as("SELECCIONAR COMUNIDAD CERRADO")
    }
  })
}

/* export const MODAL_BIENVENIDA_OLD = () => {
  // Verificar modal de Bienvenido a CF
  cy.get('h1').each(($el,index, $list) => {
      
      const text1 = $el.text()
      const resultado = text1.includes('¡Bienvenido a')
      
      if (resultado){
          cy.get('#btn-start-admin-tour').should('be.visible').click({force:true})
          cy.log('####### MODAL DE BIENVENIDA CERRADO #######')
      }
  })
}
*/

export const MODAL_BIENVENIDA = () => {
  // Verificar modal de Bienvenido a CF
  cy.get('button').each(($el,index, $list) => {
      
      const text1 = $el.text()
      const resultado = text1.includes('Iniciar Recorrido')
      
      if (resultado){
          cy.get('#btn-start-admin-tour').should('be.visible').click({force:true})
          cy.log('####### MODAL DE BIENVENIDA CERRADO #######')
      }
  })
}

export const MODAL_BIBLIOTECA = () => {
  // Verifcar modal de Tutorial de Bibliteca
  cy.get('h1').each(($el,index, $list) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('Actualizamos la')
      
      if (RESULTADO){
          cy.xpath("//a[contains(.,'Saltar Tutorial')]").should('be.visible').click({force:true})
          cy.log('####### MODAL DE TUTORIAL DE BIBLIOTECA CERRADO #######')
      }
  })
}

export const MODAL_NUEVA_FUNCIONALIDAD = () => {
    // Verifcar modal de Nueva Funcionalidad
    cy.xpath('//p').each(($el) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('Sumamos una nueva funcionalidad')
      
      if (RESULTADO){
          cy.xpath("//a[contains(.,'Saltar tutorial')]").should('be.visible').click({force:true})
          cy.log('####### MODAL DE NUEVA FUNCIONALIDAD CERRADO #######')
      }
  })
}

export const CIERRE_MODALES = () => {
    
  MODAL_TYC();
  MODAL_CAMBIAR_PASS();
  SELECCIONAR_COMUNIDAD();
  MODAL_BIENVENIDA();
  //MODAL_BIBLIOTECA(); Descontinuado ?
  
}

export const ADMIN_CERRAR_SESION = () => {
  cy.xpath("(//a[contains(@data-title,'Mi Cuenta')])[1]").click({force:true})
  cy.xpath("(//a[@href='/log_out'][contains(.,'Cerrar sesión')])[1]").click({force:true});
}

// MÓDULOS ADMIN

export const MEDIDORES = () => {
  cy.xpath("//span[@class='sidebar_text'][contains(.,'Medidores')]").click({force:true})
}

export const MODULO_CARGOS = () => {
  cy.xpath("//div[@class='divLink'][contains(.,'Cargos')]").should("be.visible").click({force: true});
}

// RESIDENTE

export const RES_MODAL_LATAM = () => {
  cy.xpath('//button').each(($el) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('Cerrar')
      
      if (RESULTADO){
        cy.get('.btn-link').should('be.visible').click({force:true}).as("MODAL DE LATAM")
      }
  })
}

export const RES_BIENVENIDA = () => {
  cy.get('h1').each(($el) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('¡Te damos la bienvenida')
      
      if (RESULTADO){
        cy.xpath("//button[contains(.,'Entendido')]").should('be.visible').click({force:true}).as("MODAL DE BIENVENIDA")
      }
  })
}

export const RES_MODAL_NUEVA_VISTA = () => {
  cy.xpath('//button').each(($el) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('Quizás más tarde')
      
      if (RESULTADO){
        cy.xpath("//button[contains(.,'Quizás más tarde')]").should('be.visible').click({force:true}).as("MODAL NUEVO PORTAL")
      }
  })
}

export const RES_CIERRE_MODALES = () => {
  RES_BIENVENIDA()
  RES_MODAL_LATAM()
  RES_MODAL_NUEVA_VISTA()
}

export const RES_TERMINOS_CONDICIONES = () => {
  cy.xpath('//button').each(($el) => {

      const TEXT1 = $el.text()
      const RESULTADO = TEXT1.includes('Aceptar términos y condiciones')
      
      if (RESULTADO){
        cy.get('#confirm-tac-btn').click({force:true})
        cy.log(' ####### TÉRMIOS Y CONDICIONES CERRADO ####### ')
      } 
  })
}

export const RES_CERRAR_SESION = () =>{
  cy.xpath('(//button[contains(@class,"css-o8riuk")])[2]').click({force:true});
  cy.xpath("//div[@role='menuitem'][contains(.,'Cerrar sesión')]").click({force:true});
}

export const RUT_GENERATOR = () => {

  // Función para generar un dígito verificador aleatorio
  function generarDigitoVerificador() {
    var rut = '';
    
    for (var i = 0; i < 8; i++) {
        rut += Math.floor(Math.random() * 10);
    }

    var verificador = 0;
    var factor = 2;
    
    for (var i = rut.length - 1; i >= 0; i--) {
        verificador += parseInt(rut.charAt(i)) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }
    
    verificador = 11 - (verificador % 11);
    
    if (verificador === 11) {
    return '0';
    } else if (verificador === 10) {
    return 'K';
    } else {
    return verificador.toString();
    }
  }

  // Función para generar un RUT chileno válido
  function generarRUT() {
      var rut = '';
      for (var i = 0; i < 7; i++) {
          rut += Math.floor(Math.random() * 10);
      }
      rut += '-' + generarDigitoVerificador();
      return rut;
  }

  // Resultado
  var rutGenerado = generarRUT();
  cy.log(rutGenerado);
}

export const OBTENER_FECHA_MANIANA = () => {
  // Obtener la fecha actual
  var fechaActual = new Date();

  // Obtener el día actual
  var diaActual = fechaActual.getDate();

  // Obtener el mes actual (se resta 1 porque los meses empiezan en 0)
  var mesActual = fechaActual.getMonth();

  // Obtener el año actual
  var anioActual = fechaActual.getFullYear();

  // Determinar la cantidad de días en el mes actual
  var diasEnElMes = new Date(anioActual, mesActual + 1, 0).getDate();

  // Calcular la fecha de mañana
  var diaManiana = diaActual + 1;
  var mesManiana = mesActual;
  var anioManiana = anioActual;

  // Comprobar si es necesario ajustar el mes o el año
  if (diaManiana > diasEnElMes) {
      diaManiana = 1;
      mesManiana++;

      if (mesManiana > 11) {
          mesManiana = 0;
          anioManiana++;
      }
  }

  // Crear la fecha del día de mañana
  var fechaManiana = new Date(anioManiana, mesManiana, diaManiana);

  // Formatear la fecha en formato DD/MM/AAAA
  var diaManianaFormateado = ("0" + fechaManiana.getDate()).slice(-2);
  var mesManianaFormateado = ("0" + (fechaManiana.getMonth() + 1)).slice(-2);
  var anioManianaFormateado = fechaManiana.getFullYear();

  // Generar la fecha de mañana
  fechaManiana = `${diaManianaFormateado}/${mesManianaFormateado}/${anioManianaFormateado}`

  // Devolver la fecha de mañana
  return fechaManiana;
}

export const INICIO_VERCEL = (mail, pass) => {

  cy.get('[name="email"]').clear().type(mail,{force:true})
  cy.get('[name="password"]').clear().type(pass,{force:true})

  cy.get("button").contains("Sign in").click({force:true}).wait(1500)
  cy.get("a").contains("Return").click({force:true}).wait(1500)

}