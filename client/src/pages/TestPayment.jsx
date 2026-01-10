import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const TestPayment = () => {
    const [amount, setAmount] = useState(500);
    const [name, setName] = useState("John Doe");
    const [address, setAddress] = useState({
        line1: "123 Main St",
        city: "San Jose",
        state: "CA",
        postalCode: "95131",
        countryCode: "US"
    });

    const initialOptions = {
        "client-id": "Ac_FRYimWjrsEsfCFW0JRwoZC4soHShBhycIyRMnhi7b_YzM7tVDYkXx3834Oawz0PlHgGuc-ssvdvzV",
        currency: "USD",
        intent: "capture",
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Test PayPal Integration</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Amount (USD)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Full Name" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Shipping Address</label>
                    <input type="text" name="line1" value={address.line1} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Address Line 1" />
                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" placeholder="City" />
                    <div className="flex gap-2 mb-2">
                        <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg" placeholder="State" />
                        <input type="text" name="postalCode" value={address.postalCode} onChange={handleAddressChange} className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Postal Code" />
                    </div>
                    <input type="text" name="countryCode" value={address.countryCode} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Country Code (e.g., US)" />
                </div>

                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                            return fetch("/api/payment/create-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    amount: amount,
                                    name: name,
                                    address: address
                                }),
                            })
                                .then((response) => response.json())
                                .then((order) => order.id);
                        }}
                        onApprove={(data, actions) => {
                            return fetch("/api/payment/capture-order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ orderID: data.orderID }),
                            })
                                .then((response) => response.json())
                                .then((details) => {
                                    alert("Transaction completed by " + details.payer.name.given_name);
                                    console.log(details);
                                });
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        </div>
    );
};

export default TestPayment;
