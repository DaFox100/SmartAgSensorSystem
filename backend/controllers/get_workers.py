from flask import request, jsonify
from config.firebase_config import get_db

db = get_db()

def get_workers():
    admin_id = request.args.get("admin_id")
    if not admin_id:
        return jsonify({"error": "Missing admin_id"}), 400

    users_ref = db.reference("/users")
    all_users = users_ref.get() or {}

    workers = [
        {
            "id": uid,
            "username": u["username"],
            "email": u["email"],
            "created_at": u.get("created_at", ""),
        }
        for uid, u in all_users.items()
        if u.get("created_by") == admin_id
    ]

    return jsonify({"workers": workers}), 200
