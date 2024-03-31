SHELL = bash

.PHONY: server
server:
	pip install -r requirements.txt && python app.py

.PHONY: client
client:
	cd frontend && npm install && npm start	
