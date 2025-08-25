from flask import Flask
from flask_socketio import SocketIO, emit
import logging
import socketio


#configure server
sio = socketio.Server()
app = socketio.ASGIApp(sio)


# events
@sio.event
def my_event(sid, data):
    pass

@sio.event
def connect(sid, environ, auth):
    print('connect', sid)


@sio.event
def disconnect(sid, reason):
    print('disconnect', sid, reason)



if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)