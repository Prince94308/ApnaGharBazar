import paypal from '@paypal/checkout-server-sdk';
import { errorHandler } from '../utils/error.js';
import dotenv from 'dotenv';
dotenv.config();

const Environment =
    process.env.NODE_ENV === 'production'
        ? paypal.core.LiveEnvironment
        : paypal.core.SandboxEnvironment;

const client = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    )
);

export const createOrder = async (req, res, next) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    const { amount, name, address } = req.body;
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: amount,
                },
                shipping: {
                    name: {
                        full_name: name
                    },
                    address: {
                        address_line_1: address.line1,
                        admin_area_2: address.city,
                        admin_area_1: address.state,
                        postal_code: address.postalCode,
                        country_code: address.countryCode
                    }
                }
            },
        ],
    });

    try {
        const order = await client.execute(request);
        res.status(200).json({ id: order.result.id });
    } catch (error) {
        next(error);
    }
};

export const captureOrder = async (req, res, next) => {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.status(200).json(capture.result);
    } catch (error) {
        next(error);
    }
};
