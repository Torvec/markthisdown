from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)

app.secret_key = "this_is_a_secret"

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/open", methods=["POST", "GET"])
def openFile():
    if request.method == "POST":
        file = request.files["theFile"]
        contents = file.read().decode("utf-8")
        session["fileContents"] = contents
    return redirect(url_for('editor'))

@app.route("/editor")
def editor():
    content = session.get("fileContents")
    return render_template("editor.html", content=content)

@app.route("/save")
def saveFile():
    pass

@app.route("/reset", methods=["POST", "GET"])
def resetEditor():
    if request.method == "POST":
        session.pop("fileContents", None)
    return redirect(url_for('editor'))