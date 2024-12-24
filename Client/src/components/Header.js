import React, { useEffect } from 'react';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, Link as ChakraLink, Badge } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || {});
    const { cart } = useCart();

    useEffect(() => {
        const handleUserChange = () => {
            const newUser = JSON.parse(localStorage.getItem("user")) || {};
            if (JSON.stringify(newUser) !== JSON.stringify(user)) {
                setUser(newUser);
                window.location.reload(); // Refresh the page
            }
        };

        // You can set an interval or use an event listener to check for changes
        const interval = setInterval(handleUserChange, 1000); // Check every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [user]);

    return (
        <Box bg="blue.500" color="white" px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'}>
                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png" alt="Logo Fahasa" style={{ height: '40px', marginRight: '8px' }} />
                    <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
                        <Link to="/">
                            <Button variant="link" color="white" ml={2}>Trang chủ</Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="link" color="white" ml={4}>Sản phẩm</Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="link" color="white" ml={4}>Liên hệ</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="link" color="white" ml={4}>Giới thiệu</Button>
                        </Link>
                    </Flex>
                </Flex>
                <Flex alignItems={'center'}>
                    <ChakraLink as={Link} to="/cart" color="white" mr={4} position="relative">
                        <FiShoppingCart size="24px" />
                        {cart.length > 0 && (
                            <Badge
                                colorScheme="red"
                                borderRadius="full"
                                position="absolute"
                                top="-1"
                                right="-1"
                                fontSize="0.8em"
                            >
                                {cart.length}
                            </Badge>
                        )}
                    </ChakraLink>
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton as={Button} variant="link" color="white" display="flex" alignItems="center" h="100%">
                                <Avatar size="sm" name={user.name} src={user.imageUrl} mr={2} />
                                {user.username}
                            </MenuButton>
                            <MenuList>
                                <MenuItem color="black" onClick={() => navigate('/profile')}>Hồ sơ</MenuItem>
                                <MenuItem color="black" onClick={() => navigate('/purchased-books')}>Sách đã mua</MenuItem>
                                <MenuItem color="black" onClick={() => navigate('/change-password')}>Đổi mật khẩu</MenuItem>
                                <MenuItem color="black" onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    navigate('/');
                                    window.location.reload();
                                }}>Đăng xuất</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Link to="/login">
                            <Button variant="link" color="white">Đăng nhập</Button>
                        </Link>
                    )}
                    <IconButton
                        aria-label="Open Menu"
                        icon={<HamburgerIcon />}
                        display={{ md: 'none' }}
                        onClick={() => {
                            // Logic to open a mobile menu can be added here
                        }}
                        ml={2}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;