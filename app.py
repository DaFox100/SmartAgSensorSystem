from flask import Flask, request, jsonify, Response, render_template
from datetime import datetime
import csv
import os
import io
import firebase_admin
from firebase_admin import credentials, db


cred = credentials.Certificate("/Users/michaelfox/Programming/SmartAgSenorSystem/smartagsensordata-firebase-adminsdk.json")
firebase_admin.initialize_app(cred,{ 'databaseURL':"https://smartagsensordata-default-rtdb.firebaseio.com/"})


app = Flask(__name__)


@app.route('/data', methods=['POST'])
def receive_data():
    try:
        data = request.get_json(force=True)

        # Add a timestamp
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        data['timestamp'] = timestamp
        print("Data Reived:", data )

        # Push to Firebase under /sensor_data
        ref = db.reference("/sensor_data")
        ref.child(timestamp).set(data)

        return {"status": "success"}, 200

    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/data', methods=['GET'])
def get_data():
    try:
        ref = db.reference("/sensor_data")
        data = ref.get()

        if data is None:
            return jsonify({"message": "No data found"}), 404

        return jsonify(data), 200

    except Exception as e:
        print("Error fetching data:", str(e))
        return jsonify({"error": str(e)}), 500


def rename_firebase_folder(old_path: str, new_path: str):
    try:
        # Step 1: Read data from old path
        ref_old = db.reference(old_path)
        data = ref_old.get()

        if data is None:
            print(f"No data found at {old_path}. Rename aborted.")
            return False

        # Step 2: Write data to new path
        ref_new = db.reference(new_path)
        ref_new.set(data)

        # Step 3: Delete old path
        ref_old.delete()

        print(f"Folder renamed from '{old_path}' to '{new_path}' successfully.")
        return True

    except Exception as e:
        print(f"Error renaming folder: {e}")
        return False

@app.route('/data.csv', methods=['GET'])
def download_csv():
    try:
        # Get data from Firebase
        ref = db.reference("/sensor_data")
        data = ref.get()

        if not data:
            return "No data available", 404

        # Create an in-memory CSV
        output = io.StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow(["timestamp", "temperature", "humidity", "soil_moisture"])

        # Write each entry
        for timestamp, entry in sorted(data.items()):
            writer.writerow([
                timestamp,
                entry.get("temperature", ""),
                entry.get("humidity", ""),
                entry.get("soil_moisture", "")
            ])

        # Return the CSV as a downloadable file
        output.seek(0)

        
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment;filename=sensor_data.csv"}
        )

    except Exception as e:
        print("Error exporting CSV:", str(e))
        return jsonify({"error": str(e)}), 500
@app.route('/clear', methods=['POST'])
def clear_firebase_data():
    try:
        ref = db.reference("/sensor_data")
        ref.delete()  # Deletes the entire node and its children

        print("✅ Firebase data cleared.")
        return jsonify({"status": "cleared"}), 200

    except Exception as e:
        print("❌ Error clearing Firebase:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/latest', methods=['GET'])
def get_latest_entry():
    ref = db.reference("/sensor_data")
    all_data = ref.get()

    if not all_data:
        return {"error": "No data found"}, 404

    # Sort by timestamp
    sorted_items = sorted(all_data.items(), key=lambda x: x[1].get('timestamp', ''))
    latest = sorted_items[-1][1]

    return jsonify(latest)

@app.route('/highs_lows', methods=['GET'])
def get_highs_lows():
    target_date = request.args.get('date')
    target_date = datetime.strptime(target_date, "%Y-%m-%d").date()
    print(target_date)
    if not target_date:
        return jsonify({"error": "No date provided"}), 400

    ref = db.reference("/sensor_data")
    all_data = ref.get()

    if not all_data:
        return jsonify({"error": "No data found"}), 404

    today_data = []

    for entry in all_data.values():
        timestamp = entry.get('timestamp')
        
        if not timestamp:
            continue
        try:
            entry_time = datetime.fromisoformat(timestamp)
            if entry_time.date() == target_date:
                today_data.append(entry)
        except Exception:
            continue

    
    if not today_data:
        return jsonify({"error": "No data for that date"}), 404

    highs_lows = {
        "high_temp": max(d["temperature"] for d in today_data),
        "low_temp": min(d["temperature"] for d in today_data),
        "high_humidity": max(d["humidity"] for d in today_data),
        "low_humidity": min(d["humidity"] for d in today_data),
        "high_soil": max(d["soil_moisture"] for d in today_data),
        "low_soil": min(d["soil_moisture"] for d in today_data),
    }
    print(highs_lows)
    return jsonify(highs_lows)

@app.route('/weekly_highs_lows')
def get_weekly_highs_lows():
    start_date = request.args.get('start')
    end_date = request.args.get('end')

    if not start_date or not end_date:
        return jsonify({"error": "Missing date range"}), 400

    start = datetime.strptime(start_date, "%Y-%m-%d").date()
    end = datetime.strptime(end_date, "%Y-%m-%d").date()

    ref = db.reference("/sensor_data")
    all_data = ref.get()

    if not all_data:
        return jsonify({"error": "No data found"}), 404

    week_data = []
    for entry in all_data.values():
        timestamp = entry.get("timestamp")
        if not timestamp:
            continue
        try:
            entry_time = datetime.fromisoformat(timestamp)
            if start <= entry_time.date() <= end:
                week_data.append(entry)
        except:
            continue

    # compute min/max
    def min_max(key):
        vals = [float(entry[key]) for entry in week_data if key in entry]
        return max(vals), min(vals) if vals else ("--", "--")

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

@app.route('/graph-data')
def get_graph_data():
    try:
        ref = db.reference("/sensor_data")
        data = ref.get()

        if not data:
            return jsonify([])

        # Convert data into sorted list by timestamp
        results = []
        for timestamp, entry in sorted(data.items()):
            results.append({
                "timestamp": timestamp,
                "temperature": entry.get("temperature"),
                "humidity": entry.get("humidity"),
                "soil_moisture": entry.get("soil_moisture")
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/graph')
def show_graph():
    return render_template("graph.html")

@app.route('/')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')




def home():
    return "running"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)


print("\ngoodByeWorld")


