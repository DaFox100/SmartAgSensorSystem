from flask import jsonify
from config.firebase_config import get_db

db = get_db()

def get_latest():
    all_data = db.reference("/sensor_data").get()

    if not all_data:
        return {"error": "No data"}, 404

    sorted_items = sorted(all_data.items(), key=lambda x: x[1]["timestamp"])
    return jsonify(sorted_items[-1][1])