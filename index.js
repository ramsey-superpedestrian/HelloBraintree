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
            "company": "Braintree",
            "email": "jen@example.com",
            "phone": "312.555.1234",
            "fax": "614.555.5678",
            "website": "www.example.com"
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("customerId").innerText = data.customer_id;
        })
        .catch(console.log)
}


loadPaypalInterface = function(){
    fetch("http://localhost:5000/client_token")
        .then(response => response.json())
        .then(data => {
            console.log(data.token);
            let CLIENT_TOKEN_FROM_SERVER = data.token;

            braintree.dropin.create({
                container: document.getElementById('dropin-container'),
                authorization: CLIENT_TOKEN_FROM_SERVER,
            }, (error, dropinInstance) => {
                if (error) console.log(error);
                dropinInstance.requestPaymentMethod((error, payload) => {
                    console.log(payload);
                    if (error) console.error(error);

                    // Step four: when the user is ready to complete their
                    //   transaction, use the dropinInstance to get a payment
                    //   method nonce for the user's selected payment method, then add
                    //   it a the hidden field before submitting the complete form to
                    //   a server-side integration
                    document.getElementById('nonce').value = payload.nonce;
                    form.submit();
                });
            });
        });
}
