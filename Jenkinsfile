
pipeline {
    agent any

    environment {
        REPO_URL   = "https://github.com/kadariravikiran/youtube_clone.git"
        BRANCH     = "main"
        APP_ROOT   = "/opt/youtube_clone"
        NGINX_ROOT = "/var/www/youtube_clone"
        PM2_NAME   = "youtube-backend"
    }

    stages {

        stage('Checkout') {
            steps {
                sh """
                set -e
                rm -rf ${APP_ROOT}
                mkdir -p ${APP_ROOT}
                cd ${APP_ROOT}
                git clone -b ${BRANCH} ${REPO_URL} repo
                """
            }
        }

        stage('Build Frontend') {
            steps {
                sh """
                set -e
                cd ${APP_ROOT}/repo/youtube_clone-main
                npm install
                npm run build
                """
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh """
                set -e
                rm -rf ${NGINX_ROOT}
                mkdir -p ${NGINX_ROOT}
                cp -r ${APP_ROOT}/repo/youtube_clone-main/dist/* ${NGINX_ROOT}/
                sudo nginx -t
                sudo systemctl reload nginx
                """
            }
        }

        stage('Deploy Backend') {
            steps {
                sh """
                set -e

                if ! command -v pm2 >/dev/null 2>&1; then
                    sudo npm install -g pm2
                fi

                cd ${APP_ROOT}/repo/youtube_backend
                npm install

                pm2 delete ${PM2_NAME} || true
                pm2 start npm --name ${PM2_NAME} -- start
                pm2 save
                """
            }
        }
    }
}
