"""
Run once to set Firebase Realtime Database rules with the required indexes.
Usage: python set_db_rules.py
"""
import requests
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials

BASE_DIR = Path(__file__).resolve().parent
cred_path = BASE_DIR / "../smartagsensordata-firebase-adminsdk.json"

# Load the service account to get the project info
with open(cred_path) as f:
    service_account = json.load(f)

project_id = service_account["project_id"]

# Initialize Firebase to get an access token
cred = credentials.Certificate(str(cred_path))
app = firebase_admin.initialize_app(cred)

import google.auth.transport.requests
google_cred = app.credential.get_credential()
google_cred.refresh(google.auth.transport.requests.Request())
token = google_cred.token

rules = {
    "rules": {
        ".read": True,
        ".write": True,
        "users": {
            ".indexOn": ["email", "username"]
        }
    }
}

url = f"https://smartagsensordata-default-rtdb.firebaseio.com/.settings/rules.json?auth={token}"
res = requests.put(url, json=rules)

if res.status_code == 200:
    print("Rules updated successfully!")
else:
    print(f"Failed: {res.status_code} - {res.text}")
