import firebase_admin
from firebase_admin import credentials, db
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent  # folder containing this file
PROJECT_ROOT = BASE_DIR.parent              # backend/ -> project root

cred_path = PROJECT_ROOT / "../smartagsensordata-firebase-adminsdk.json"
cred = credentials.Certificate(cred_path)


#cred = credentials.Certificate("smartagsensordata-firebase-adminsdk.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smartagsensordata-default-rtdb.firebaseio.com/"
})
print("Connected to DB")
def get_db():
    return db