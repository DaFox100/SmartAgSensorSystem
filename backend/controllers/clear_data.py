from flask import jsonify
from config.firebase_config import get_db

db = get_db()

def clear_data():
    db.reference("/sensor_data").delete()
    return jsonify({"status": "cleared"}), 200