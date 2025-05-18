from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)

app.secret_key = "this_is_a_secret"

ALLOWED_EXTENSIONS = {'md'}

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/open", methods=["POST", "GET"])
def openFile():
    if request.method == "POST":
        file = request.files["theFile"]
        extension = file.filename.rsplit('.', 1)[1]
        if extension not in ALLOWED_EXTENSIONS:
            # TODO: This flash should show on the dashboard page somehow
            # flash(f"{extension} is not allowed!")
            return redirect(url_for('dashboard'))
        contents = file.read().decode("utf-8")
        fileName = file.filename
        session["fileName"] = fileName
        session["fileContents"] = contents
    return redirect(url_for('editor'))

@app.route("/editor")
def editor():
    filename = session.get("fileName")
    content = session.get("fileContents")
    return render_template("editor.html", filename=filename, content=content)

@app.route("/save")
def saveFile():
    session.pop("fileName", None)
    session.pop("fileContents", None)
    return redirect(url_for('dashboard'))

@app.route("/reset", methods=["POST", "GET"])
def resetEditor():
    if request.method == "POST":
        session.pop("fileName", None)
        session.pop("fileContents", None)
    return redirect(url_for('editor'))

#! TO-DO'S
# Saving an editted or created file
# Track and display previously opened files
# Make sure you can only open .md files and nothing else on browser side and flask side and prevent a redirect to the editor if the user tries to open anything other than a .md file
# Get the filename to display on editor page