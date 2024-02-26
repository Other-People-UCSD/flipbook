import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import pdfStyles from './pdf.module.css';
import toolStyles from './pdftoolbarfooter.module.css';

import '../styles/global.css';

import PdfToolbarFooter from "./PdfToolbarFooter";
// import samplePDF from '../pdf/EclipseWeb-compressed.pdf';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { EmojiFlagsTwoTone } from '@mui/icons-material';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


export default function Pdf({ pdfObject }) {
  const pageOffset = 2;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageScale, setPageScale] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const canvasLeftRef = useRef(null);
  const canvasRightRef = useRef(null);
  const transformComponentRef = useRef(null);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
      realignTransform()
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    }
  }, []);

  const hidePageCanvas = useCallback(() => {
    const ctx = overlayRef.current.getContext('2d');
    ctx.filter = "blur(1px)";
    ctx.drawImage(overlayRef.current, 0, 0)
  }, []);

  const showPageCanvas = useCallback(() => {
    const oldLeft = canvasLeftRef.current;
    const oldRight = canvasRightRef.current;
    const ctx = overlayRef.current.getContext('2d');

    ctx.drawImage(oldLeft, 0, 0);

    const oldLeftW = oldLeft.width;
    const oldLeftH = oldLeft.height;
    const oldRightW = oldRight.width;
    const oldRightH = oldRight.height;


    overlayRef.current.width = oldLeftW + oldRightW;
    overlayRef.current.height = Math.max(oldLeftH, oldRightH);

    ctx.drawImage(oldLeft, 0, 0);
    ctx.drawImage(oldRight, oldLeftW, 0);

    oldLeft.style.width = 'inherit';
    oldLeft.style.height = 'inherit';
    oldRight.style.width = 'inherit';
    oldRight.style.height = 'inherit';

  }, []);

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

  const handlePrevPage = () => {
    const newPageNum = pageNumber - pageOffset;
    if (newPageNum <= 0) {
      setPageNumber(numPages)
    } else {
      setPageNumber(newPageNum)
    }
  }
  const handleNextPage = () => {
    const newPageNum = pageNumber + pageOffset;
    if (newPageNum > numPages) {
      setPageNumber(2)
    } else {
      setPageNumber(newPageNum)
    }
  }

  const leftPage = pageNumber <= numPages ? pageNumber : 1;
  const rightPage = pageNumber + 1 <= numPages ? pageNumber + 1 : 1;

  return (
    <>
      <TransformWrapper
        wheel={{ disabled: false }}
        pinch={{ disabled: false }}
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
            backgroundColor: '#41043922',
          }}
          contentStyle={{
            height: 'fit-content',
          }}
        >
          <Document
            inputRef={containerRef}
            file={pdfObject}
            onLoadSuccess={onDocumentLoadSuccess}
            className={`${pdfStyles.pdfContainer} ${pdfStyles.singleLayout}`}
          >
            <canvas
              id='docOverlay'
              ref={overlayRef}
              className={pdfStyles.docOverlay} />
            <Page
              canvasRef={canvasLeftRef}
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
              <Page
                canvasRef={canvasRightRef}
                pageNumber={rightPage}
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
        onClick={handlePrevPage}
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
        onClick={handleNextPage}
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
