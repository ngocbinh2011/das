import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Grid,
  GridItem,
  Flex,
  Spacer,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import bookApi from "../apis/bookApi";
import reviewApi from "../apis/reviewApi";
import { StarIcon } from "@chakra-ui/icons";
import { useCart } from '../context/CartContext';
import userApi from "../apis/userApi";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    bookApi.getDetailBook(id).then((response) => {
      setBook(response);
    });

    reviewApi.getReviewsByBookId(id).then((response) => {
      setReviews(response);
    });

    userApi.getAllUsers().then((response) => {
      setUsers(response);
    });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${book.title} đã được thêm vào giỏ hàng.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    navigate('/cart');
    toast({
      title: "Mua ngay",
      description: `Đã thêm ${book.title}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReviewSubmit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để gửi đánh giá.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newReview.rating === 0 || newReview.comment.trim() === "") {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn đánh giá và nhập bình luận.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    reviewApi.createReview({ bookId: id, userId: user.id, ...newReview }).then(() => {
      toast({
        title: "Đánh giá đã được gửi",
        description: "Cảm ơn bạn đã đánh giá.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Refresh reviews
      reviewApi.getReviewsByBookId(id).then((response) => {
        setReviews(response);
      });
      // Reset review form
      setNewReview({ rating: 0, comment: "" });
    });
  };

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
  };

  if (!book) return <Text>Loading...</Text>;

  return (
    <Box p={5} maxW="1100px" mx="auto" bg="white" boxShadow="xl" borderRadius="lg">
      {/* Breadcrumb */}
      <Breadcrumb mb={5} fontSize="sm" color="gray.600">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/books">Chi tiết sách</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{book.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Layout: Image & Details */}
      <Grid templateColumns={["1fr", "1fr 2fr"]} gap={8}>
        {/* Image Section */}
        <GridItem>
          <Image
            src={book.image}
            alt={book.title}
            borderRadius="lg"
            boxSize="100%"
            objectFit="cover"
            boxShadow="md"
          />
        </GridItem>

        {/* Details Section */}
        <GridItem>
          <VStack spacing={6} align="start">
            <Text fontWeight="bold" fontSize="3xl" color="gray.800">
              {book.title}
            </Text>
            <HStack spacing={4}>
              <Text fontSize="lg" color="gray.600">
                Tác giả: <strong>{book.author}</strong>
              </Text>
              <Spacer />
              <Text fontSize="lg" color="gray.600">
                Nhà xuất bản: <strong>{book.publisher}</strong>
              </Text>
            </HStack>

            <Text fontSize="lg" color="gray.600">
              Năm xuất bản: <strong>{book.publicationYear}</strong>
            </Text>

            <HStack spacing={3}>
              <Badge colorScheme="teal" variant="solid">Ngôn ngữ: {book.language}</Badge>
              <Badge colorScheme="purple" variant="solid">Thể loại: {book.genre}</Badge>
            </HStack>

            <Text fontSize="lg" color="gray.700" lineHeight="tall">
              {book.description}
            </Text>

            <Text color="red.500" fontWeight="bold" fontSize="4xl">
              {book.price} đ
            </Text>

            <VStack w="full" pt={6} alignItems="start" spacing={4}>
              <Flex w="full" alignItems="center" justify="space-between">
                <NumberInput
                  size="lg"
                  maxW={28}
                  defaultValue={1}
                  min={1}
                  value={quantity}
                  onChange={(value) => setQuantity(parseInt(value))}
                  mr={6}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <Flex w="full" alignItems="center" justify="space-between">
                <Button
                  leftIcon={<FiShoppingCart />}
                  colorScheme="red"
                  size="lg"
                  flex={1}
                  mr={6}
                  _hover={{ bg: "red.600" }}
                  width="full" // Ensures the button has enough width for the text
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  colorScheme="red"
                  size="lg"
                  flex={1}
                  mr={6}
                  _hover={{ bg: "red.600" }}
                  width="full" // Ensures the button has enough width for the text
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </Button>
                {(book.bookType === "ONLINE" || book.bookType === "AUDIO") && book.preview && (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    flex={1}
                    width="full" 
                    onClick={() => window.open(book.preview, "_blank")}
                  >
                    Preview
                  </Button>
                )}
              </Flex>
            </VStack>
          </VStack>
        </GridItem>
      </Grid>

      {/* Divider */}
      <Divider my={5} />

      {/* Additional Info */}
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white">
        <Text fontWeight="bold" fontSize="2xl" mb={4} color="teal.600">Thông tin chi tiết:</Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Text fontSize="lg" color="gray.700">Ngôn ngữ: <strong>{book.language}</strong></Text>
          </GridItem>
          <GridItem>
            <Text fontSize="lg" color="gray.700">Số lượng tồn kho: <strong>{book.stockQuantity}</strong></Text>
          </GridItem>
          <GridItem>
            <Text fontSize="lg" color="gray.700">Thể loại sách: <strong>{book.bookType}</strong></Text>
          </GridItem>
          <GridItem>
            <Text fontSize="lg" color="gray.700">Danh mục: <strong>{book?.categories?.name}</strong></Text>
          </GridItem>
        </Grid>
      </Box>

      {/* Reviews Section */}
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white">
        <Text fontWeight="bold" fontSize="2xl" mb={4} color="teal.600">Đánh giá:</Text>
        <VStack spacing={4} align="start">
          {reviews.map((review) => (
            <Box key={review.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white" width="100%">
              <Text fontWeight="bold" color="teal.600">Họ tên: {getUsernameById(review.userId)}</Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} color={i < review.rating ? "teal.500" : "gray.300"} />
                ))}
              </HStack>
              <Text fontSize="lg" color="gray.700" mt={2}>{review.comment}</Text>
            </Box>
          ))}
        </VStack>
        <Divider my={4} />
        <VStack spacing={4} align="start">
          <Text fontWeight="bold" fontSize="lg">Viết đánh giá của bạn:</Text>
          <HStack>
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                color={i < newReview.rating ? "teal.500" : "gray.300"}
                cursor="pointer"
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              />
            ))}
          </HStack>
          <Textarea
            placeholder="Viết bình luận của bạn..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <Button colorScheme="teal" onClick={handleReviewSubmit}>Gửi đánh giá</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default BookDetail;
