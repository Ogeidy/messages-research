import os
import json

import boto3


sqs = boto3.resource("sqs")
queue_name = os.environ["MESSAGES_QUEUE_NAME"]
messages_queue = sqs.get_queue_by_name(QueueName=queue_name)

def lambda_handler(event, context):
    response = messages_queue.receive_message(
        MaxNumberOfMessages=5, MessageAttributeNames=["All"], VisibilityTimeout=1, WaitTimeSeconds=0
    )

    print(f"{response=}")

    if not response.get("Messages", False):
        return {"statusCode": 200, "body": json.dumps({"messages": []})}

    messages = []
    for msg in response["Messages"]:
        receipt_handle = msg["ReceiptHandle"]
        msg_body = msg["Body"]

        print(f"{msg_body=}")

        messages_queue.delete_message(ReceiptHandle=receipt_handle)

        messages.append(msg_body)

    return {"statusCode": 200, "body": json.dumps({"messages": messages})}
