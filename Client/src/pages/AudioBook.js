import React, { useState } from 'react';
import { Box, Text, Button, Flex, IconButton, Stack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioBook = () => {
  const location = useLocation();
  const { audioUrl } = location.state || {};
  
  const [audio] = useState(new Audio(audioUrl));
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Box p={8} bg="gray.50" borderRadius="md" boxShadow="md">
      <Text fontSize="2xl" mb={4} textAlign="center">Nghe Sách Audio</Text>
      {audioUrl ? (
        <Flex justify="center" align="center">
          <IconButton
            aria-label={isPlaying ? 'Dừng' : 'Phát'}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlay}
            colorScheme={isPlaying ? 'red' : 'green'}
            size="lg"
            mr={4}
          />
          <Text fontSize="lg">{isPlaying ? 'Đang phát' : 'Nhấn để phát'}</Text>
        </Flex>
      ) : (
        <Text color="red.500" textAlign="center">Không có liên kết audio.</Text>
      )}
    </Box>
  );
};

export default AudioBook; 