# HelloBraintree
Braintree Hello World

```
pip install -r requirements
FLASK_ENV=development flask run -p 5001
```

navigate to 

http://localhost:5001/

Click "create customer"
Click "load paypal interface"

Note: macOS Monterey introduced AirPlay Receiver running on port 5000. 
To avoid permission errors, we use port 5001

Observed issues with getting the PayPal interface in Safari, but it worked fine in Chrome. 