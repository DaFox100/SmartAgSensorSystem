from flask import Flask
from flask_cors import CORS
from routes.routes import routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(routes)

@app.route("/")
def home():
    return "running"

if __name__ == "__main__":
    app.run(host="localhost", port=8081)