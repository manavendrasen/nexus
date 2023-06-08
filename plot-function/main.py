import json
import requests


def main(req, res):
    survey_responses = None
    try:
        payload = json.loads(req.payload)
        survey_responses = payload['responses']
    except Exception as err:
        print(err)
        raise Exception('Payload is invalid.')

    if not survey_responses:
        raise Exception('Invalid.')

    return res.json({
        'message': 'Success',
        'data': survey_responses
		})