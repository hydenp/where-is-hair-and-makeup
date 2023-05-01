from app import app, db

app.config['DEBUG'] = False


if __name__ == "__main__":
    db.create_all()
    app.run(bind="0.0.0.0")
