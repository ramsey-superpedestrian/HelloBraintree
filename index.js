// Step two: create a dropin instance using that container (or a string
//   that functions as a query selector such as `#dropin-container`)

fetch("http://localhost:5000/client_token")
    .then(response => response.json())
    .then(data => {
        console.log(data.token);
        let CLIENT_TOKEN_FROM_SERVER = data.token;

        braintree.dropin.create({
            container: document.getElementById('dropin-container'),
            authorization: CLIENT_TOKEN_FROM_SERVER,
            container: '#dropin-container'
            // ...plus remaining configuration
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


