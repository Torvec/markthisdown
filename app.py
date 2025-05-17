from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "this-is-super-secret-no-sharing"

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

@app.route("/editor", methods = ["POST", "GET"])
def editor():
    err = None
    if request.method == "POST":
        if valid_markdown(request.form["markdownContent"]):
            session["markdownContent"] = request.form["markdownContent"]
            return redirect(url_for('saved'))
        else:
            err = "Invalid Markdown"
            session["error"] = err
            return redirect(url_for('error'))
    return render_template("editor.html", err=err)

def valid_markdown(post):
    return len(post) > 0

@app.route("/saved")
def saved():
    markdownContent = session.pop("markdownContent", None)
    return render_template("saved.html", markdownContent=markdownContent)

@app.route("/error")
def error():
    error = session.pop("error", None)
    return render_template("error.html", error=error)