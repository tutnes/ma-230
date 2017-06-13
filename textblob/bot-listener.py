from flask import Flask, jsonify, request



app = Flask(__name__)
from textblob import TextBlob

users = {}

import http.client
def findMovieTitle(input):
    conn = http.client.HTTPConnection("localhost:3000")

    #payload = "{\"text\":\"Gone with the wind\"}"
    payload = "{\"text\":\"" + input + "\"}"
    #payload = {"text": "Gone with the wind"}

    headers = {
        'accept': "application/json",
        'content-type': "application/json",
        'cache-control': "no-cache",
        'postman-token': "b636b64b-2644-7895-b924-0cd4150ae6b9"
        }

    conn.request("POST", "/", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))

#    r = requests.post('http://localhost:3000/', data = jsonify({'text':input}))
#    print(r.content())
    


@app.route('/api/', methods=['POST'])
def api_post():
    text = request.json['text']
    username = request.json['user_name']

    testimonial = TextBlob(text)
    sent = testimonial.sentiment.polarity
    print (testimonial.noun_phrases)
    if (len(testimonial.noun_phrases) > 0):
        noun = testimonial.noun_phrases[0]
    else:
        noun = "Did not find movie"
    
    
    findMovieTitle(noun)
    if (username in users):
        users[username][noun] = sent
    else:
        users[username] = {noun: sent}
    print (users) #Debug
    #return "OK"
    return jsonify(text = username + " has a sentiment value " + str(sent) + " for " + noun)


@app.route('/api/', methods=['GET'])
def api_get():
    return jsonify(users)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8080)









