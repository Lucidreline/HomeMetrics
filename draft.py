import Adafruit_DHT as dht
import datetime
import requests
import pytz
import env

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
    if (env.pinNumber == 11):
        humidity,temperature = dht.read_retry(dht.DHT11, env.pinNumber)
    elif (env.pinNumber == 22):
        humidity,temperature = dht.read_retry(dht.DHT22, env.pinNumber)
except:
    print("oopsie")
    

body = {"id": getFormattedTimestamp(),
        "temperature": celToFer(temperature),
        "humidity": humidity,
        "piId": env.piId
        }

makePostRequest(body)
print(getFormattedTimestamp(), 'Temp={0:0.1f}F  Humidity={1:0.1f}%'.format(temperature,humidity))