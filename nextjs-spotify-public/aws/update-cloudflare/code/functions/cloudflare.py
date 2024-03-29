import requests
import os
import json

base_url = 'https://api.cloudflare.com/client/v4'
fqdn = os.environ['fqdn']

def verify():
    url = base_url + '/user/tokens/verify'

    headers = {
        'Authorization': 'Bearer ' + os.environ['api'],
        'Content-Type': 'application/json'
    }

    response = requests.get(url, headers=headers)

    return response.status_code

def list_dns_records():
    url = base_url + '/zones/' + os.environ['zone_identifier'] + "/dns_records/"

    headers = {
        'Authorization': 'Bearer ' + os.environ['api'],
        'Content-Type': 'application/json',
    }

    response = requests.get(url, headers=headers)

    content = json.loads(response.content)

    return content['result']

def search_dns_records(fqdn):
    url = base_url + '/zones/' + os.environ['zone_identifier'] + "/dns_records?name=" + fqdn

    headers = {
        'Authorization': 'Bearer ' + os.environ['api'],
        'Content-Type': 'application/json',
    }

    response = requests.get(url, headers=headers)

    content = json.loads(response.content)

    return content['result'][0]

def update_dns_record(ip_address):
    record_id = search_dns_records(fqdn)['id']
    url = base_url + '/zones/' + os.environ['zone_identifier'] + "/dns_records/" + record_id

    json_data = {
        "type": "A",
        "name" : fqdn,
        "content" : ip_address,
        "proxied": True
    }

    headers = {
        'Authorization': 'Bearer ' + os.environ['api'],
        'Content-Type': 'application/json',
    }

    response = requests.put(url, headers=headers, json=json_data)

    print(response)