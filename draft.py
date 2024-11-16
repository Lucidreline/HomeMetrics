import Adafruit_DHT as dht
from time import sleep
#Set DATA pin
DHT = 22

def celToFer(c):
    return (c * (9/5)) + 32

while True:
    #Read Temp and Hum from DHT22
    humidity,temperature = dht.read_retry(dht.DHT22, DHT)
    temperature = celToFer(temperature)
    #Print Temperature and Humidity on Shell window
    print('Temp={0:0.1f}F  Humidity={1:0.1f}%'.format(temperature,humidity))
    sleep(5) #Wait 5 seconds and read again


