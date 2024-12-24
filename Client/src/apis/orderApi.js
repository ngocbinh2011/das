import axiosClient from './axiosClient';
import axios from 'axios';

const orderApi = {
    /*Danh sách api orders */

    createOrder(data) {
        const url = '/orders';
        return axiosClient.post(url, data);
    },

    getDetailOrder(id) {
        const url = '/orders/' + id;
        return axiosClient.get(url);
    },

    getListOrder() {
        const url = '/orders';
        return axiosClient.get(url);
    },

    deleteOrder(id) {
        const url = "/orders/" + id;
        return axiosClient.delete(url);
    },

    searchOrder(name) {
        const params = {
            name: name.target.value
        }
        const url = '/orders/searchByName';
        return axiosClient.get(url, { params });
    },

    // API thống kê doanh thu theo tháng
    getMonthlyRevenue() {
        const url = '/orders/stats/revenue';
        return axiosClient.get(url);
    },

    // API thống kê các mặt hàng bán chạy theo tháng
    getBestSellingProducts() {
        const url = '/orders/stats/best-selling-products';
        return axiosClient.get(url);
    },

    // API lấy danh sách đơn hàng của người dùng theo userId
    getOrdersByUserId(userId) {
        const url = `/orders/user/${userId}`;
        return axiosClient.get(url);
    },

    executePayment: async (paymentId, token, payerId, accessToken) => {
        return await axios.get(`/api/paypal/execute?paymentId=${paymentId}&token=${token}&PayerID=${payerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },
}

export default orderApi;
