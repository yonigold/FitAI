const functions = require("firebase-functions");
const paypal = require("@paypal/checkout-server-sdk");
const cors = require("cors")({origin: true});


const clientId = functions.config().paypal.client_id;
const clientSecret = functions.config().paypal.client_secret;

const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "9.99"
                    }
                }
            ]
        });
        let order;
        try {
            order = await client.execute(request);
        } catch (err) {
            console.error(err);
            return response.status(500).json({error: err.message});
            console.log('payment failed + ' + err.message)
        }
        return response.status(200).json({ orderID: order.result.id });
        console.log('payment success')
    });
});

exports.captureOrder = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const orderID = request.body.orderID;
        if (!orderID) {
            console.log('Missing orderId in request body');
            return response.status(400).json({ error: 'Missing orderId in request body' });
        }

        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
        captureRequest.requestBody({});
        let order;
        try {
            order = await client.execute(captureRequest);
        } catch (err) {
            console.error('Error executing captureRequest:', err);
            return response.status(500).json({ error: err.message });
        }
        console.log('captureOrder response:', order);
        return response.status(200).json(order);
    });
});



const admin = require("firebase-admin");
admin.initializeApp();




// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
