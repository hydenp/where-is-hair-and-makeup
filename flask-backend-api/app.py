import json
from datetime import datetime

from dataclasses import dataclass

import marshmallow.exceptions
import sqlalchemy.exc
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import Schema, fields, post_load

app = Flask(__name__)

# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/testing'
db = SQLAlchemy(app)
ma = Marshmallow(app)


@dataclass
class Whereabouts(db.Model):
    id: int
    location: str
    day: datetime.date

    id = db.Column(db.Integer, primary_key=True, nullable=True)
    location = db.Column(db.String(500), nullable=False)
    day = db.Column(db.Date, nullable=True, default=datetime.utcnow)


class WhereaboutsSchema(Schema):
    id = fields.Integer(required=False)
    location = fields.String(required=True)
    day = fields.Date(required=True)

    @post_load()
    def create_whereabout(self, data):
        return Whereabouts(**data)


@app.route('/')
def index():
    return jsonify(Whereabouts.query.all())


@app.route('/insert', methods=['POST'])
def insert():

    request_params = json.loads(request.data)

    try:
        obj = WhereaboutsSchema().load(request_params)
    except marshmallow.exceptions.ValidationError as e:
        return jsonify({
            'code': 200,
            'status': 'failure',
            'reason': 'request validation failure',
            'error': str(e),
        })

    db.session.add(
        obj
    )

    try:
        db.session.commit()
    except sqlalchemy.exc.OperationalError as e:
        print(str(e))
        return jsonify({
            'code': 200,
            'status': 'failure',
            'reason': 'sql error',
            'error': str(e),
        })
    else:
        return jsonify({
            'code': 200,
            'status': 'success',
        })


if __name__ == '__main__':
    app.run(debug=True)
