import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import "./ViewPdf.css"
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`;

const ViewPdf = () => {
  const location = useLocation();
  const pdfContainerRef = useRef(null);
  const fileUrl = location.state?.fileUrl;

  useEffect(() => {
    if (!fileUrl) {
      window.location.href = '/';
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'p') || e.key === 'P') {
        e.preventDefault();
        alert('Chức năng không được phép!');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileUrl]);

  useEffect(() => {
    const renderPdf = async () => {
      if (fileUrl) {
        try {
          const loadingTask = pdfjsLib.getDocument(fileUrl);
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          pdfContainerRef.current.innerHTML = '';

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;

            pdfContainerRef.current.appendChild(canvas);
          }
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      }
    };

    renderPdf();
  }, [fileUrl]);


  return (
    <div className="pdf-viewer-container">
      <div ref={pdfContainerRef} className="pdf-viewer"></div>
    </div>
  );
};

export default ViewPdf;
