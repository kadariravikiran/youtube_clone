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
          cd repo
          echo "Repo root contents:"
          ls -la
        '''
      }
    }

    stage('Build Frontend (auto-detect Vite app)') {
      steps {
        sh '''
          set -e
          cd repo

          FRONTEND_DIR="$(grep -RIl '"vite build"' . | grep package.json | head -n 1 | xargs -r dirname)"
          if [ -z "$FRONTEND_DIR" ]; then
            echo "Could not find Vite frontend (no package.json with vite build)."
            echo "package.json files found:"
            find . -name package.json -maxdepth 4 -print
            exit 1
          fi

          echo "Detected frontend dir: $FRONTEND_DIR"
          cd "$FRONTEND_DIR"

          npm install
          npm run build

          test -d dist
        '''
      }
    }

    stage('Deploy Frontend') {
      steps {
        sh '''
          set -e
          cd repo

          FRONTEND_DIR="$(grep -RIl '"vite build"' . | grep package.json | head -n 1 | xargs -r dirname)"
          cd "$FRONTEND_DIR"

          sudo rm -rf "$NGINX_ROOT"
          sudo mkdir -p "$NGINX_ROOT"
          sudo cp -r dist/* "$NGINX_ROOT"/
          sudo nginx -t
          sudo systemctl reload nginx
        '''
      }
    }

    stage('Deploy Backend (only if folder exists)') {
      steps {
        sh '''
          set -e
          cd repo

          if [ ! -d youtube_backend ]; then
            echo "No backend folder (repo/youtube_backend not found). Skipping backend deploy."
            exit 0
          fi

          if ! command -v pm2 >/dev/null 2>&1; then
            sudo npm install -g pm2
          fi

          cd youtube_backend
          test -f package.json

          npm install

          pm2 delete "$PM2_NAME" || true
          pm2 start npm --name "$PM2_NAME" -- start
          pm2 save
        '''
      }
    }
  }
}
