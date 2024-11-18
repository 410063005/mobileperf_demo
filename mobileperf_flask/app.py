from flask import Flask, jsonify
from flask_cors import cross_origin
from flask_socketio import SocketIO

app = Flask(__name__)
app.logger.setLevel("DEBUG")  # 可设置为 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'
socketio = SocketIO(app, cors_allowed_origins="*", message_queue="redis://")


@app.route("/")
@cross_origin()
def index():
    return jsonify(message="hi,I'm flask"), 200


if __name__ == "__main__":
    socketio.run(app)
