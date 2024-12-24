import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Link, Badge, Text,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, VStack, HStack,
} from '@chakra-ui/react';
import { FaBook, FaLink, FaUser, FaTags, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { ChevronRightIcon } from '@chakra-ui/icons';
import bookApi from '../apis/bookApi';
import { useNavigate } from 'react-router-dom';

const PurchasedBooks = () => {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      if (userId) {
        const response = await bookApi.getPurchasedBooksByUser(userId);
        setPurchasedBooks(response);
      }
    };
    fetchPurchasedBooks();
  }, [userId]);

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      {/* Breadcrumb */}
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={8}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang Chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Sách Đã Mua</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Heading */}
      <Heading as="h2" mb={8} textAlign="center" color="teal.600">
        Danh Sách Sách Đã Mua
      </Heading>

      {/* Description */}
      <Text mb={8} textAlign="center" fontSize="lg" color="gray.600">
        Đây là danh sách các sách bạn đã mua. Hãy tận hưởng việc đọc sách của bạn!
      </Text>

      {/* Book Table */}
      {purchasedBooks.length > 0 ? (
        <TableContainer border="1px" borderRadius="lg" boxShadow="lg" bg="white">
          <Table variant="simple" colorScheme="teal">
            <Thead>
              <Tr>
                <Th><Icon as={FaBook} mr={2} /> Ảnh Bìa</Th>
                <Th><Icon as={FaBook} mr={2} /> Tên Sách</Th>
                <Th><Icon as={FaUser} mr={2} /> Tác Giả</Th>
                <Th><Icon as={FaTags} mr={2} /> Thể Loại</Th>
                <Th><Icon as={FaTags} mr={2} /> Loại Sách</Th>
                <Th><Icon as={FaMoneyBillWave} mr={2} /> Giá</Th>
                <Th><Icon as={FaCalendarAlt} mr={2} /> Năm Xuất Bản</Th>
                <Th><Icon as={FaLink} mr={2} /> Liên Kết</Th>
              </Tr>
            </Thead>
            <Tbody>
              {purchasedBooks.map((book) => (
                <Tr key={book.id}>
                  <Td>
                    <img
                      src={book.image}
                      alt={book.title}
                      width="100"
                      height="150"
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  </Td>
                  <Td fontWeight="bold" color="teal.800">{book.title}</Td>
                  <Td>{book.author}</Td>
                  <Td>
                    <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
                      {book.genre}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
                      {book.bookType}
                    </Badge>
                  </Td>
                  <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}</Td>
                  <Td>{book.publicationYear}</Td>
                  {book.accessLink && book.bookType === 'ONLINE' && (
                    <Td>
                      <Link
                        onClick={() => {
                          console.log(book.accessLink);
                          navigate('/view-pdf', { state: { fileUrl: book.accessLink } });
                        }}
                        color="teal.500"
                        fontWeight="bold"
                        isExternal
                      >
                        Truy Cập
                      </Link>
                    </Td>
                  )}
                  {book.accessLink && book.bookType === 'AUDIO' && (
                    <Td>
                      <Link
                        onClick={() => {
                          navigate('/audio-book', { state: { audioUrl: book.accessLink } });
                        }}
                        color="teal.500"
                        fontWeight="bold"
                      >
                        Nghe Sách
                      </Link>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text mt={8} textAlign="center" color="gray.600" fontSize="lg">
          Không có sách nào được mua.
        </Text>
      )}

      {/* Footer */}
      <VStack mt={16} spacing={4} align="center">
        <Text fontSize="md" color="gray.500">
          Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi.
        </Text>
        <HStack>
          <Link href="/" color="teal.600" fontWeight="bold">
            Quay Lại Trang Chủ
          </Link>
          <Text color="gray.500">|</Text>
          <Link href="/help" color="teal.600" fontWeight="bold">
            Trợ Giúp
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PurchasedBooks;
