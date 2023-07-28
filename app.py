from flask import Flask, jsonify,render_template
import psycopg2 as pg2
from config import database,user,password,port

app = Flask(__name__)

# Create a connection with PostgreSQL
conn = pg2.connect(database=database, user=user, password=password, port=port)
@app.route("/")
def home():
    #"""List all available api routes."""
    return render_template("index.html")

    #return (
        #f"Available Routes:<br/>"
       # f"/api/restaurants"
    #)

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    # Establish connection and start cursor to be ready to query
    cur = conn.cursor()

    # Pass in a PostgreSQL query as a string
    cur.execute('SELECT * FROM restaurants_sanantonio')

    # Get the column names (keys)
    keys = [desc[0] for desc in cur.description]

    # Fetch all the data
    data = cur.fetchall()

    # Close the cursor
    cur.close()

    # Create a list of dictionaries (key-value pairs) for each row
    result = []
    for row in data:
        row_dict = dict(zip(keys, row))
        result.append(row_dict)

    # Return the data as JSON response
    return jsonify(result)

if __name__ == '__main__':
    app.run()
