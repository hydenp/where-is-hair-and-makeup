FROM python:3.9-slim-bullseye

RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

RUN mkdir /app
WORKDIR /app
ADD ./requirements.txt /app
RUN pip3 install -r requirements.txt
ADD *.py  /app

EXPOSE 5000

ENTRYPOINT ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app"]
