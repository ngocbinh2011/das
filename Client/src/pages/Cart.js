import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Checkbox,
  Divider,
  Grid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Select,
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import promotionsApi from '../apis/promotionsApi';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await promotionsApi.getListPromotions();
      setPromotions(response);
    };
    fetchPromotions();
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleDeleteAll = () => {
    cart.forEach(item => removeFromCart(item.id));
    setSelectAll(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const applyPromotion = () => {
    if (selectedPromotion) {
      const { discountType, discountValue } = selectedPromotion;
      let discount = 0;
      if (discountType === 'PERCENT') {
        discount = totalAmount * (discountValue / 100);
      } else if (discountType === 'FIXED_AMOUNT') {
        discount = discountValue;
      }
      if (discount > totalAmount) {
        discount = totalAmount;
      }
      setDiscountValue(discount);
      setDiscountApplied(true);

      const newTotalAmount = totalAmount - discount;
      localStorage.setItem('totalAmount', newTotalAmount > 0 ? newTotalAmount : 0);
    }
  };

  const removePromotion = () => {
    setSelectedPromotion(null);
    setDiscountValue(0);
    setDiscountApplied(false);
    localStorage.setItem('totalAmount', totalAmount);
  };

  const calculateFinalTotal = () => {
    const finalTotal = totalAmount - discountValue;
    return finalTotal > 0 ? finalTotal : 0;
  };

  const handleCheckout = () => {
    const user = localStorage.getItem('user'); // Assuming user info is stored in localStorage
    if (!user) {
      // Redirect to login page if not logged in
      window.location.href = '/login';
    } else {
      // Redirect to checkout page if logged in
      window.location.href = '/checkout';
    }
  };

  return (
    <Box p={5} maxW="1200px" mx="auto" bg="gray.50" boxShadow="xl" borderRadius="lg">
      <Text fontWeight="bold" fontSize="2xl" mb={4}>GIỎ HÀNG ({cart.length} sản phẩm)</Text>
      <Divider mb={4} />
      {cart.length === 0 ? (
        <Text>Giỏ hàng của bạn đang trống.</Text>
      ) : (
        <Grid templateColumns={["1fr", "3fr 1fr"]} gap={6}>
          <Box>
            <HStack mb={4} justifyContent="space-between">
              <Checkbox isChecked={selectAll} onChange={handleSelectAll}>
                Chọn tất cả ({cart.length} sản phẩm)
              </Checkbox>
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleDeleteAll}
                isDisabled={!selectAll}
              >
                Xóa tất cả
              </Button>
            </HStack>
            <VStack spacing={4} align="start">
              {cart.map((item) => (
                <Box key={item.id} w="full" p={4} bg="white" borderRadius="md" boxShadow="md">
                  <HStack justifyContent="space-between">
                    <Image src={item.image} alt={item.title} boxSize="80px" />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{item.title}</Text>
                      <Text color="red.500" fontWeight="bold">{formatCurrency(item.price)}</Text>
                      <Text color="gray.600">Tổng: {formatCurrency(item.price * item.quantity)}</Text>
                    </VStack>
                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, parseInt(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button size="sm" onClick={() => removeFromCart(item.id)}>Xóa</Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box p={4} bg="white" borderRadius="md" boxShadow="md">
            <Text fontWeight="bold" mb={2}>Tổng Số Tiền (gồm VAT)</Text>
            <Text fontSize="2xl" color="red.500" fontWeight="bold">
              {formatCurrency(calculateFinalTotal())}
            </Text>
            <Text color="green.500" fontWeight="bold">
              {discountApplied && `Bạn đã tiết kiệm: ${formatCurrency(discountValue)}`}
            </Text>
            <Divider my={4} />
            <Select placeholder="Chọn khuyến mãi" onChange={(e) => setSelectedPromotion(promotions.find(promo => promo.promotionId === parseInt(e.target.value)))}>
              {promotions.map(promo => (
                <option key={promo.promotionId} value={promo.promotionId}>
                  {promo.promotionName}
                </option>
              ))}
            </Select>
            <HStack spacing={4} mt={4}>
              <Button onClick={applyPromotion} isDisabled={discountApplied || !selectedPromotion}>
                Áp dụng khuyến mãi
              </Button>
              <Button onClick={removePromotion} isDisabled={!discountApplied}>
                Bỏ khuyến mãi
              </Button>
            </HStack>
            <Button colorScheme="red" w="full" mt={4} onClick={handleCheckout}>
              THANH TOÁN
            </Button>
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;