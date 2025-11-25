from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db

db = get_db()

def get_highs_lows():
    # Get date from query string: ?date=YYYY-MM-DD
    date_str = request.args.get("date")

    if date_str is None:
        # Fallback: if React (or something) calls /highs_lows without a date,
        # just use today's date.
        target_date = datetime.now().date()
    else:
        try:
            # Expect exactly %Y-%m-%d
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Date must be in format YYYY-MM-DD"}), 400

    all_data = db.reference("/sensor_data").get() or {}
    today = []

    for entry in all_data.values():
        ts = entry.get("timestamp")
        if not ts:
            continue

        try:
            ts_obj = datetime.fromisoformat(ts)
        except ValueError:
            continue

        if ts_obj.date() == target_date:
            today.append(entry)

    if not today:
        return jsonify({
            "date": target_date.strftime("%Y-%m-%d"),
            "message": "No data found for this date."
        }), 200
    highs_lows = {
        "high_temp": max(d["temperature"] for d in today),
        "low_temp": min(d["temperature"] for d in today),
        "high_humidity": max(d["humidity"] for d in today),
        "low_humidity": min(d["humidity"] for d in today),
        "high_soil": max(d["soil_moisture"] for d in today),
        "low_soil": min(d["soil_moisture"] for d in today),
    }

    return jsonify(highs_lows)