export class Pages_Login {

    constructor(){
        this.emailInput = "#email";
        this.passwordInput = "#password";
        this.iniciaSesion = ".MuiButton-label"
    }

    
    escribirUsuario(correo){
        cy.get(this.emailInput).type(correo)
    }

    escribirContraseña(contraseña){
        cy.get(this.passwordInput).type(contraseña)
    }

    clickLoginButon(){
        cy.get(this.iniciaSesion).click()
    }

    login(correo, contraseña){
        cy.title().should('eq','ComunidadFeliz');
        this.escribirUsuario(correo)
        this.escribirContraseña(contraseña)
        this.clickLoginButon()
    }
}
