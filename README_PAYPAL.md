# PayPal Sandbox Integration Details

## Sandbox Accounts
These accounts are used for testing payments.

### Personal Account (Payer)
**Use this account to log in and make payments during testing.**
- **Email:** `sb-ym6i048632502@personal.example.com`
- **Password:** `5ZMB4dZ*`

### Business Account (Receiver)
**This account receives the funds.**
- **Email:** `sb-ok1qu48629876@business.example.com`
- **Password:** `<++0eU=h`

## Configuration Required
To fully enable the payment processing, you need to update your `.env` file in the `api` folder with the API credentials from the Business Account.

1. Log in to the [PayPal Developer Dashboard](https://developer.paypal.com/).
2. Go to **Apps & Credentials** -> **Sandbox**.
3. Create or select an App (linked to the Business account above).
4. Copy the **Client ID** and **Secret**.

### Update `api/.env`
```env
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

### Update `client/src/pages/TestPayment.jsx`
Replace `"test"` with your **Client ID**:
```javascript
const initialOptions = {
    "client-id": "your_client_id_here",
    currency: "USD",
    intent: "capture",
};
```
