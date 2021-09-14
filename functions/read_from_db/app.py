import os
import json
import uuid

import boto3


db = boto3.resource("dynamodb")
table_name = os.environ["MESSAGES_TABLE_NAME"]
messages_table = db.Table(table_name)

sqs = boto3.resource("sqs")
queue_name = os.environ["MESSAGES_QUEUE_NAME"]
messages_queue = sqs.get_queue_by_name(QueueName=queue_name)


def lambda_handler(event, context):
    resp = messages_table.scan()

    for msg in resp["Items"]:
        print(f"{msg['id']=}, {msg['message']=}")
        sqs_resp = messages_queue.send_message(MessageBody=(msg["message"]))
        print(f"{sqs_resp=}")

    return {"statusCode": 200, "body": json.dumps({"status": "OK", "n_items": len(resp["Items"])})}
