import csv
import io
from flask import Response
from config.firebase_config import get_db

db = get_db()

def download_csv():
    data = db.reference("/sensor_data").get()

    if not data:
        return "No data", 404

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["timestamp", "temperature", "humidity", "soil_moisture"])

    for ts, entry in sorted(data.items()):
        writer.writerow([
            ts,
            entry.get("temperature", ""),
            entry.get("humidity", ""),
            entry.get("soil_moisture", "")
        ])

    output.seek(0)

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=sensor_data.csv"}
    )