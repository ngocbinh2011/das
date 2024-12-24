import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Image,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import 'firebase/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import bookApi from '../../apis/bookApi';
import categoryApi from '../../apis/categoryApi';
import { storage } from '../../config/FirebaseConfig';
import "./productList.css";

const { Option } = Select;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [image, setImage] = useState();
    const [bookType, setBookType] = useState("PRINT");
    const [accessLink, setAccessLink] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const createBook = async (bookData) => {
        try {
            const response = await bookApi.createBook(bookData);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Tạo sách thành công',
                });
                handleProductList();
                setOpenModalCreate(false);
            }
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Tạo sách thất bại',
            });
        }
    }

    const handleProductList = async () => {
        try {
            const res = await bookApi.getListBooks();
            setProducts(res);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        }
    }

    const handleCategoryList = async () => {
        try {
            const res = await categoryApi.getListCategory();
            setCategories(res);
        } catch (error) {
            console.log('Failed to fetch category list:' + error);
        }
    }

    const handleCancel = () => {
        setOpenModalCreate(false);
        setOpenModalUpdate(false);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        const bookData = {
            title: values.title,
            author: values.author,
            publisher: values.publisher,
            publicationYear: values.publicationYear,
            genre: values.genre,
            language: values.language,
            preview: values.preview,
            image: image,
            categories: {
                id: values.categoryId,
                name: categories.find(cat => cat.id === values.categoryId)?.name
            },
            description: values.description,
            price: values.price,
            stockQuantity: values.stockQuantity,
            status: values.status,
            bookType: values.bookType,
            accessLink: bookType !== 'PRINT' ? accessLink : undefined
        };
        await createBook(bookData);
        setLoading(false);
    }

    const handleEditBook = async (bookId) => {
        setOpenModalUpdate(true);
        try {
            const response = await bookApi.getDetailBook(bookId);
            setId(bookId);
            form2.setFieldsValue({
                title: response.title,
                author: response.author,
                publisher: response.publisher,
                publicationYear: response.publicationYear,
                genre: response.genre,
                language: response.language,
                categoryId: response.categories.id,
                description: response.description,
                price: response.price,
                stockQuantity: response.stockQuantity,
                status: response.status,
                bookType: response.bookType,
                preview: response.preview
            });
            setAccessLink(response.accessLink);
            setBookType(response.bookType);
            setImage(response.image)
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Lấy thông tin sách thất bại',
            });
        }
    };

    const handleUpdateBook = async (values) => {
        setLoading(true);
        const bookData = {
            title: values.title,
            author: values.author,
            publisher: values.publisher,
            publicationYear: values.publicationYear,
            genre: values.genre,
            language: values.language,
            preview: values.preview,
            image: image,
            categories: {
                id: values.categoryId,
                name: categories.find(cat => cat.id === values.categoryId)?.name
            },
            description: values.description,
            price: values.price,
            stockQuantity: values.stockQuantity,
            status: values.status,
            bookType: values.bookType,
            accessLink: bookType !== 'PRINT' ? accessLink : undefined
        };
        try {
            await bookApi.updateBook(id, bookData);
            notification["success"]({
                message: `Thông báo`,
                description: 'Cập nhật sách thành công',
            });
            handleProductList();
            setOpenModalUpdate(false);
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Cập nhật sách thất bại',
            });
        }
        setLoading(false);
    };

    const handleDeleteBook = async (bookId) => {
        setLoading(true);
        try {
            await bookApi.deleteBook(bookId);
            notification["success"]({
                message: `Thông báo`,
                description: 'Xóa sách thành công',
            });
            handleProductList();
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Xóa sách thất bại',
            });
            setLoading(false);
        }
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setImage(url);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
        setLoading(false);
    };

    const handleChangeFile = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `files/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setAccessLink(url);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
        setLoading(false);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => index + 1,
        },

        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <Image src={text} alt="book cover" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher',
            key: 'publisher',
        },
        {
            title: 'Năm xuất bản',
            dataIndex: 'publicationYear',
            key: 'publicationYear',
        },
        {
            title: 'Thể loại',
            dataIndex: 'genre',
            key: 'genre',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số lượng tồn kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Loại sách',
            dataIndex: 'bookType',
            key: 'bookType',
            render: (text) => {
                let color;
                switch (text) {
                    case 'PRINT':
                        color = 'green';
                        break;
                    case 'ONLINE':
                        color = 'blue';
                        break;
                    case 'AUDIO':
                        color = 'orange';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{text === 'PRINT' ? 'In' : text === 'ONLINE' ? 'Online' : 'Audio'}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{ width: 150, borderRadius: 15, height: 30, marginBottom: 10 }}
                        onClick={() => handleEditBook(record.id)}
                    >
                        {"Chỉnh sửa"}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn xóa sách này?"
                        onConfirm={() => handleDeleteBook(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                        >
                            {"Xóa"}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    useEffect(() => {
        handleProductList();
        handleCategoryList();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <span>Danh sách sản phẩm</span>
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
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={(e) => handleSearch(e.target.value)}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sách</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={filteredProducts} />
                    </div>
                </div>

                <Modal
                    title="Tạo sách mới"
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
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="bookCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Tác giả"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input placeholder="Tác giả" />
                        </Form.Item>
                        <Form.Item
                            name="publisher"
                            label="Nhà xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                        >
                            <Input placeholder="Nhà xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="publicationYear"
                            label="Năm xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                        >
                            <Input type="number" placeholder="Năm xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="genre"
                            label="Thể loại"
                            rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
                        >
                            <Input placeholder="Thể loại" />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ"
                            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                        >
                            <Input placeholder="Ngôn ngữ" />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' }]}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <Input type="number" placeholder="Giá" />
                        </Form.Item>
                        <Form.Item
                            name="stockQuantity"
                            label="Số lượng tồn kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                        >
                            <Input type="number" placeholder="Số lượng tồn kho" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="ACTIVE">Kích hoạt</Option>
                                <Option value="INACTIVE">Không kích hoạt</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="bookType"
                            label="Loại sách"
                            rules={[{ required: true, message: 'Vui lòng chọn loại sách!' }]}
                        >
                            <Select placeholder="Chọn loại sách" onChange={setBookType}>
                                <Option value="PRINT">In</Option>
                                <Option value="ONLINE">Online</Option>
                                <Option value="AUDIO">Audio</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="accessLink"
                            label="Liên kết truy cập"
                            rules={[{ required: bookType === 'AUDIO' || bookType === 'ONLINE', message: 'Vui lòng nhập liên kết truy cập!' }]}
                        >
                            <input type="file" onChange={handleChangeFile}
                                id="accessLink" name="file"
                                accept="*/*" />
                        </Form.Item>
                        <Form.Item
                            name="preview"
                            label="Preview"
                            rules={[{ required: bookType === 'AUDIO' || bookType === 'ONLINE', message: 'Vui lòng nhập liên kết truy cập!' }]}
                        >
                            <Input placeholder="Nhập liên kết truy cập" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa sách"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateBook(values);
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
                        name="bookUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Tác giả"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input placeholder="Tác giả" />
                        </Form.Item>
                        <Form.Item
                            name="publisher"
                            label="Nhà xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                        >
                            <Input placeholder="Nhà xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="publicationYear"
                            label="Năm xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                        >
                            <Input type="number" placeholder="Năm xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="genre"
                            label="Thể loại"
                            rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
                        >
                            <Input placeholder="Thể loại" />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ"
                            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                        >
                            <Input placeholder="Ngôn ngữ" />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <Input type="number" placeholder="Giá" />
                        </Form.Item>
                        <Form.Item
                            name="stockQuantity"
                            label="Số lượng tồn kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                        >
                            <Input type="number" placeholder="Số lượng tồn kho" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="ACTIVE">Kích hoạt</Option>
                                <Option value="INACTIVE">Không kích hoạt</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="bookType"
                            label="Loại sách"
                            rules={[{ required: true, message: 'Vui lòng chọn loại sách!' }]}
                        >
                            <Select placeholder="Chọn loại sách" onChange={setBookType}>
                                <Option value="PRINT">In</Option>
                                <Option value="ONLINE">Online</Option>
                                <Option value="AUDIO">Audio</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="accessLink"
                            label="Liên kết truy cập"
                        >
                            <input type="file" onChange={handleChangeFile}
                                id="accessLink" name="file"
                                accept="*/*" />
                        </Form.Item>

                        <Form.Item
                            name="preview"
                            label="Preview"
                        >
                            <Input placeholder="Nhập liên kết truy cập" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default ProductList;