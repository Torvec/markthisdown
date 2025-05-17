from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/editor")
def editor():
    return render_template("editor.html")
