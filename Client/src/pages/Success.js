import React, { useEffect } from 'react';
import { useToast, Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import paypalApi from '../apis/paypalApi';
import orderApi from '../apis/orderApi';

const Success = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        const executePayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const paymentId = urlParams.get('paymentId');
            const token = urlParams.get('token');
            const payerId = urlParams.get('PayerID');
            const accessToken = localStorage.getItem('paypalAccessToken');

            if (paymentId && token && payerId) {
                try {
                    const response = await paypalApi.executePayment(paymentId, token, payerId, accessToken);
                    console.log(response);
                    toast({
                        title: 'Payment Successful',
                        description: response.message,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });

                    const orderData = JSON.parse(localStorage.getItem('orderData'));
                    if (orderData) {
                        await orderApi.createOrder(orderData);
                        console.log('Order created successfully:', orderData);
                        clearCart();
                    }

                    localStorage.removeItem('orderData');
                    localStorage.removeItem('paypalAccessToken');
                } catch (error) {
                    console.error('Error executing payment:', error);
                    toast({
                        title: 'Payment Failed',
                        description: 'There was an issue executing your payment. Please try again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        };

        executePayment();
    }, [clearCart]);

    return (
        <Box p={8} maxW="600px" mx="auto" bg="white" boxShadow="xl" borderRadius="lg" textAlign="center" mt={16} mb={16}>
            <VStack spacing={4}>
                <Heading as="h1" size="xl" color="teal.600">Thanh Toán Thành Công!</Heading>
                <Text fontSize="lg" color="gray.600">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công!</Text>
                <Button 
                    colorScheme="teal" 
                    size="lg" 
                    onClick={() => navigate('/')}
                >
                    Quay lại trang chủ
                </Button>
            </VStack>
        </Box>
    );
};

export default Success; 