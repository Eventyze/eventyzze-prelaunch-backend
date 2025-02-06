"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utilities_1 = require("../../utilities");
const envKeys_1 = require("../../configurations/envKeys");
const makePayment = async (data) => {
    try {
        const { amount, email, currency, transactionReference } = data;
        const response = await axios_1.default.post("https://api.flutterwave.com/v3/payments", {
            tx_ref: transactionReference,
            amount,
            currency: currency || "NGN",
            // redirect_url: CALLBACK_URL,
            customer: { email },
            customizations: {
                title: "My App Payment",
                description: "Payment for Order",
                logo: "https://your-app-logo.com/logo.png"
            }
        }, {
            headers: { Authorization: `Bearer ${envKeys_1.FLUTTERWAVE_TEST_SECRET_KEY}` }
        });
        return { payment_url: response.data.data.link };
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        throw utilities_1.errorUtilities.createError("Payment Unsuccessful, please try again", 500);
    }
};
const paymentConfirmation = async (data) => {
    // const transactionId = req.query.transaction_id;
    const { transaction_id } = data;
    try {
        const response = await axios_1.default.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: { Authorization: `Bearer ${envKeys_1.FLUTTERWAVE_TEST_SECRET_KEY}` }
        });
        const status = response.data.data.status;
        if (status === "successful") {
            return { status, message: "Payment successful", data: response.data.data };
        }
        else {
            return { status: "failed", error: "Payment failed" };
        }
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        throw utilities_1.errorUtilities.createError("Payment Verification Failed, please try again", 500);
    }
};
exports.default = {
    makePayment,
    paymentConfirmation
};
