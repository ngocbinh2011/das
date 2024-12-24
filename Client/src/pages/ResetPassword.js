import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import userApi from '../apis/userApi';
import { useToast, Box, Button, Input, Heading, VStack } from '@chakra-ui/react';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userApi.changePassword(token, newPassword);
            toast({
                title: 'Thành công',
                description: 'Mật khẩu đã được thay đổi thành công!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt="100px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg">
            <Heading as="h2" size="lg" textAlign="center" mb="4">Đặt lại mật khẩu</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <Input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        variant="filled"
                    />
                    <Button type="submit" colorScheme="teal" width="full">Đặt lại mật khẩu</Button>
                </VStack>
            </form>
        </Box>
    );
};

export default ResetPassword; 