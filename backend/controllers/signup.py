from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db
import bcrypt
import re

db = get_db()

def signup():
    data = request.get_json(force=True)

    # Validate required fields
    required_fields = ["email", "password", "username"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    email = data["email"].strip().lower()
    username = data["username"].strip()
    password = data["password"]
    role = data.get("role", "worker")  # Default role is worker

    # Validate email format
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return jsonify({"error": "Invalid email format"}), 400

    # Validate password strength
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # Validate username
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters"}), 400

    # Validate role
    valid_roles = ["admin", "worker", "viewer"]
    if role not in valid_roles:
        return jsonify({"error": f"Invalid role. Must be one of: {', '.join(valid_roles)}"}), 400

    # Check if email already exists
    users_ref = db.reference("/users")
    existing_users = users_ref.order_by_child("email").equal_to(email).get()
    if existing_users:
        return jsonify({"error": "Email already registered"}), 409

    # Check if username already exists
    existing_username = users_ref.order_by_child("username").equal_to(username).get()
    if existing_username:
        return jsonify({"error": "Username already taken"}), 409

    # Hash the password
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    # Create user object
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    user_data = {
        "email": email,
        "username": username,
        "password_hash": password_hash,
        "role": role,
        "created_at": timestamp,
        "updated_at": timestamp
    }

    # Save to Firebase
    new_user_ref = users_ref.push(user_data)
    user_id = new_user_ref.key

    # Return success (without password hash)
    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": user_id,
            "email": email,
            "username": username,
            "role": role,
            "created_at": timestamp
        }
    }), 201
