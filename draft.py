import Adafruit_DHT as dht
import sys

#Set DATA pin
pinNumber = int(sys.argv[1]) # 11 or 22
print(sys.argv[1])

def celToFer(c):
    return (c * (9/5)) + 32
print('test')

try:
    if (pinNumber == 11):
        humidity,temperature = dht.read_retry(dht.DHT22, pinNumber)
    elif (pinNumber == 22):
        humidity,temperature = dht.read_retry(dht.DHT22, pinNumber)
except:
    print("oopsie")



temperature = celToFer(temperature)
#Print Temperature and Humidity on Shell window
print('Temp={0:0.1f}F  Humidity={1:0.1f}%'.format(temperature,humidity))


