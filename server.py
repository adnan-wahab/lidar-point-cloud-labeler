from flask import Flask, request, send_from_directory, render_template
import json

json_file = './data/labels.json'

app = Flask(__name__, static_url_path='')
app.config['TEMPLATES_AUTO_RELOAD']= True

@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/labeler.html")
def labeler():
    return render_template('labeler.html')

@app.route('/local_modules/<path:path>')
def send_potree(path):
    return send_from_directory('local_modules', path)

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('assets', path)

@app.route('/data/labels.json', methods = ['GET', 'POST'])
def handle_data():
    if request.method == 'GET':
         with open(json_file, 'r') as f:
             data = f.read()
             return data
    if request.method == 'POST':
        data = request.form
        print(data)
        with open(json_file, 'w') as f:
            json.dump(data, f)
            return data

if __name__ == "__main__":
     app.run(port = 4111)
