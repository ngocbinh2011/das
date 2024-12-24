import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    HomeOutlined,
    NotificationTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Row,
    Spin
} from 'antd';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'; 
import bookApi from '../../apis/bookApi';
import categoryApi from '../../apis/categoryApi';
import orderApi from '../../apis/orderApi'; 
import promotionsApi from '../../apis/promotionsApi';
import "./dashBoard.css";

const DashBoard = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promotionTotal, setPromotionTotal] = useState();
    const [bookTotal, setBookTotal] = useState(null);
    const [orderTotal, setOrderTotal] = useState(null);
    const [revenueData, setRevenueData] = useState([]); 

    useEffect(() => {
        (async () => {
            try {
                const promotions = await promotionsApi.getListPromotions();
                console.log(promotions);
                setPromotionTotal(promotions);

                const books = await bookApi.getListBooks();
                console.log(books);
                setBookTotal(books);

                const categories = await categoryApi.getListCategory();
                console.log(categories);
                setCategoryList(categories);

                const orders = await orderApi.getListOrder();
                console.log(orders);
                setOrderTotal(orders);

                // Calculate revenue data from orders
                const revenueMap = {};
                orders.forEach(order => {
                    const date = new Date(order.createdAt);
                    const month = date.toLocaleString('default', { month: 'long' }); // Get month name
                    const year = date.getFullYear();
                    const key = `${month} ${year}`;

                    if (!revenueMap[key]) {
                        revenueMap[key] = 0;
                    }
                    revenueMap[key] += order.totalAmount; // Sum totalAmount for each month
                });

                // Convert revenueMap to array for chart
                const revenueArray = Object.keys(revenueMap).map(month => ({
                    name: month,
                    revenue: revenueMap[month],
                }));

                setRevenueData(revenueArray);

                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch data:', error);
                setLoading(false);
            }
        })();
    }, []);

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
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{categoryList?.length}</div>
                                        <div className='title_total'>Số danh mục</div>
                                    </div>
                                    <div>
                                        <ContactsTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{promotionTotal?.length}</div>
                                        <div className='title_total'>Tổng khuyến mãi</div>
                                    </div>
                                    <div>
                                        <NotificationTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{bookTotal?.length || 0} </div>
                                        <div className='title_total'>Tổng sách</div>
                                    </div>
                                    <div>
                                        <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{orderTotal?.length || 0} </div>
                                        <div className='title_total'>Tổng đơn hàng</div>
                                    </div>
                                    <div>
                                        <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Chart Container */}
                    <div className="chart-container">
                        <div className="chart-card">
                            <h3 className="chart-title">Doanh thu theo tháng</h3>
                            <BarChart width={500} height={300} data={revenueData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </div>

                        <div className="chart-card">
                            <h3 className="chart-title">Doanh thu phân bổ</h3>
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={revenueData}
                                    dataKey="revenue"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {revenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    );
}

export default DashBoard;
