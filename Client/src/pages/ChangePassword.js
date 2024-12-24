import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Container, Input, Alert, Text, Divider, useToast } from '@chakra-ui/react';
import axiosClient from '../apis/axiosClient';

const ChangePassword = () => {
    const [isLogin, setLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    let { id } = useParams();
    const toast = useToast();

    const onFinish = async (event) => {
        event.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const resetPassWord = {
            username: currentUser.username,
            newPassword: password
        }
        axiosClient.post("/auth/reset-password", null, { params: resetPassWord })
            .then(function (response) {
                if (response.message === "Current password is incorrect") {
                    toast({
                        title: "Thông báo",
                        description: "Mật khẩu hiện tại không đúng!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Thông báo",
                        description: "Thay đổi mật khẩu thành công",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate("/login");
                }
            })
            .catch(error => {
                console.log("password error" + error);
                toast({
                    title: "Lỗi",
                    description: "Đã xảy ra lỗi khi thay đổi mật khẩu.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    }

    return (
        <Container className="imageBackground" bgSize="cover" p={5}>
            <Box id="formContainer" bg="white" p={5} borderRadius="md" boxShadow="md">
                <Text fontSize="2xl" textAlign="center" mb={4}>Thay đổi mật khẩu</Text>
                <Divider mb={4} />
                {isLogin && <Alert status="error">Error changing password</Alert>}
                <form onSubmit={onFinish}>
                    <FormControl mb={4}>
                        <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                        <Input id="password" type="password" placeholder="Mật khẩu" required 
                               value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel htmlFor="confirm">Nhập lại mật khẩu</FormLabel>
                        <Input id="confirm" type="password" placeholder="Nhập lại mật khẩu" required 
                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="teal" type="submit" width="full">Hoàn thành</Button>
                </form>
            </Box>
        </Container>
    );
};

export default ChangePassword; 