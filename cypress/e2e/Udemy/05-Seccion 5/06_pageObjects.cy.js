import { default as homePage } from './page-objects/home-page'

import 'cypress-xpath'

describe('el maldito page object', () => {
    it('como la sufriste papa', () => {

        homePage.visit1()
        homePage.visit2()
        homePage.visit3()
        homePage.visit4()
        homePage.visit5()

        const PERRA =  homePage

        PERRA.visit5()
        PERRA.visit1()

    })
})