import json
import math
import numpy as np
from sklearn.manifold import TSNE

def handler(event, context):
    # Input
    print("Start Input")
    print("Event")
    print(event)

    survey_responses = None
    try:
        payload = json.loads(event["body"])
        print("Payload")
        print(payload)
        survey_responses = payload["responses"]

        print("Survey Responses")
        print(survey_responses)
        

    except Exception as err:
        print("Error Exception")
        print(err)
        return {
            "message": "Error",
            "data": err
        }

    if not survey_responses:
        return {
            "message": "Error",
            "data": "Invalid Body"
        }

    # Process
    X = []
    Y = []
    for responses in survey_responses:
        for email, response in responses.items():
            Y.append(email) 
            X.append(response["optionResponses"])


    X_np = np.array(X)

    tsne = TSNE(2, perplexity = 2.0)
    tsne_result = tsne.fit_transform(X_np)

    response_body = []

    for index, coordinates in enumerate(tsne_result): 
        val = {
            Y[index]: {
                "textResponses": survey_responses[index][Y[index]]["textResponses"],
                "optionResponses": survey_responses[index][Y[index]]["optionResponses"],
                "coordinates": [math.ceil(coordinates[0]), math.ceil(coordinates[1])]
            }
        }
        response_body.append(val)

    print(response_body)
    
    # Output
    return {
        "message": "Success",
        "data": json.dumps(response_body)
    }
