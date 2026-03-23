from flask import Blueprint, render_template, jsonify

from controllers.receive_data import receive_data
from controllers.get_data import get_data
from controllers.clear_data import clear_data
from controllers.get_latest import get_latest

from controllers.download_csv import download_csv
from controllers.get_highs_lows import get_highs_lows
from controllers.get_weekly_highs_lows import get_weekly_highs_lows
from controllers.get_graph_data import get_graph_data

from controllers.signup import signup
from controllers.login import login
from controllers.create_worker import create_worker
from controllers.get_workers import get_workers

from controllers.farm_hierarchy import (
    add_farm,
    add_field,
    add_bed,
    add_sensor_node
)

from controllers.worker_tasks import (
    get_worker_tasks,
    update_task_status,
    add_task_comment,
    get_task_details
)

routes = Blueprint("routes", __name__)

### Debugging routes for testing from teminal 
@routes.route("/debug/view", methods=["GET"])
def debug_view():
    from config.firebase_config import get_db
    db = get_db()
    
    # Get everything from the database
    all_data = db.reference("/").get()
    
    return jsonify({
        "database_content": all_data,
        "has_farms": "farms" in all_data if all_data else False,
        "farms_structure": str(type(all_data.get("farms"))) if all_data and "farms" in all_data else "none"
    })

@routes.route("/debug/tasks", methods=["GET"])
def debug_tasks():
    from config.firebase_config import get_db
    db = get_db()
    tasks = db.reference("/tasks").get()
    return jsonify({
        "tasks": tasks,
        "type": str(type(tasks)),
        "structure": "list" if isinstance(tasks, list) else "dict" if isinstance(tasks, dict) else "other"
    })

# AUTH
routes.add_url_rule("/signup", methods=["POST"], view_func=signup)
routes.add_url_rule("/login", methods=["POST"], view_func=login)
routes.add_url_rule("/admin/create-worker", methods=["POST"], view_func=create_worker)
routes.add_url_rule("/admin/workers", methods=["GET"], view_func=get_workers)

# DATA
routes.add_url_rule("/data", methods=["POST"], view_func=receive_data)
routes.add_url_rule("/data", methods=["GET"], view_func=get_data)
routes.add_url_rule("/clear", methods=["POST"], view_func=clear_data)
routes.add_url_rule("/latest", methods=["GET"], view_func=get_latest)

# ============================
# FARM HIERARCHY ROUTES
# ============================

# Add a new Farm
routes.add_url_rule(
    "/farms",
    methods=["POST"],
    view_func=add_farm
)

# Add a Field to a Farm
routes.add_url_rule(
    "/farms/<farm_id>/fields",
    methods=["POST"],
    view_func=add_field
)

# Add a Bed to a Field
routes.add_url_rule(
    "/farms/<farm_id>/fields/<field_id>/beds",
    methods=["POST"],
    view_func=add_bed
)

# Add a SensorNode to a Bed
routes.add_url_rule(
    "/farms/<farm_id>/fields/<field_id>/beds/<bed_id>/sensorNodes",
    methods=["POST"],
    view_func=add_sensor_node
)


# CSV
routes.add_url_rule("/data.csv", methods=["GET"], view_func=download_csv)

# STATS
routes.add_url_rule("/highs_lows", methods=["GET"], view_func=get_highs_lows)
routes.add_url_rule("/weekly_highs_lows", methods=["GET"], view_func=get_weekly_highs_lows)

# GRAPH DATA
routes.add_url_rule("/graph-data", methods=["GET"], view_func=get_graph_data)

# TEMPLATE ROUTES
@routes.route("/graph")
def graph_page():
    return render_template("graph.html")

@routes.route("/dashboard")
def dashboard_page():
    return render_template("dashboard.html")

routes.add_url_rule("/worker/tasks", methods=["GET"], view_func=get_worker_tasks)
routes.add_url_rule("/worker/tasks/<task_id>", methods=["GET"], view_func=get_task_details)
routes.add_url_rule("/worker/tasks/status", methods=["PUT"], view_func=update_task_status)
routes.add_url_rule("/worker/tasks/comment", methods=["POST"], view_func=add_task_comment)