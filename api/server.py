import json
import flask
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)


def read_file():
    with open("events.json", "r") as f:
        data = json.load(f)
    return data


def write_file(data):
    with open("events.json", "w") as f:
        json.dump(data, f, indent=4)


@app.route("/", methods=["GET"])
def home():
    return "Events API"


@app.route("/healthz", methods=["GET"])
def healthz():
    return "OK"


@app.route("/events", methods=["GET"])
def api_all():
    return read_file()


@app.route("/events", methods=["POST"])
def api_add():
    data = read_file()
    new = flask.request.json
    # check contractAddress and name are present
    if "contractAddress" not in new:
        return "Missing contractAddress", 400

    if "name" not in new:
        return "Missing name", 400

    if "imageUrl" not in new:
        return "Missing imageUrl", 400

    if "description" not in new:
        return "Missing description", 400

    if "location" not in new:
        return "Missing location", 400

    if "date" not in new:
        return "Missing date", 400

    data["events"].append(new)
    write_file(data)
    return flask.request.json


app.run(host="0.0.0.0", port=8080)
