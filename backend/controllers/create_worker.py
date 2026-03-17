from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db
import bcrypt

db = get_db()

def create_worker():
    data = request.get_json(force=True)

    required = ["admin_id", "username", "email", "temp_password"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    admin_id = data["admin_id"]
    username = data["username"].strip()
    email = data["email"].strip().lower()
    temp_password = data["temp_password"]

    # Verify the admin exists and has the admin role
    users_ref = db.reference("/users")
    admin = users_ref.child(admin_id).get()
    if not admin or admin.get("role") != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters"}), 400
    if len(temp_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # Check username is not already taken
    all_users = users_ref.get() or {}
    for user in all_users.values():
        if user.get("username") == username:
            return jsonify({"error": "Username already taken"}), 409
        if user.get("email") == email:
            return jsonify({"error": "Email already registered"}), 409

    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(temp_password.encode("utf-8"), salt).decode("utf-8")

    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    worker_data = {
        "email": email,
        "username": username,
        "password_hash": password_hash,
        "role": "worker",
        "created_by": admin_id,
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    new_ref = users_ref.push(worker_data)

    return jsonify({
        "message": "Worker created successfully",
        "worker": {
            "id": new_ref.key,
            "username": username,
            "email": email,
            "temp_password": temp_password,
            "created_at": timestamp,
        }
    }), 201
