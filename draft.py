import Adafruit_DHT as dht
import datetime
import requests
import pytz
import env
import sys

def celToFer(c):
    return (c * (9/5)) + 32

def getFormattedTimestamp():
    x = datetime.datetime.now()
    tz = pytz.timezone('America/Los_Angeles')
    x = x.astimezone(tz)
    return x.strftime("%m/%d/%Y %H:%M")

def makePostRequest(body):
    requests.post(env.postURL, json = body)

try:
    if (env.sensorType == 11):
        humidity,temperature = dht.read_retry(dht.DHT11, env.pinNumber)
    elif (env.sensorType == 22):
        humidity,temperature = dht.read_retry(dht.DHT22, env.pinNumber)
except:
    print("oopsie")
        

body = {"id": '{} {}'.format(env.piId, getFormattedTimestamp()),
        "temperature": celToFer(temperature) + env.tempAdjustment,
        "humidity": humidity + env.humidAdjustment
        }

if(len(sys.argv) > 1):
    if (sys.argv[1] == "--prod"):
        makePostRequest(body)
        print("Sending to DB", body)
    elif(sys.argv[1] == "--debug"):
        print("Debug", body)
else:
      print("Enter a flag: --prod --debug")

