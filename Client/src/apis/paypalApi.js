import axiosClient from './axiosClient';

const paypalApi = {
    createPayment: async (data) => {
        return await axiosClient.post('/paypal/payment', data);
    },

    executePayment: async (paymentId, token, payerId, accessToken) => {
        return await axiosClient.get(`/paypal/execute?paymentId=${paymentId}&token=${token}&PayerID=${payerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },
};

export default paypalApi; 