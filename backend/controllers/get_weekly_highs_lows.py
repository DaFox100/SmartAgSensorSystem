from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db

db = get_db()

def get_weekly_highs_lows():
    start = datetime.strptime(request.args.get("start"), "%Y-%m-%d").date()
    end   = datetime.strptime(request.args.get("end"), "%Y-%m-%d").date()

    all_data = db.reference("/sensor_data").get()
    week = []

    for entry in all_data.values():
        ts = datetime.fromisoformat(entry["timestamp"])
        if start <= ts.date() <= end:
            week.append(entry)

    def min_max(field):
        vals = [float(v[field]) for v in week]
        return max(vals), min(vals)

    high_temp, low_temp = min_max("temperature")
    high_humidity, low_humidity = min_max("humidity")
    high_soil, low_soil = min_max("soil_moisture")

    return jsonify({
        "high_temp": high_temp,
        "low_temp": low_temp,
        "high_humidity": high_humidity,
        "low_humidity": low_humidity,
        "high_soil": high_soil,
        "low_soil": low_soil
    })