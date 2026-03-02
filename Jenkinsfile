pipeline {
  agent any

  environment {
    REPO_URL   = "https://github.com/kadariravikiran/youtube_clone.git"
    BRANCH     = "main"
    NGINX_ROOT = "/var/www/youtube_clone"
    PM2_NAME   = "youtube-backend"
  }

  stages {

    stage('Checkout') {
      steps {
        sh '''
          set -e
          rm -rf repo
          git clone -b "$BRANCH" "$REPO_URL" repo
        '''
      }
    }

    stage('Build Frontend') {
      steps {
        sh '''
          set -e
          cd repo/youtube_clone-main
          npm install
          npm run build
        '''
      }
    }

    stage('Deploy Frontend') {
      steps {
        sh '''
          set -e
          sudo rm -rf "$NGINX_ROOT"
          sudo mkdir -p "$NGINX_ROOT"
          sudo cp -r repo/youtube_clone-main/dist/* "$NGINX_ROOT"/
          sudo nginx -t
          sudo systemctl reload nginx
        '''
      }
    }

    stage('Deploy Backend') {
      steps {
        sh '''
          set -e

          if [ ! -d repo/youtube_backend ]; then
            echo "youtube_backend folder not found in repo"
            exit 1
          fi

          if ! command -v pm2 >/dev/null 2>&1; then
            sudo npm install -g pm2
          fi

          cd repo/youtube_backend
          npm install

          pm2 delete "$PM2_NAME" || true
          pm2 start npm --name "$PM2_NAME" -- start
          pm2 save
        '''
      }
    }
  }
}
