# backend/controllers/farm_hierarchy.py

from flask import request, jsonify
from firebase_admin import db
from datetime import datetime, timezone

def now_iso():
    return datetime.now(timezone.utc).isoformat()

# ========= FARM =========
def add_farm():
    data = request.get_json() or {}
    farm_id = data.get("farmId")
    name = data.get("name")

    if not farm_id or not name:
        return jsonify({"error": "farmId and name are required"}), 400

    farm_ref = db.reference(f"farms/{farm_id}")
    if farm_ref.get() is not None:
        return jsonify({"error": f"Farm {farm_id} already exists"}), 409

    farm_ref.set({
        "farmId": farm_id,
        "name": name,
        "location": data.get("location"),
        "notes": data.get("notes"),
        "createdAt": now_iso()
    })

    return jsonify({"message": "Farm created", "farmId": farm_id}), 201


# ========= FIELD =========
def add_field(farm_id):
    data = request.get_json() or {}
    field_id = data.get("fieldId")
    name = data.get("name")

    if not field_id or not name:
        return jsonify({"error": "fieldId and name are required"}), 400

    farm_ref = db.reference(f"farms/{farm_id}")
    if farm_ref.get() is None:
        return jsonify({"error": f"Farm {farm_id} not found"}), 404

    field_ref = farm_ref.child(f"fields/{field_id}")
    if field_ref.get() is not None:
        return jsonify({"error": f"Field {field_id} already exists"}), 409

    field_ref.set({
        "fieldId": field_id,
        "name": name,
        "cropType": data.get("cropType"),
        "notes": data.get("notes"),
        "createdAt": now_iso()
    })

    return jsonify({"message": "Field created", "fieldId": field_id}), 201


# ========= BED =========
def add_bed(farm_id, field_id):
    data = request.get_json() or {}
    bed_id = data.get("bedId")
    name = data.get("name")

    if not bed_id or not name:
        return jsonify({"error": "bedId and name are required"}), 400

    field_ref = db.reference(f"farms/{farm_id}/fields/{field_id}")
    if field_ref.get() is None:
        return jsonify({"error": f"Field {field_id} not found in farm {farm_id}"}), 404

    bed_ref = field_ref.child(f"beds/{bed_id}")
    if bed_ref.get() is not None:
        return jsonify({"error": f"Bed {bed_id} already exists"}), 409

    bed_ref.set({
        "bedId": bed_id,
        "name": name,
        "row": data.get("row"),
        "notes": data.get("notes"),
        "createdAt": now_iso()
    })

    return jsonify({"message": "Bed created", "bedId": bed_id}), 201


# ========= SENSOR NODE =========
def add_sensor_node(farm_id, field_id, bed_id):
    data = request.get_json() or {}
    node_id = data.get("sensorNodeId")
    label = data.get("label")

    if not node_id or not label:
        return jsonify({"error": "sensorNodeId and label are required"}), 400

    bed_ref = db.reference(
        f"farms/{farm_id}/fields/{field_id}/beds/{bed_id}"
    )
    if bed_ref.get() is None:
        return jsonify({"error": f"Bed {bed_id} not found"}), 404

    node_ref = bed_ref.child(f"sensorNodes/{node_id}")
    if node_ref.get() is not None:
        return jsonify({"error": f"SensorNode {node_id} already exists"}), 409

    node_ref.set({
        "sensorNodeId": node_id,
        "label": label,
        "sensorTypes": data.get("sensorTypes", []),
        "lat": data.get("lat"),
        "lon": data.get("lon"),
        "notes": data.get("notes"),
        "createdAt": now_iso()
    })

    return jsonify({"message": "SensorNode created", "sensorNodeId": node_id}), 201
