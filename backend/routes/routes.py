from flask import Blueprint, render_template

from controllers.receive_data import receive_data
from controllers.get_data import get_data
from controllers.clear_data import clear_data
from controllers.get_latest import get_latest

from controllers.download_csv import download_csv
from controllers.get_highs_lows import get_highs_lows
from controllers.get_weekly_highs_lows import get_weekly_highs_lows
from controllers.get_graph_data import get_graph_data

from controllers.farm_hierarchy import (
    add_farm,
    add_field,
    add_bed,
    add_sensor_node
)


routes = Blueprint("routes", __name__)

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