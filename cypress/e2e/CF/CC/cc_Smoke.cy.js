/// <reference types="cypress" />
const dayjs = require('dayjs') 

import { Pages_Login } from "../../../support/pages/pages_Login";
import { Pages_Home } from "../../../support/pages/pages_Home";

describe('Smoke Test',()=>{
    let datosLogin, datosExcel

    const pages_login = new Pages_Login();
    const pages_Home = new Pages_Home();
    // Obtén la fecha actual
    let fecha = dayjs().format('DDMMYY');
    let delay = 2000

    before("Datos", ()=>{
        cy.fixture("loginData").then(datos =>{
            datosLogin=datos;
            //super admin
            datosLogin = datos.test4

            // EXCEL
           cy.fixture("data_CC_excel").then(datos =>{
            datosExcel=datos;
            datosExcel = datos.residentes_y_saldos
            }) 
       })
    })
    beforeEach("Ingreso a CF", () => {
        const nombreComunidad = 'CC Smoke - ' +datosLogin.user+ ' - '+fecha;
        cy.visit(datosLogin.url)
        pages_login.login(datosLogin.usuario, datosLogin.contraseña)
        pages_Home.buscarComunidad(nombreComunidad)
    })
    it("Desactivar Comunidad", ()=>{
        let nombreComunidad = 'CC Smoke - ' +datosLogin.user+ ' - '+fecha;
        pages_Home.desactivarComunidad(nombreComunidad);
    })
    it("Crear comunidad", () => {
        let nombreComunidad = 'CC Smoke - ' +datosLogin.user+ ' - '+fecha;
        pages_Home.crearComunidad(nombreComunidad)
        pages_Home.agregarExelComunidad(datosExcel.propiedades_CC,datosExcel.saldos_CC)
        pages_Home.configurarAdministrador() 
    })        
})
