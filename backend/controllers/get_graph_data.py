from flask import jsonify, request
from datetime import datetime, time
from config.firebase_config import get_db

db = get_db()

# Timestamp format from Firebase:
TS_FMT = "%Y-%m-%dT%H:%M:%S"
DATE_FMT = "%Y-%m-%d"

def get_graph_data():
    """
    Supports:
      /graph-data
      /graph-data?start=2025-07-27
      /graph-data?end=2025-07-28
      /graph-data?start=2025-07-27&end=2025-07-28
    """

    # Read query parameters
    start_str = request.args.get("start")
    end_str = request.args.get("end")

    print(start_str, end_str)

    # Convert start date → datetime at 00:00:00
    if start_str:
        try:
            d = datetime.strptime(start_str, DATE_FMT).date()
            start_dt = datetime.combine(d, time.min)
        except ValueError:
            return jsonify({"error": "Invalid start date. Use YYYY-MM-DD"}), 400
    else:
        start_dt = None

    # Convert end date → datetime at 23:59:59
    if end_str:
        try:
            d = datetime.strptime(end_str, DATE_FMT).date()
            end_dt = datetime.combine(d, time.max)
        except ValueError:
            return jsonify({"error": "Invalid end date. Use YYYY-MM-DD"}), 400
    else:
        end_dt = None

    # Load Firebase data
    data = db.reference("/sensor_data").get() or {}

    results = []

    # Firebase keys are timestamps; entries contain values
    for ts, entry in sorted(data.items()):
        try:
            ts_dt = datetime.strptime(ts, TS_FMT)
        except ValueError:
            continue  # skip malformed timestamps

        # Date matching logic
        if start_dt and ts_dt < start_dt:
            continue
        if end_dt and ts_dt > end_dt:
            continue

        results.append({
            "timestamp": ts,
            "temperature": entry.get("temperature"),
            "humidity": entry.get("humidity"),
            "soil_moisture": entry.get("soil_moisture"),
        })

    return jsonify(results)
