'use client'

import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  Text,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Toast,
  useToast,
} from '@chakra-ui/react';
import { SmallCloseIcon, DeleteIcon } from '@chakra-ui/icons';
import userApi from '../apis/userApi';
import shippingAddressApi from '../apis/shippingAddressApi'; 
import orderApi from '../apis/orderApi'; 

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function UserProfileEdit() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    imageUrl: '',
    role: 'USER', 
  });

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [orders, setOrders] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // Use the hook at the top level of the component
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColorDelivered = 'green.400';
  const borderColorProcessing = 'orange.400';
  const borderColorPending = 'red.400';

  const toast = useToast(); 

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      fetchShippingAddresses(userId); 
      fetchUserOrders(userId);
    }
  }, [userId]);

  const fetchUserData = (id) => {
    userApi.getUserById(id).then((data) => {
      const updatedUserData = {
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        imageUrl: data.imageUrl,
        role: data.role || 'USER',
      };
      setUserData(updatedUserData);

      // Update localStorage with the fetched user data
      localStorage.setItem('user', JSON.stringify({ ...data, id }));
    }).catch((error) => {
      console.error('Failed to fetch user data:', error);
    });
  };

  const fetchShippingAddresses = (userId) => {
    shippingAddressApi.getShippingAddressesByUserId(userId).then((response) => {
      setShippingAddresses(response);
    }).catch((error) => {
      console.error('Failed to fetch shipping addresses:', error);
    });
  };

  const fetchUserOrders = (userId) => {
    orderApi.getOrdersByUserId(userId).then((response) => {
      setOrders(response); 
    }).catch((error) => {
      console.error('Failed to fetch user orders:', error);
    });
  };

  const handleSubmit = () => {
    if (userId) {
      console.log("====DATA====")
      console.log(userData);
      userApi.updateUser(userId, userData).then(() => {
        fetchUserData(userId);
        toast({
          title: "Cập nhật thành công.",
          description: "Thông tin người dùng đã được cập nhật.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error('Failed to update user data:', error);
        toast({
          title: "Cập nhật thất bại.",
          description: "Có lỗi xảy ra khi cập nhật thông tin.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
  };

  const handleCreateAddress = () => {
    if (userId) {
      const addressData = { ...newAddress, user: userId };
      shippingAddressApi.createShippingAddress(addressData).then(() => {
        fetchShippingAddresses(userId);
        onClose();
        toast({
          title: "Thêm địa chỉ thành công.",
          description: "Địa chỉ mới đã được thêm.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error('Failed to create shipping address:', error);
        toast({
          title: "Thêm địa chỉ thất bại.",
          description: "Có lỗi xảy ra khi thêm địa chỉ.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
  };

  const handleDeleteAddress = (id) => {
    shippingAddressApi.deleteShippingAddress(id).then(() => {
      fetchShippingAddresses(userId);
      toast({
        title: "Xóa địa chỉ thành công.",
        description: "Địa chỉ đã được xóa.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      console.log(error);
      if (error.message === "Cannot delete shipping address as it is referenced by existing orders.") {
        console.error('Cannot delete shipping address as it is referenced by existing orders.');
        toast({
          title: "Xóa địa chỉ thất bại.",
          description: "Địa chỉ không thể xóa vì đang được tham chiếu bởi đơn hàng.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Failed to delete shipping address:', error);
        toast({
          title: "Xóa địa chỉ thất bại.",
          description: "Có lỗi xảy ra khi xóa địa chỉ.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  const handleDeleteOrder = (id) => {
    const orderToDelete = orders.find(order => order.id === id);
    if (orderToDelete && orderToDelete.paymentMethod === 'PayPal') {
      toast({
        title: "Hủy đơn hàng thất bại.",
        description: "Đơn hàng đã được thanh toán bằng PayPal không thể hủy.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Exit the function if the order is paid via PayPal
    }
    
    orderApi.deleteOrder(id).then(() => {
      fetchUserOrders(userId); 
      toast({
        title: "Hủy đơn hàng thành công.",
        description: "Đơn hàng đã được hủy.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      console.error('Failed to delete order:', error);
      toast({
        title: "Hủy đơn hàng thất bại.",
        description: "Có lỗi xảy ra khi hủy đơn hàng.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        // Call the image upload API
        fetch('https://api.imgbb.com/1/upload?key=e64a49ca517de7491f78d8edf586515a', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imageUrl = data.data.url;
                console.log(imageUrl);
                setUserData(prevUserData => ({ ...prevUserData, imageUrl }));
                
                // Clear the file input
                event.target.value = null; // Reset the input value
            } else {
                console.error('Tải lên hình ảnh thất bại:', data);
                toast({
                    title: "Tải lên thất bại.",
                    description: "Đã xảy ra sự cố khi tải lên hình ảnh của bạn.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải lên hình ảnh:', error);
            toast({
                title: "Lỗi tải lên.",
                description: "Đã xảy ra lỗi trong quá trình tải lên hình ảnh của bạn.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        });
    }
  };

  useEffect(() => {
    if (userData.imageUrl) {
      handleSubmit();
    }
  }, [userData.imageUrl]);

  useEffect(() => {
    console.log('userData has been updated:', userData);
  }, [userData]);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={bgColor}>
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={6}
        w={'full'}
        maxW={'6xl'}
        p={6}
      >
        <GridItem>
          <Stack
            spacing={4}
            bg={cardBgColor}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              Hồ sơ người dùng
            </Heading>
            <FormControl id="userName">
              <FormLabel>Biểu tượng người dùng</FormLabel>
              <Stack direction={['column', 'row']} spacing={6}>
                <Center>
                  <Avatar size="xl" src={userData.imageUrl}>
                    <AvatarBadge
                      as={IconButton}
                      size="sm"
                      rounded="full"
                      top="-10px"
                      colorScheme="red"
                      aria-label="remove Image"
                      icon={<SmallCloseIcon />}
                    />
                  </Avatar>
                </Center>
                <Center w="full">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} />
                </Center>
              </Stack>
            </FormControl>
            <FormControl id="userName" isRequired>
              <FormLabel>Tên người dùng</FormLabel>
              <Input
                placeholder="Tên người dùng"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                disabled
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Địa chỉ email</FormLabel>
              <Input
                placeholder="email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                placeholder="Số điện thoại"
                _placeholder={{ color: 'gray.500' }}
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Cập nhật
              </Button>
            </Stack>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack
            spacing={4}
            bg={cardBgColor}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading size="md">Địa chỉ giao hàng</Heading>
            <Button onClick={onOpen} colorScheme="teal" mb={4}>
              Thêm địa chỉ mới
            </Button>
            <Stack spacing={3}>
              {shippingAddresses.map((address) => (
                <Box key={address.id} p={3} shadow="md" borderWidth="1px" rounded="md" display="flex" justifyContent="space-between" alignItems="center">
                  <Text>{address.addressLine}, {address.city}, {address.state}, {address.postalCode}, {address.country}</Text>
                  <IconButton
                    aria-label="Delete address"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteAddress(address.id)}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Stack
            spacing={4}
            bg={cardBgColor}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading size="md" mb={4}>
              Danh sách đơn hàng
            </Heading>
            {orders.length > 0 ? (
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {orders.map((order) => (
                  <Box
                    key={order.id}
                    p={5}
                    bg={bgColor}
                    borderRadius="lg"
                    boxShadow="md"
                    borderLeftWidth={4}
                    borderColor={
                      order.status === 'final'
                        ? borderColorDelivered
                        : order.status === 'approved'
                          ? borderColorProcessing
                          : borderColorPending
                    }
                  >
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontWeight="bold" fontSize="lg">
                        Mã đơn hàng: #{order.id}
                      </Text>
                      <Badge colorScheme={
                        order.status === 'final'
                          ? 'green'
                          : order.status === 'approved'
                            ? 'orange'
                            : 'red'
                      }>
                        {order.status === 'final' ? 'Đã giao' : order.status === 'approved' ? 'Đang vận chuyển' : order.status === 'pending' ? 'Đợi xác nhận' : 'Đã hủy'}
                      </Badge>
                    </Flex>

                    <Flex justify="space-between" align="start" direction={{ base: 'column', md: 'row' }}>
                      <Stack spacing={2}>
                        <Text>
                          <strong>Tổng tiền:</strong> {formatCurrency(order.totalAmount)}
                        </Text>
                        <Text>
                          <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                        </Text>
                        <Text>
                          <strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                         
                      {order.status === 'pending' && (
                          <Button colorScheme="red" onClick={() => handleDeleteOrder(order.id)}>
                            Hủy đơn hàng
                          </Button>
                        )}
                      </Stack>
                      <Stack spacing={2} mt={{ base: 4, md: 0 }}>
                        <Text color="gray.600">
                          <strong>Mô tả:</strong> {order.description || 'Không có mô tả'}
                        </Text>
                      </Stack>
                     
                    </Flex>
                  </Box>
                ))}
              </Grid>
            ) : (
              <Text>Không có đơn hàng nào.</Text>
            )}
          </Stack>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm địa chỉ mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="addressLine" isRequired>
              <FormLabel>Địa chỉ</FormLabel>
              <Input
                placeholder="Địa chỉ"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
              />
            </FormControl>
            <FormControl id="city" isRequired mt={4}>
              <FormLabel>Thành phố</FormLabel>
              <Input
                placeholder="Thành phố"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </FormControl>
            <FormControl id="state" isRequired mt={4}>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Input
                placeholder="Tỉnh/Thành phố"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </FormControl>
            <FormControl id="postalCode" isRequired mt={4}>
              <FormLabel>Mã bưu điện</FormLabel>
              <Input
                placeholder="Mã bưu điện"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              />
            </FormControl>
            <FormControl id="country" isRequired mt={4}>
              <FormLabel>Quốc gia</FormLabel>
              <Input
                placeholder="Quốc gia"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateAddress}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
} 