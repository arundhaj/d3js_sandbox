import requests
import json
import sys

stock_list = sys.argv[1:]
base_url = 'https://www.google.com/finance/getprices?q=%s&i=60&p=1d&f=d,c'

for stock in stock_list:
    ts_data = []

    page = requests.get(base_url % stock.upper()).text
    price_data = page.decode().split('\n')[8:-1]

    for line in price_data:
        ts, price = line.split(',')
        ts_data.append([int(ts), float(price)])

    with open('data/%s.json' % stock.upper(), 'w') as f:
        json.dump(ts_data, f)

    print('Fetched data for %s' % stock.upper())
