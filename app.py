from flask import Flask, render_template, request, redirect, url_for, session, flash
import re

app = Flask(__name__)

app.secret_key = "this_is_a_secret"

ALLOWED_EXTENSIONS = {'md'}

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/new")
def newFile():
    if len(session) > 0:
        session.clear()
    return redirect(url_for("editor"))

@app.route("/open", methods=["POST", "GET"])
def openFile():
    if request.method == "POST":
        file = request.files["theFile"]
        extension = file.filename.rsplit('.', 1)[1]
        if extension not in ALLOWED_EXTENSIONS:
            flash(f"Only .md files are supported!")
            return redirect(url_for('dashboard'))
        frontmatter = ""
        content = file.read().decode("utf-8")
        match = re.search(r"(?s)^---[\r\n]+.*?^---[\r\n]+", content, re.MULTILINE)
        if match:
            frontmatter = match.group()
            content = content[len(frontmatter):].lstrip()
        fileName = file.filename
        session["fileName"] = fileName
        session["frontmatter"] = frontmatter
        session["fileContents"] = content
    return redirect(url_for('editor'))

@app.route("/editor")
def editor():
    filename = session.get("fileName")
    frontmatter = session.get("frontmatter")
    content = session.get("fileContents")
    return render_template("editor.html", filename=filename, frontmatter=frontmatter, content=content)

@app.route("/saved")
def saveFile():
    session.pop("fileName", None)
    session.pop("frontmatter", None)
    session.pop("fileContents", None)
    return redirect(url_for('dashboard'))

@app.route("/reset", methods=["POST", "GET"])
def resetEditor():
    if request.method == "POST":
        session.pop("fileName", None)
        session.pop("frontmatter", None)
        session.pop("fileContents", None)
    return redirect(url_for('editor'))

#! TO-DO'S
# For markdown files with front matter, split it up so that only the content shows up in the editor and the front matter is split up by key-value pairs and are editable 