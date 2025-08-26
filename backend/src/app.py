from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import os
import hashlib
import secrets
import json
from flask_cors import CORS, cross_origin

load_dotenv()
app = Flask(__name__)
socketio = SocketIO(app)

location = os.getenv('uripath')
print(location)

#configure sqlite database
app.config['SQLALCHEMY_DATABASE_URI'] = (f'sqlite:///{location}')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#configure web server
# with socketio.SimpleClient() as sio:
#     sio.connect('http://localhost:8000')

#     sio.emit('message', {'foo':'jar'})

#     event = sio.receive()
#     print(f'received event: "{event[0]}" with arguments {event[1:]}')

#     sio.disconnect()


#create db instance
db = SQLAlchemy(app)



#configure cors
cors = CORS(app)

#classes
class users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    uqs = db.Column(db.Text, nullable=False)

class rooms(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))


@app.route('/')
@cross_origin()
def check():
    jsonFile = json.dumps({'success': True, 'message': 'done'})
    return jsonFile

#registering the user into db
@app.route('/register', methods=['GET','POST'])
@cross_origin()
def registerDetails():
    information = request.get_json()
    username = information['username']
    password = information['password']

    if username != '' and password != '':
        salt = secrets.token_hex(8)
        encoding = hashlib.new('sha256')
        hexPass = password + salt
        encoding.update(hexPass.encode())

        userDetails = users()
        userDetails.username = username
        userDetails.password = encoding.hexdigest()
        userDetails.uqs = salt

        db.session.add(userDetails)
        db.session.commit()
        return 'done'
    else:
        return 'failed'
    

#logining in the user
@app.route('/login', methods=['GET','POST'])
@cross_origin()
def loginDetails():
    information = request.get_json()
    username = information['username']
    password = information['password']

    if username != '' and password != '':
        checkUser = db.session.query(users).filter_by(username=username).first()
        if(checkUser == None):
            jsonFile = json.dumps({'success': False, 'error': 'Your account doesnt exist in the database, please register'})
            return jsonFile
        else:
            usersPass = checkUser.password
            usersUqs = checkUser.uqs

            encoding = hashlib.new('sha256')
            hexPass = password + usersUqs
            encoding.update(hexPass.encode())

            hexFullPass = encoding.hexdigest()

            if hexFullPass == usersPass:
                jsonFile = json.dumps({'success': True, 'user': {'id': checkUser.id, 'username': checkUser.username}})
                return jsonFile
            else:
                jsonFile = json.dumps({'success': False, 'error': f'Your password is incorrect, {password}, please re-enter your password'})
            return jsonFile
    else:
        jsonFile = json.dumps({'success': False, 'error': 'You didnt enter any account information'})
        return jsonFile

#creating a room
@app.route('/createRoom', methods=['GET', 'POST'])
@cross_origin()
def createRoom():
    information = request.get_json()
    username = information['username']
    password = information['password']
    room = information['room']

    if username != '' and password != '':
        checkUser = db.session.query(users).filter_by(username=username).first()
        if(checkUser == None):
            jsonFile = json.dumps({'success': False, 'error': 'Your account doesnt exist inside of the database, please register'})
            return jsonFile
        elif(len(room) > 50):
            jsonFile = json.dumps({'success':False, 'error': 'Room length is longer than 50 characters'})
            return jsonFile
        else:
            usersPass = checkUser.password
            usersUqs = checkUser.uqs

            encoding = hashlib.new('sha256')
            hexPass = password + usersUqs
            encoding.update(hexPass.encode())

            hexFullPass = encoding.hexdigest()

            if hexFullPass == usersPass:
                roomsDetails = rooms()
                roomsDetails.name = room

                db.session.add(roomsDetails)
                db.session.commit()

                jsonFile = json.dumps({'success': True, 'message': 'room has been successfully added'})
                return jsonFile
            else:
                jsonFile = json.dumps({'success': False, 'error': f'Your password is incorrect, {password}, please re-enter your password'})
                return jsonFile

@app.route('/resetPassword', methods=['GET', 'POST'])
@cross_origin()
def resetPassword():
    information = request.get_json()
    username = information['username']
    firstPass = information['pass1']
    secondPass = information['pass2']
    if(firstPass == secondPass):

        salt = secrets.token_hex(8)
        encoding = hashlib.new('sha256')
        hexPass = firstPass + salt
        encoding.update(hexPass.encode())
        newPass = encoding.hexdigest()

        user = db.session.query(users).filter_by(username=username).update({'password': newPass})
        # db.session.add(user)
        db.session.commit()

        jsonFile = json.dumps({'success': True, 'message':'your password has changed'})
        return jsonFile
    else:
        jsonFile = json.dumps({'success': False, 'message': 'password doesnt match'})
        return jsonFile



if __name__ == '__main__':
    socketio.run(app, debug=True)