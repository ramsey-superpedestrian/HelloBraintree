var CUSTOMER_ID = null;


updateCustomerId = function () {
    CUSTOMER_ID = document.getElementById("customerIdInput").value;
    document.getElementById("customerId").innerText = CUSTOMER_ID;
}

createCustomer = function () {
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
            document.getElementById("customerIdInput").value = data.customer_id;
            CUSTOMER_ID = data.customer_id;
        })
        .catch(console.log)
}

braintreeInit = function (client_token) {
    // Create a client.
    braintree.client.create({
        authorization: client_token
    }, function (clientErr, clientInstance) {

        // Stop if there was a problem creating the client.
        // This could happen if there is a network error or if the authorization
        // is invalid.
        if (clientErr) {
            console.error('Error creating client:', clientErr);
            alert("Error creating client:");
            return;
        }

        // Create a PayPal Checkout component.
        braintree.paypalCheckout.create({
            client: clientInstance
        }, function (paypalCheckoutErr, paypalCheckoutInstance) {

            // Stop if there was a problem creating PayPal Checkout.
            // This could happen if there was a network error or if it's incorrectly
            // configured.
            if (paypalCheckoutErr) {
                console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
                alert("Error creating PayPal Checkout:");
                return;
            }


            paypalCheckoutInstance.loadPayPalSDK({
                vault: true
            }, function (loadSDKErr) {
                if (loadSDKErr) {
                    console.error('Error loading SDK:', loadSDKErr);
                    alert("Error loading SDK:");
                    return;
                }


                paypal.Buttons({
                    fundingSource: paypal.FUNDING.PAYPAL,
                    createBillingAgreement: function () {
                        return paypalCheckoutInstance.createPayment({
                            flow: "vault",
                            // The following are optional params
                            billingAgreementDescription: 'Your agreement description',
                            enableShippingAddress: true,
                            shippingAddressEditable: false,
                            shippingAddressOverride: {
                                recipientName: 'Scruff McGruff',
                                line1: '1234 Main St.',
                                line2: 'Unit 1',
                                city: 'Chicago',
                                countryCode: 'US',
                                postalCode: '60652',
                                state: 'IL',
                                phone: '123.456.7890'
                            }
                        })

                    },
                    onApprove: function (data, actions) {
                        return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                            console.log(payload.nonce);
                            createPaymentMethodUrl = "http://localhost:5000/create_payment_method/" + CUSTOMER_ID + "/" + payload.nonce
                            fetch(createPaymentMethodUrl).then(response => response.json()).then(console.log)
                        });
                    },

                    onCancel: function (data) {
                        console.log('PayPal payment canceled', JSON.stringify(data, 0, 2));
                    },

                    onError: function (err) {
                        console.error('PayPal error', err);
                    }
                }).render('#paypal-button').then(function () {
                    // The PayPal button will be rendered in an html element with the ID
                    // `paypal-button`. This function will be called when the PayPal button
                    // is set up and ready to be used
                });
            });

        });

    });
}

loadPaypalInterface = function () {
    clientTokenUrl = "http://localhost:5000/client_token/" + CUSTOMER_ID
    fetch(clientTokenUrl)
        .then(response => response.json())
        .then(data => {
            CLIENT_TOKEN_FROM_SERVER = data.token;
            braintreeInit(CLIENT_TOKEN_FROM_SERVER)
        });
}

charge = function () {
    chargeUrl = "http://localhost:5000/charge/" + CUSTOMER_ID
    fetch(chargeUrl)
        .then(response => response.json())
        .then(console.log)
}
