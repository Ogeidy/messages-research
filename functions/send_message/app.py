import json
import uuid

import boto3


def lambda_handler(event, context):
    dynamodb = boto3.resource("dynamodb")
    messages = dynamodb.Table("messages")

    if event.get("body", False):
        message_id = str(uuid.uuid4())
        if isinstance(event["body"], dict):
            body = event["body"]
        else:
            body = json.loads(event["body"].replace("'", '"'))
        print(f"{event['body']=}, {message_id=}, {body=} *")
        messages.put_item(Item={"message_id": message_id, "message": body["message"]})

    return {"statusCode": 200, "body": json.dumps("OK")}
