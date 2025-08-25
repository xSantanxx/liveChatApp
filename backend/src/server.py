from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import logging
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

#configure server
app = Flask(__name__)
socketio = SocketIO(app)

location = os.getenv('uripath')
serSecret = os.getenv('servercode')

#configure sqlite database
app.config['SQLALCHEMY_DATABASE_URI'] = (f'sqlite:///{location}')

#configure server
app.config['SECRET_KEY'] = serSecret

#create db instance
db = SQLAlchemy(app)


#classes
class rooms(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

#configure cors
cors = CORS(app)


# events
@app.route('/', methods=['GET'])
def confirm():
    return 'done'

#connection events
@socketio.on('connect')
def runConnect(auth):
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def runDisconnect(reason):
    print('Client disconnected, reason:', reason)

#sending message
@socketio.on('message')
def handleMsg(message):
    send(message)

#joining server
@socketio.on('join')
def joinSession(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has enter the room.', to=room)

#leaving server
@socketio.on('leave')
def leaveSession(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=3000)