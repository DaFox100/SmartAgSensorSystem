from flask import jsonify
from config.firebase_config import get_db

db = get_db()

def get_graph_data():
    data = db.reference("/sensor_data").get()

    results = []
    for ts, entry in sorted(data.items()):
        results.append({
            "timestamp": ts,
            "temperature": entry.get("temperature"),
            "humidity": entry.get("humidity"),
            "soil_moisture": entry.get("soil_moisture"),
        })

    return jsonify(results)