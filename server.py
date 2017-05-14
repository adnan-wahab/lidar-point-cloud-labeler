from flask import Flask, request, send_from_directory, render_template, json


json_file = './data/label.json'

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

@app.route('/data/label.json', methods = ['GET', 'POST'])
def handle_data():
    if request.method == 'GET':
         with open(json_file, 'r') as f:
             data = f.read()
             return data
    if request.method == 'POST':
        with open(json_file, 'w') as f:
            d = request.get_json(force=True)
            print(d)
            json.dump(d, f)
            return 'yay it worked'

if __name__ == "__main__":
     app.run(port = 4000)
