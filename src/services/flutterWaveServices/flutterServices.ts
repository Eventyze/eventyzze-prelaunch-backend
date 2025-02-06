import axios from 'axios';
import { errorUtilities } from '../../utilities';
import { FLUTTERWAVE_TEST_SECRET_KEY } from '../../configurations/envKeys';

const makePayment = async (data: any) => {

    try{
    const { amount, email, currency, transactionReference } = data;



    const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
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
        },
        {
            headers: { Authorization: `Bearer ${FLUTTERWAVE_TEST_SECRET_KEY}` }
        }
    );

    return { payment_url: response.data.data.link };

} catch (error: any) {
    console.error(error.response?.data || error.message);
    throw errorUtilities.createError("Payment Unsuccessful, please try again", 500);
}
}



const paymentConfirmation = async(data:any) => {
    // const transactionId = req.query.transaction_id;
    const { transaction_id } = data;

    try {
        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            {
                headers: { Authorization: `Bearer ${FLUTTERWAVE_TEST_SECRET_KEY}` }
            }
        );

        const status = response.data.data.status;

        if (status === "successful") {
            return { status, message: "Payment successful", data: response.data.data };
        } else {
            return {status: "failed", error: "Payment failed" };
        }
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        throw errorUtilities.createError("Payment Verification Failed, please try again", 500);
    
    }
}



export default {
    makePayment,
    paymentConfirmation
}