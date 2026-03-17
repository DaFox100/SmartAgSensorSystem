from flask import request, jsonify
from config.firebase_config import get_db
import bcrypt

db = get_db()

def login():
    data = request.get_json(force=True)

    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    username = data["username"].strip()
    password = data["password"]

    # Fetch all users and find by username (avoids needing an index)
    users_ref = db.reference("/users")
    all_users = users_ref.get()

    if not all_users:
        return jsonify({"error": "Invalid username or password"}), 401

    matched_id = None
    matched_user = None
    for uid, user in all_users.items():
        if user.get("username") == username:
            matched_id = uid
            matched_user = user
            break

    if not matched_user:
        return jsonify({"error": "Invalid username or password"}), 401

    password_hash = matched_user.get("password_hash", "")
    if not bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8")):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": matched_id,
            "username": matched_user["username"],
            "email": matched_user["email"],
            "role": matched_user["role"],
        }
    }), 200
