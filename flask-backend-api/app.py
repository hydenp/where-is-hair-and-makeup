import json
from dataclasses import dataclass
from datetime import datetime

import marshmallow.exceptions
import sqlalchemy.exc
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, post_load

app = Flask(__name__)
CORS(app)

# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/testing'
db = SQLAlchemy(app)
ma = Marshmallow(app)


@dataclass
class Whereabouts(db.Model):
    location: str
    day: datetime.date

    location = db.Column(db.String(500), nullable=False)
    day = db.Column(db.Date, nullable=True, default=datetime.utcnow, primary_key=True)


class WhereaboutsSchema(Schema):
    location = fields.String(required=True)
    day = fields.Date(required=True)

    @post_load()
    def create_whereabouts(self, data):
        return Whereabouts(**data)


def query_all():
    return Whereabouts.query.order_by(Whereabouts.day.desc()).all()


@app.route('/')
def read():
    return jsonify(query_all())


@app.route('/', methods=['POST'])
def create():
    request_params = json.loads(request.data)
    try:
        obj = Whereabouts(**request_params)
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
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({
            'code': 200,
            'status': 'failure',
            'reason': 'primary_key_already_exists',
            'error': str(e),
        })
    except sqlalchemy.exc.OperationalError as e:
        return jsonify({
            'code': 200,
            'status': 'failure',
            'reason': 'invalid_date_format',
            'error': str(e),
        })
    else:
        return jsonify({
            'code': 200,
            'status': 'success',
            'body': query_all()
        })


@app.route('/<day_id>', methods=['PATCH'])
def update(day_id):
    request_params = request.get_json()
    record = Whereabouts.query.filter_by(day=day_id).first()
    record.location = request_params['location']

    try:
        db.session.commit()
    except BaseException as e:
        return jsonify({
            'code': 200,
            'error': str(e),
            'status': 'failure'
        })
    else:
        return jsonify({
            'code': 200,
            'status': 'success',
            'body': query_all()
        })


@app.route('/<day_id>', methods=['DELETE'])
def delete(day_id):
    try:
        Whereabouts.query.filter_by(day=day_id).delete()
        db.session.commit()
    except BaseException as e:
        print('failure')
        return jsonify({
            'code': 200,
            'status': 'failure',
            'reason': str(e)
        })
    else:
        return jsonify({
            'code': 200,
            'status': 'success',
            'body': query_all()
        })


if __name__ == '__main__':
    app.run(debug=True)
