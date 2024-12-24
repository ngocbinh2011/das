import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import orderApi from "../../apis/orderApi";
import shippingAddressApi from "../../apis/shippingAddressApi";
import userApi from "../../apis/userApi";
import "./orderList.css";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
const { Option } = Select;

const OrderList = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [users, setUsers] = useState([]);

    const history = useHistory();

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "slug": values.slug
            }
            await axiosClient.post("/category", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            await orderApi.updateOrderStatus(id, values.status).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await orderApi.getListOrder().then((res) => {
                setOrder(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleEditOrder = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await orderApi.getDetailOrder(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    status: response.status,
                    address: response.shippingAddressId, 
                    description: "Order placed through checkout",
                    orderTotal: 16261,
                    products: response.items,
                    user: response.userId,
                    billing: response.paymentMethod,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }


    useEffect(() => {
        const fetchShippingAddresses = async () => {
            try {
                const response = await shippingAddressApi.getAllShippingAddresses();
                setShippingAddresses(response);
            } catch (error) {
                console.log('Failed to fetch shipping addresses:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await userApi.getAllUsers();
                setUsers(response);
            } catch (error) {
                console.log('Failed to fetch users:', error);
            }
        };

        fetchShippingAddresses();
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => <a>{text?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</a>,
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <span>
                    {status === "rejected" ? <Tag style={{ width: 95, textAlign: "center" }} color="red">Đã hủy</Tag> : 
                     status === "approved" ? <Tag style={{ width: 95, textAlign: "center" }} color="geekblue">Vận chuyển</Tag> : 
                     status === "final" ? <Tag color="green" style={{ width: 95, textAlign: "center" }}>Đã giao</Tag> : 
                     <Tag color="blue" style={{ width: 95, textAlign: "center" }}>Đợi xác nhận</Tag>}
                </span>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'shippingAddressId',
            key: 'shippingAddressId',
            render: (id) => {
                const address = shippingAddresses.find(addr => addr.id === id);
                return address ? `${address.addressLine}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}` : 'Không có';
            },
        },
        {
            title: 'Người mua',
            dataIndex: 'userId',
            key: 'userId',
            render: (id) => {
                const user = users.find(user => user.id === id);
                return user ? user.username : 'Không có';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ width: 180, borderRadius: 15, height: 30 }}
                                onClick={() => handleViewOrder(record.id)}
                            >
                                Xem
                            </Button>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 180, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditOrder(record.id)}
                            >
                                Xác nhận đơn hàng
                            </Button>
                            
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    const handleViewOrder = (orderId) => {
        history.push(`/order-details/${orderId}`);
    };


    useEffect(() => {
        (async () => {
            try {
                await orderApi.getListOrder().then((res) => {
                    console.log(res);
                    setOrder(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(order.map(item => ({
            ID: item.id,
            'Tổng tiền': item.totalAmount,
            'Hình thức thanh toán': item.paymentMethod,
            'Trạng thái': item.status,
            'Mô tả': item.description,
            'Địa chỉ giao hàng': shippingAddresses.find(addr => addr.id === item.shippingAddressId)?.addressLine || 'Không có',
            'Người mua': users.find(user => user.id === item.userId)?.username || 'Không có',
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

        // Generate buffer and save
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
        saveAs(data, 'OrderList.xlsx');
    };

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingCartOutlined />
                                <span>Quản lý đơn hàng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button type="primary" onClick={exportToExcel}>
                                                    Xuất Excel
                                                </Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }} />
                    </div>
                </div>

                <Modal
                    title="Tạo danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your content!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Slug" />
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật đơn hàng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select >
                                <Option value="final">Đã giao</Option>
                                <Option value="approved">Đang vận chuyển</Option>
                                <Option value="pending">Đợi xác nhận</Option>
                                <Option value="rejected">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default OrderList;