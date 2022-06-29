#!/usr/bin/python3
""" Starts a Flash Web Application """
import datetime
import pymongo
import json
from flask import Flask, render_template, request, url_for

app = Flask(__name__)

usrIn = []
variable = {}


@app.route('/fn/<param>', methods=["GET", "POST"])
def fn(param):
    if param == 'var':
        return (str(variable))

@app.route('/rate', methods=["GET", "POST"])
def rate():
    if request.method == "POST":
        dbcnx = pymongo.MongoClient('mongodb://localhost:27017')
        db = dbcnx['louagi']
        collection = db.get_collection("rate")
        collection.insert_one({"email": str(request.cookies.get("email")), "carId": str(
            request.form['carId']), "rate": str(request.form['rate'])})
        return "good"


@app.route('/buy', methods=["GET", "POST"])
def buy():
    if request.method == "POST":
        dbcnx = pymongo.MongoClient('mongodb://localhost:27017')
        db = dbcnx['louagi']
        collection = db.get_collection("ticket")
        tikt = collection.insert_one(
            {
                "date": str(
                    request.form['dt']), "journeyId": str(
                    request.form['id']), "ClientEmail": str(
                    request.cookies.get("email")), "Place": str(
                        request.form['pl'])})
        return (str(tikt.inserted_id))


@app.route('/')
def index():
    dbcnx = pymongo.MongoClient('mongodb://localhost:27017')
    db = dbcnx['louagi']
    collection = db.get_collection("journey")
    dt = datetime.datetime.now()
    dt = "{}/{}/{}".format(("%02d" % dt.day), ("%02d" % dt.month), dt.year)
    journey = list(collection.find({'date': dt}))
    station = list(db.get_collection("station").find())
    ticket = list(db.get_collection("ticket").find())
    variable['journey'] = journey
    variable['station'] = station
    variable['ticket'] = ticket
    if request.cookies.get('email'):
        return render_template("dash.html")
    else:
        return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        dbcnx = pymongo.MongoClient('mongodb://localhost:27017')
        db = dbcnx['louagi']
        collection = db.get_collection("User")
        usrIn = list(collection.find({"email": str(
            request.form['email']), "password": str(request.form['password'])}))
        if len(usrIn) == 1:
            return ("good")
        else:
            return ("error")


@app.route('/dash', methods=['GET', 'POST'])
def dashboard():
    if request.method == 'POST':
        return render_template('dash.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        dbcnx = pymongo.MongoClient("mongodb://localhost:27017")
        db = dbcnx['louagi']
        collection = db.get_collection("User")
        usr = list(collection.find({"email": str(request.form['email'])}))
        if len(usr) == 0:
            collection.insert_one(
                {
                    'email': str(
                        request.form['email']), "password": str(
                        request.form['password']), "type": str(
                        request.form['type']), "info": str(
                        request.form['info'])})
        else:
            return ("error")
        return ("good")

@app.route('/type', methods=['GET', 'POST'])
def typee():
    if request.method == 'POST':
        cnx = pymongo.MongoClient('mongodb://localhost:27017')
        db = cnx['louagi']
        mycol = db.get_collection('User')
        u = list(mycol.find({'email':str(request.cookies.get('email'))}))
        u = str(u[0])
        u = u[u.index("type") + 8:]
        u = u[0:u.index("'")]
        return str(u)


@app.route('/update', methods=['GET', 'POST'])
def update():
    if request.method == 'POST':
       cnx = pymongo.MongoClient('mongodb://localhost:27017')
       db = cnx['louagi']
       mycol = db.get_collection('User')
       usr = list(mycol.find({"email":str(request.cookies.get('email')), "password":str(request.form['oldpass'])}))
       if len(usr) == 0:
          return "error"
       else:
          mycol.update_one({'email': str(request.cookies.get('email'))}, {'$set': {'password': str(request.form['newpass'])}})
          return "good"

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
       cnx = pymongo.MongoClient('mongodb://localhost:27017')
       db = cnx['louagi']
       mycol = db.get_collection('journey')
       journey = mycol.insert_one({"date": str(request.form['dt']),"Begining": str(request.form['begin']), "Destination": str(request.form['dest']), "Price": str(request.form['price']), "CarId": str(request.form['carId'])})
       id = str(journey.inserted_id)
       mycol = db.get_collection("station")
       mycol.insert_one({"journeyId": id, "Begining": str(request.form['stat']), "Destination":str(request.form['dest-stat'])})
       return "good"

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'GET':
        return "<script>document.cookie = 'email=';window.open('/','_self');</script>"
