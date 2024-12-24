import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFViewer, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer';
import { Box, Spinner, Text } from '@chakra-ui/react';
import 'pdfjs-dist/web/pdf_viewer.css';

// Cấu hình worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PDFViewerComponent = ({ pdfUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfUrl) {
        setError('Không tìm thấy liên kết sách.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const container = containerRef.current;
        if (!container) {
          throw new Error('Container không tồn tại.');
        }

        const pdfLinkService = new PDFLinkService();
        const pdfViewer = new PDFViewer({
          container,
          linkService: pdfLinkService,
        });

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        pdfLinkService.setDocument(pdf);
        pdfViewer.setDocument(pdf);

        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải PDF:', err);
        setError('Không thể tải PDF. Vui lòng thử lại.');
        setLoading(false);
      }
    };

    if (containerRef.current) {
      loadPDF();
    }

    return () => {
      setLoading(false);
      setError(null);
    };
  }, [pdfUrl]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4} fontSize="lg" color="gray.600">
          Đang tải sách...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8} color="red.500">
        <Text fontSize="lg">{error}</Text>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100%',
        height: '80vh',
        overflow: 'auto',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default PDFViewerComponent;
