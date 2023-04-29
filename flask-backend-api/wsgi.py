from app import app

app.config['DEBUG'] = False


if __name__ == "__main__":
    app.run(bind="0.0.0.0")
