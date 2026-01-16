pipeline {
    agent any

    tools {
        nodejs "Node25"
        dockerTool "Dockertool"
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh '''
                    rm -rf node_modules
                    npm ci || npm install
                '''
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'node ./node_modules/jest/bin/jest.js'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t hola-mundo-node:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                sh '''
                    docker stop hola-mundo-node 2>/dev/null || true
                    docker rm hola-mundo-node 2>/dev/null || true
                    docker run -d --name hola-mundo-node -p 3000:3000 hola-mundo-node:latest
                '''
            }
        }
    }
}
