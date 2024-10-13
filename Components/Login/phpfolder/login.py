from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='logicom',
            user='root',
            password='',
            charset='utf8'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        return None

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get the JSON data from the request body
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    email_parts = email.split('@')
    if len(email_parts) != 2:
        return jsonify({'error': 'Invalid email format'}), 400

    domain = email_parts[1].lower()

    domain_queries = {
        "vendeur.com": "SELECT id_vendeur AS id, nom, prenom FROM vendeur WHERE email=%s and password=%s",
        "commerciale.com": "SELECT id_commerciale AS id, nom, prenom FROM commerciale WHERE email=%s and password=%s",
        "livreur.com": "SELECT id_livreur AS id, nom, prenom FROM livreur WHERE email=%s and password=%s",
        "comptable.com": "SELECT id_comptable AS id, nom, prenom FROM comptable WHERE email=%s and password=%s",
        "receptionist.com": "SELECT id_receptionniste AS id, nom, prenom FROM receptionniste WHERE email=%s and password=%s",
        "operateur.com": "SELECT id_operateur AS id, nom, prenom FROM operateur WHERE email=%s and password=%s",
        "achat.com": "SELECT id_achat AS id, nom, prenom FROM achat WHERE email=%s and password=%s"
    }

    if domain not in domain_queries:
        return jsonify({'error': 'Invalid email domain or interface'}), 400

    query = domain_queries[domain]

    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, (email, password))
        result = cursor.fetchone()

        if result:
            return jsonify({'message': 'Login successful', 'id': result['id'], 'nom': result['nom'], 'prenom': result['prenom']}), 200
        else:
            return jsonify({'error': 'Invalid login credentials'}), 401

    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

