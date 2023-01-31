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
                        bat 'npm install'
                        bat 'npm update'                       
                        bat 'npx cypress run --record --key 1893406c-ed6a-40ed-b6a5-ae03f154ab69 --parallel'
                    
                    }
                }

                stage('Slave 2') {
                    agent {
                        label "Agente_02"
                    }
                    steps {
                        git url: 'https://github.com/MegaTC27/comunidadFeliz_smoke.git'
                        bat 'npm install'
                        bat 'npm update'                       
                        bat 'npx cypress run --record --key 1893406c-ed6a-40ed-b6a5-ae03f154ab69 --parallel'
                    
                    }
                }
            }
        }
    }
}