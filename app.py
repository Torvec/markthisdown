from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "this-is-super-secret-no-sharing"

@app.route("/", methods=["POST", "GET"])
def home():
    err = None
    if request.method == "POST":
        if valid_markdown(request.form["post"]):
            session["post"] = request.form["post"]
            session["post2"] = request.form["post2"]
            return redirect(url_for('saved'))
        else:
            err = "Invalid Markdown"
            session["error"] = err
            return redirect(url_for('error'))
    return render_template("index.html", error=err)

def valid_markdown(post):
    return len(post) > 0

@app.route("/saved")
def saved():
    # post = session.get("post")
    post = session.pop("post", None)
    post2 = session.pop("post2", None)
    return render_template("saved.html", post=post, post2=post2)

@app.route("/error")
def error():
    # error = session.get("error")
    error = session.pop("error", None)
    return render_template("error.html", error=error)