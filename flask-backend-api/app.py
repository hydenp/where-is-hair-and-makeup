import json
import os
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
DB_CONN_STRING = os.getenv("db_conn_string").strip('\n')
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONN_STRING
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/testing'


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


@app.route('/api')
def read():
    return jsonify({
        'status': 'success',
        'locations': query_all()
    })


@app.route('/api', methods=['POST'])
def create():
    request_params = json.loads(request.data)
    try:
        obj = Whereabouts(**request_params)
    except marshmallow.exceptions.ValidationError as e:
        return jsonify({
            'status': 'failure',
            'reason': 'request validation failure',
            'error': str(e),
        }), 500

    db.session.add(
        obj
    )

    try:
        db.session.commit()
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({
            'status': 'failure',
            'reason': 'primary_key_already_exists',
            'error': str(e),
        }), 500
    except sqlalchemy.exc.OperationalError as e:
        return jsonify({
            'status': 'failure',
            'reason': 'invalid_date_format',
            'error': str(e),
        }), 500
    else:
        return jsonify({
            'status': 'success',
            'locations': query_all()
        }), 200


@app.route('/api/<day_id>', methods=['PATCH'])
def update(day_id):
    request_params = request.get_json()
    record = Whereabouts.query.filter_by(day=day_id).first()
    record.location = request_params['location']
    try:
        db.session.commit()
    except BaseException as e:
        return jsonify({
            'error': str(e),
            'status': 'failure'
        }), 500
    else:
        return jsonify({
            'status': 'success',
            'body': query_all()
        }), 200


@app.route('/api/<day_id>', methods=['DELETE'])
def delete(day_id):
    try:
        Whereabouts.query.filter_by(day=day_id).delete()
        db.session.commit()
    except BaseException as e:
        return jsonify({
            'status': 'failure',
            'reason': str(e)
        }), 500
    else:
        return jsonify({
            'status': 'success',
            'body': query_all()
        }), 200


if __name__ == '__main__':
    app.run(debug=True)
