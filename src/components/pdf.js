import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styles from './pdf.module.css';
import '../styles/global.css';

import PdfToolbarFooter from "./PdfToolbarFooter";
import samplePDF from '../pdf/EclipseWeb-compressed.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export default function Pdf() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function onFullscreenChange() {
      console.log('fullscreen')
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    }
  }, []);

  const hidePageCanvas = useCallback(() => {
    const canvas = containerRef.current.querySelectorAll('canvas');
    console.log(canvas[0])
    if (canvas) {
      canvas[0].style.visibility = 'hidden';
      if (canvas[1])
      canvas[1].style.visibility = 'hidden';
    }
  }, [containerRef]);

  const showPageCanvas = useCallback(() => {
    const canvas = containerRef.current.querySelectorAll('canvas');
    if (canvas) {
      canvas[0].style.visibility = 'hidden';
      if (canvas[1])
      canvas[1].style.visibility = 'hidden';
    }
  }, [containerRef]);

  const onPageLoadSuccess = useCallback(() => {
    hidePageCanvas();
  }, [hidePageCanvas]);

  const onPageRenderSuccess = useCallback(() => {
    showPageCanvas();
  }, [showPageCanvas]);

  const onPageRenderError = useCallback(() => {
    showPageCanvas();
  }, [showPageCanvas]);


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(2);
  }


  const leftPage = pageNumber <= numPages ? pageNumber : 1;
  const rightPage = pageNumber + 1 <= numPages ? pageNumber + 1 : 1;
  console.log('pages:', leftPage, rightPage, numPages)

  return (
    <>
      <Document
        inputRef={containerRef}
        file={samplePDF}
        onLoadSuccess={onDocumentLoadSuccess}
        className={styles.pdfContainer}
      >

        <Page
          pageNumber={leftPage}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={false}
          scale={pageScale}
          className={`${styles["fade-in"]} ${styles.leftPage}`}
          devicePixelRatio={Math.min(2, window.devicePixelRatio)}
          onLoadSuccess={onPageLoadSuccess}
          onRenderSuccess={onPageRenderSuccess}
          onRenderError={onPageRenderError}
        />
        {rightPage !== 0 ? (
          <Page pageNumber={rightPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={false}
            scale={pageScale}
            className={`${styles["fade-in"]} ${styles.rightPage}`}
            onLoadSuccess={onPageLoadSuccess}
            onRenderSuccess={onPageRenderSuccess}
            onRenderError={onPageRenderError}
          />
        ) : <div></div>}

        <PdfToolbarFooter
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageScale={pageScale}
          setPageScale={setPageScale}
          isFullscreen={isFullscreen}
        />
      </Document>
    </>
  );
}
