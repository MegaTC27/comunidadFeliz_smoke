pipeline {
    agent any

    tools {nodejs "node"}

    stages {

        stage('Cypress Parallel Test Suite') {
            parallel {
                stage('Slave 1') {
                    agent {
                        label "Agente_01"
                    }
                    steps {
                        git url: 'https://github.com/MegaTC27/comunidadFeliz_smoke.git'
                        bat 'npm install cypress --save-dev'
                        bat 'npm update'                       
                        bat 'npx cypress run --record --key 380cb462-a4c0-4748-b2d5-8fa1d53b31cb --parallel'
                    
                    }
                }

                stage('Slave 2') {
                    agent {
                        label "Agente_02"
                    }
                    steps {
                        git url: 'https://github.com/MegaTC27/comunidadFeliz_smoke.git'
                        bat 'npm install cypress --save-dev'
                        bat 'npm update'                       
                        bat 'npx cypress run --record --key 380cb462-a4c0-4748-b2d5-8fa1d53b31cb --parallel'
                    
                    }
                }
            }
        }
    }
}