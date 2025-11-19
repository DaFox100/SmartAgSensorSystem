from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db

db = get_db()

def receive_data():
    data = request.get_json(force=True)
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    data["timestamp"] = timestamp

    db.reference("/sensor_data").child(timestamp).set(data)
    return {"status": "success"}, 200