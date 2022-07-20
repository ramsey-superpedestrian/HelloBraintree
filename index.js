var CUSTOMER_ID = 579783962;
var TOKENIZATION_KEY = "sandbox_w3h9kskq_v7623qc96m9gfrtf";

createCustomer = function(){
    fetch("http://localhost:5000/create_customer", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "first_name": "Jen",
            "last_name": "Smith",
            "company": "Braint`ree",
            "email": "jen@example.com",
            "phone": "312.555.1234",
            "fax": "614.555.5678",
            "website": "www.example.com"
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("customerId").innerText = data.customer_id;
            CUSTOMER_ID = data.customer_id;
        })
        .catch(console.log)
}


loadPaypalInterface = function(){
    clientTokenUrl = "http://localhost:5000/client_token/" + CUSTOMER_ID
    fetch(clientTokenUrl)
        .then(response => response.json())
        .then(data => {
		    CLIENT_TOKEN_FROM_SERVER = data.token;
		    braintree.setup(
                // Replace this with a client token from your server
                CLIENT_TOKEN_FROM_SERVER,
                "dropin", {
                  container: "payment-form"
                });
        });
}
