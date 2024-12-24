import React from 'react';
import { Box, Container, Heading, Text, Stack, Image, Divider } from '@chakra-ui/react';

const About = () => {
  return (
    <Box bg="gray.50" color="gray.700" py={10}>
      <Container maxW="6xl">
        <Stack spacing={8} align="center">
          <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
            Giới thiệu về BookSphere
          </Heading>
          <Image
            src="https://aeonmall-long-bien.com.vn/wp-content/uploads/2022/01/269302567_4487714621350494_4627200227809060552_n.jpg"
            alt="BookSphere"
            borderRadius="md"
            boxShadow="lg"
            maxW="80%"
          />
          <Divider borderColor="gray.300" />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Chào mừng bạn đến với BookSphere, trang web bán sách trực tuyến hàng đầu. Chúng tôi cung cấp một loạt các đầu sách từ nhiều thể loại khác nhau, từ văn học cổ điển đến khoa học viễn tưởng, từ sách thiếu nhi đến sách chuyên ngành. Sứ mệnh của chúng tôi là mang đến cho bạn những trải nghiệm đọc sách tuyệt vời nhất.
          </Text>
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Tại BookSphere, chúng tôi tin rằng sách là nguồn tri thức vô tận và là người bạn đồng hành đáng tin cậy trong cuộc sống. Hãy cùng chúng tôi khám phá thế giới sách và tìm kiếm những cuốn sách yêu thích của bạn.
          </Text>
          <Divider borderColor="gray.300" />
          <Text fontSize="md" textAlign="center" color="gray.500">
            "Một cuốn sách hay là một người bạn thông thái." - G. Whittier
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default About; 