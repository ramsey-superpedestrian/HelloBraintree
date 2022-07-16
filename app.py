import os
import random

import braintree
from dotenv import load_dotenv
from flask import Flask, render_template, send_file, request

load_dotenv()
app = Flask(__name__, template_folder=".")

customer_2_token = {}

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
    customer_2_token[result.customer.id] = None
    print(customer_2_token)
    return {"customer_id": result.customer.id}


@app.route("/checkout", methods=["POST"])
def create_purchase():
    # nonce_from_the_client = request.form["payment_method_nonce"]
    nonce_from_the_client = "fake-valid-nonce"
    result = gateway.transaction.sale({
        "amount": "10.00",
        "payment_method_nonce": nonce_from_the_client,
        "options": {
            "submit_for_settlement": True
        }
    })
    print(result)
    return {"result": True}


@app.route("/client_token/<customer_id>", methods=["GET"])
def client_token(customer_id):
    return {
        "token": gateway.client_token.generate({
            "customer_id": customer_id
        })
    }


@app.route("/create_payment_method/<customer_id>/<nonce>")
def create_payment_method(customer_id, nonce):
    payment_method = gateway.payment_method.create({
        "customer_id": customer_id,
        "payment_method_nonce": nonce
    }).payment_method
    customer_2_token[customer_id] = payment_method.token
    print(payment_method)
    print(customer_2_token)
    return {"token": payment_method.token}


@app.route("/charge/<customer_id>")
def charge(customer_id):
    amount = str(random.randint(1, 10000) / 100)
    token = customer_2_token[customer_id]
    transaction = gateway.transaction.sale({
        "amount": amount,
        "payment_method_token": token
    }).transaction
    print(transaction)
    return {
        "status": transaction.status,
        "amount": amount
    }
