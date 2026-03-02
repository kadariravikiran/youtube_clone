pipeline {
    agent any

    environment {
        REPO_URL   = "https://github.com/kadariravikiran/youtube_clone.git"
        BRANCH     = "main"
        APP_ROOT   = "/home/ubuntu/app/myapp"
        NGINX_ROOT = "/var/www/youtube_clone"
        PM2_NAME   = "youtube-backend"
    }

    stages {

        stage('Checkout') {
            steps {
                sh """
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
                cd ${APP_ROOT}/repo/youtube_clone-main
                npm install
                npm run build
                """
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh """
                sudo rm -rf ${NGINX_ROOT}
                sudo mkdir -p ${NGINX_ROOT}
                sudo cp -r ${APP_ROOT}/repo/youtube_clone-main/dist/* ${NGINX_ROOT}/
                sudo nginx -t
                sudo systemctl reload nginx
                """
            }
        }

        stage('Deploy Backend') {
            steps {
                sh """
                if ! command -v pm2 > /dev/null; then
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
