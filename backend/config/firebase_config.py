import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("smartagsensordata-firebase-adminsdk.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://smartagsensordata-default-rtdb.firebaseio.com/"
})
print("Connected to DB")
def get_db():
    return db