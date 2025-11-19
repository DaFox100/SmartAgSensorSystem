from flask import jsonify
from config.firebase_config import get_db

db = get_db()

def get_data():
    ref = db.reference("/sensor_data")
    data = ref.get()

    if not data:
        return jsonify({"message": "No data found"}), 404

    return jsonify(data)