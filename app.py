import os

import braintree
from dotenv import load_dotenv
from flask import Flask, render_template, send_file, request

load_dotenv()
app = Flask(__name__, template_folder=".")

gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        braintree.Environment.Sandbox,
        merchant_id=os.getenv("BRAINTREE_MERCHANT_ID"),
        public_key=os.getenv("BRAINTREE_PUBLIC_KEY"),
        private_key=os.getenv("BRAINTREE_PRIVATE_KEY")
    )
)


@app.route("/")
def index():
    return render_template("./index.html")


@app.route("/index.js")
def index_js():
    return send_file("./index.js")


@app.route("/create_customer", methods=["POST"])
def create_customer():
    result = gateway.customer.create(request.json)
    return {"customer_id": result.customer.id}


@app.route("/checkout", methods=["POST"])
def create_purchase():
    nonce_from_the_client = request.form["payment_method_nonce"]
    return {"result": nonce_from_the_client}


@app.route("/client_token/<customer_id>", methods=["GET"])
def client_token(customer_id):
    return {
        "token": gateway.client_token.generate({
            "customer_id": customer_id
        })
    }
