import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./login.css";

const Login = () => {

  const [isLogin, setLogin] = useState(true);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordForm] = Form.useForm(); 

  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.username, values.password)
      .then(function (response) {
        if (!response.user) {
          setLogin(false);
        }
        else {
          (async () => {
            try {
              console.log(response);
              if (response.user.role === "ADMIN") {
                history.push("/dash-board");
              } else {
                notification["error"]({
                  message: `Thông báo`,
                  description:
                    'Bạn không có quyền truy cập vào hệ thống',

                });
              }
            } catch (error) {
              console.log('Failed to fetch ping role:' + error);
            }
          })();
        }
      })
      .catch(error => {
        console.log("username or password error" + error)
      });
  }


  const handleForgotPasswordCancel = () => {
    setForgotPasswordModalVisible(false);
  };

  const handleForgotPasswordSubmit = async () => {
    const values = await forgotPasswordForm.validateFields(); 
    console.log(values.username);

    try {
      const data = {
        "username": values.username
      }
      await userApi.forgotPassword(data);
      notification.success({
        message: 'Thông báo',
        description: 'Đã gửi đường dẫn đổi mật khẩu qua email.',
      });
      setForgotPasswordModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi gửi đường dẫn đổi mật khẩu.',
      });
      console.error('Forgot password error:', error);
    }
  };

  const handleLink = () => {
    history.push("/register");
  }

  useEffect(() => {

  }, [])

  return (
    <div className="imageBackground">
      <div id="formContainer" >
        <div id="form-Login">
          <div className="formContentLeft"
          >
            <img className="formImg" src="https://wallpapers.com/images/hd/camping-background-rgj5169zktuggn6e.jpg" alt='spaceship' />
          </div>
          <Form
            style={{ width: 340, marginBottom: 8 }}
            name="normal_login"
            className="loginform"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
              <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG!</Divider>
            </Form.Item>
            <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
              <p className="text">Đăng nhập để vào hệ thống quản lý</p>
            </Form.Item>
            <>
              {isLogin === false ?
                <Form.Item style={{ marginBottom: 16 }}>
                  <Alert
                    message="Tài khoản hoặc mật khẩu sai"
                    type="error"
                    showIcon
                  />

                </Form.Item>
                : ""}
            </>
            <Form.Item
              style={{ marginBottom: 20 }}
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người dùng!',
                },
              ]}
            >
              <Input
                style={{ height: 34, borderRadius: 5 }}
                prefix={<UserOutlined className="siteformitemicon" />}
                placeholder="Tên người dùng" />
            </Form.Item >
            <Form.Item
              style={{ marginBottom: 8 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="siteformitemicon" />}
                type="password"
                placeholder="Mật khẩu"
                style={{ height: 34, borderRadius: 5 }}
              />
            </Form.Item>

            <Form.Item style={{ width: '100%', marginTop: 20, marginBottom: 5 }}>
              <Button className="button" type="primary" htmlType="submit"  >
                Đăng Nhập
              </Button>
            </Form.Item>

            {/* <Form.Item style={{ textAlign: 'center' }}>
              <a onClick={showForgotPasswordModal}>Quên mật khẩu?</a>
            </Form.Item> */}
          </Form>
        </div>

        <Modal
          title="Quên mật khẩu"
          visible={forgotPasswordModalVisible}
          onCancel={handleForgotPasswordCancel}
          footer={[
            <Button key="back" onClick={handleForgotPasswordCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleForgotPasswordSubmit}>
              Gửi đường dẫn đổi mật khẩu
            </Button>,
          ]}
        >
          <Form
            name="forgot_password"
            onFinish={handleForgotPasswordSubmit}
            form={forgotPasswordForm}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người dùng',
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Login;


