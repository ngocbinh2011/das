import {
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Spin,
    Card,
    Row,
    Col,
    Image
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderApi from "../../apis/orderApi";
import bookApi from "../../apis/bookApi";
import "./orderDetail.css";

const OrderDetail = () => {

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await orderApi.getDetailOrder(id);
                setOrder(res);
                setLoading(false);
                await fetchProducts(res.items);
            } catch (error) {
                console.log('Failed to fetch order details:' + error);
            }
        })();
        
    }, [id]);

    const fetchProducts = async (items) => {
        const productPromises = items.map(item => bookApi.getDetailBook(item.bookId));
        const productDetails = await Promise.all(productPromises);
        console.log(productDetails)

        setProducts(productDetails);
    };

    if (loading) return <Spin spinning={loading} tip="Loading..." />;
    
    return (
        <div className='order-detail-container'>
            <div style={{ marginTop: 20 }}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <ShoppingCartOutlined />
                        <span>Chi tiết đơn hàng</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="order-details">
                <Card title="Chi tiết đơn hàng" bordered={false}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <h3>Thông tin đơn hàng</h3>
                                <p><strong>Mã đơn hàng:</strong> {order?.id}</p>
                                <p><strong>Người dùng:</strong> {order?.userId}</p>
                                <p><strong>Tổng đơn hàng:</strong> {order?.totalAmount}</p>
                                <p><strong>Địa chỉ:</strong> {order?.shippingAddressId}</p>
                                <p><strong>Thanh toán:</strong> {order?.paymentMethod}</p>
                                <p><strong>Trạng thái:</strong> {order?.status}</p>
                                <p><strong>Mô t��:</strong> {order?.description}</p>
                                <p><strong>Ngày tạo:</strong> {moment(order?.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card bordered={false}>
                                <h3>Sản phẩm trong đơn hàng</h3>
                                {products.map((product, index) => (
                                    <Card key={index} className="product-item" style={{ marginBottom: '16px' }}>
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <Image
                                                    width={100}
                                                    src={product.image}
                                                    alt={product.title}
                                                />
                                            </Col>
                                            <Col span={18}>
                                                <p><strong>Sản phẩm ID:</strong> {product.id}</p>
                                                <p><strong>Tên sản phẩm:</strong> {product.title}</p>
                                                <p><strong>Tác giả:</strong> {product.author}</p>
                                                <p><strong>Nhà xuất bản:</strong> {product.publisher}</p>
                                                <p><strong>Giá:</strong> {product.price} VNĐ</p>
                                                <p><strong>Số lượng:</strong> {order.items[index].quantity}</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>

            <BackTop />
        </div>
    )
}

export default OrderDetail;
