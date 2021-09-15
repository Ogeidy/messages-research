import os
import json
import uuid

import boto3


db = boto3.resource("dynamodb")
table_name = os.environ["MESSAGES_TABLE_NAME"]
messages_table = db.Table(table_name)


def lambda_handler(event, context):
    if event.get("body", False):
        message_id = str(uuid.uuid4())

        if isinstance(event["body"], dict):
            body = event["body"]
        else:
            body = json.loads(event["body"].replace("'", '"'))

        print(f"{event['body']=}, {message_id=}, {body=} *")
        messages_table.put_item(Item={"id": message_id, "message": body["message"]})

    return {"statusCode": 200, "body": json.dumps({"id": message_id})}
