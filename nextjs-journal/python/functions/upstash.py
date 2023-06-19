from dotenv import load_dotenv
import redis
import os
import json

load_dotenv()

local = os.getenv("LOCAL")

if local:
    print('Using Local Redis')
    client = redis.Redis(
        host=os.getenv("LOCAL_SERVER"),
        port=os.getenv("LOCAL_PORT"),
        decode_responses=True,
    )

if not local:
    print('Using Upstash Redis')
    client = redis.Redis(
        host=os.getenv("UPSTASH_SERVER"),
        port=os.getenv("UPSTASH_PORT"),
        password=os.getenv("UPSTASH_PASSWORD"),
        ssl=True,
        decode_responses=True,
    )


def upload_to_upstash(list_content_all_paths):
    for path in list_content_all_paths:
        user = os.getenv("USER")
        title = path["title"]
        json_path = json.dumps(path)
        client.hset(user, key=title, value=json_path, mapping=None, items=None)
        print(title)


def get_from_upstash(user):
    list_of_results = []
    results = client.hgetall(user)
    for key in results:
        value = results[key]
        list_of_results.append(json.loads(value))
    return list_of_results


def get_upstash_field(user, field):
    results = client.hget(user, field)
    return json.loads(results)
