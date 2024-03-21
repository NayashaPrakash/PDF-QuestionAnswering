.PHONY: backend frontend

backend:
    @echo "Building backend..."
    python app.py

frontend:
    @echo "Building frontend..."
    cd frontend/src && npm start

build: backend frontend
