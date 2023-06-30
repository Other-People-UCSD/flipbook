import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import pdfStyles from './pdf.module.css';
import toolStyles from './pdftoolbarfooter.module.css';

import '../styles/global.css';

import PdfToolbarFooter from "./PdfToolbarFooter";
import samplePDF from '../pdf/EclipseWeb-compressed.pdf';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


export default function Pdf() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const transformComponentRef = useRef(null);

  useEffect(() => {

    function onFullscreenChange() {
      console.log('fullscreen')
      setIsFullscreen(Boolean(document.fullscreenElement))
      // setPageScale(1.4)
      realignTransform()
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

  function realignTransform() {
    const { setTransform, centerView } = transformComponentRef.current;
    console.log(transformComponentRef.current)
    console.log(transformComponentRef.current.centerView)
    setTransform(0, 0, 1, 0);
    centerView(1, 100)
  }


  const leftPage = pageNumber <= numPages ? pageNumber : 1;
  const rightPage = pageNumber + 1 <= numPages ? pageNumber + 1 : 1;
  console.log('pages:', leftPage, rightPage, numPages)


  return (
    <>
      <TransformWrapper
        wheel={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
        initialScale={1}
        minScale={1}
        maxScale={1}
        onInit={realignTransform}
        ref={transformComponentRef}
      >
        <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: '100%',
        }}
          contentStyle={{
            width: '100%',
            height: 'fit-content'
          }}
        >
          <Document
            inputRef={containerRef}
            file={samplePDF}
            onLoadSuccess={onDocumentLoadSuccess}
            className={pdfStyles.pdfContainer}
          >

            <Page
              pageNumber={leftPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={false}
              scale={pageScale}
              className={`${pdfStyles["fade-in"]} ${pdfStyles.leftPage}`}
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
                className={`${pdfStyles["fade-in"]} ${pdfStyles.rightPage}`}
                onLoadSuccess={onPageLoadSuccess}
                onRenderSuccess={onPageRenderSuccess}
                onRenderError={onPageRenderError}
              />
            ) : <div></div>}
          </Document>
        </TransformComponent>
      </TransformWrapper>





      <IconButton
        className={`${toolStyles.leftArrow} ${toolStyles.arrow}`}
        onClick={() => setPageNumber(pageNumber - 2)}
        sx={{
          borderRadius: 0,
          position: 'absolute',
          left: '0',
          top: '0',
          height: '100%'
        }}>
        <KeyboardArrowLeftIcon
          sx={{ fontSize: '3rem', }} />
      </IconButton>

      <IconButton
        className={`${toolStyles.rightArrow} ${toolStyles.arrow}`}
        onClick={() => setPageNumber(pageNumber + 2)}
        sx={{
          borderRadius: 0,
          position: 'absolute',
          right: '0',
          top: '0',
          height: '100%'
        }}>
        <KeyboardArrowRightIcon
          sx={{ fontSize: '3rem' }} />
      </IconButton>

      <PdfToolbarFooter
        numPages={numPages}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageScale={pageScale}
        setPageScale={setPageScale}
        isFullscreen={isFullscreen}
        realignTransform={realignTransform}
      />
    </>
  );
}
