pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    REPO_URL     = "https://github.com/kadariravikiran/youtube_clone.git"
    BRANCH       = "main"

    // CHANGE ONLY THESE IF YOUR FOLDER NAMES ARE DIFFERENT
    FRONTEND_DIR = "frontend"
    BACKEND_DIR  = "youtube_backend"

    NGINX_ROOT   = "/var/www/youtube_clone"
    PM2_NAME     = "youtube-backend"
  }

  stages {

    stage('Checkout') {
      steps {
        sh '''
          set -euo pipefail
          rm -rf repo
          git clone -b "$BRANCH" "$REPO_URL" repo
          echo "Repo cloned into: $(pwd)/repo"
          ls -la repo
        '''
      }
    }

    stage('Build Frontend') {
      steps {
        sh '''
          set -euo pipefail

          if [ ! -d "repo/$FRONTEND_DIR" ]; then
            echo "ERROR: Frontend directory not found: repo/$FRONTEND_DIR"
            echo "Repo folders are:"
            ls -la repo
            exit 1
          fi

          cd "repo/$FRONTEND_DIR"

          if [ ! -f package.json ]; then
            echo "ERROR: package.json not found in frontend dir"
            exit 1
          fi

          npm ci || npm install
          npm run build

          if [ ! -d dist ]; then
            echo "ERROR: dist folder not generated. Check your build config."
            exit 1
          fi
        '''
      }
    }

    stage('Deploy Frontend') {
      steps {
        sh '''
          set -euo pipefail

          sudo rm -rf "$NGINX_ROOT"
          sudo mkdir -p "$NGINX_ROOT"

          sudo rsync -a --delete "repo/$FRONTEND_DIR/dist/" "$NGINX_ROOT/"

          sudo nginx -t
          sudo systemctl reload nginx

          echo "Frontend deployed to: $NGINX_ROOT"
        '''
      }
    }

    stage('Deploy Backend') {
      steps {
        sh '''
          set -euo pipefail

          if [ ! -d "repo/$BACKEND_DIR" ]; then
            echo "ERROR: Backend directory not found: repo/$BACKEND_DIR"
            echo "Repo folders are:"
            ls -la repo
            exit 1
          fi

          if ! command -v node >/dev/null 2>&1; then
            echo "ERROR: node is not installed on the Jenkins server"
            exit 1
          fi

          if ! command -v npm >/dev/null 2>&1; then
            echo "ERROR: npm is not installed (install Node.js properly)"
            exit 1
          fi

          if ! command -v pm2 >/dev/null 2>&1; then
            sudo npm install -g pm2
          fi

          cd "repo/$BACKEND_DIR"

          if [ ! -f package.json ]; then
            echo "ERROR: package.json not found in backend dir"
            exit 1
          fi

          npm ci || npm install

          # Restart cleanly
          pm2 delete "$PM2_NAME" || true

          # IMPORTANT: ensure your backend has a "start" script in package.json
          pm2 start npm --name "$PM2_NAME" -- start --update-env
          pm2 save

          pm2 list
          echo "Backend deployed and running under PM2 name: $PM2_NAME"
        '''
      }
    }
  }

  post {
    always {
      sh '''
        echo "Workspace: $(pwd)"
        echo "Disk usage:"
        df -h || true
      '''
    }
  }
}
