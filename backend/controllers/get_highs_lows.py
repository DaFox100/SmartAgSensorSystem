from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db

db = get_db()

def get_highs_lows():
    date = request.args.get("date")
    date = datetime.strptime(date, "%Y-%m-%d").date()

    all_data = db.reference("/sensor_data").get()
    today = []

    for entry in all_data.values():
        ts = entry.get("timestamp")
        if not ts:
            continue
        ts_obj = datetime.fromisoformat(ts)
        if ts_obj.date() == date:
            today.append(entry)

    highs_lows = {
        "high_temp": max(d["temperature"] for d in today),
        "low_temp": min(d["temperature"] for d in today),
        "high_humidity": max(d["humidity"] for d in today),
        "low_humidity": min(d["humidity"] for d in today),
        "high_soil": max(d["soil_moisture"] for d in today),
        "low_soil": min(d["soil_moisture"] for d in today),
    }

    return jsonify(highs_lows)