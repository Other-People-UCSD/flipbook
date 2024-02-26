import React, { useEffect, useState } from "react";
import '../styles/layout.css';
import Pdf from "./pdf.js";
import SpreadPdf from "./pdfSpread.js";

import pdfObject from '../pdf/EclipseWeb-compressed.pdf';
import copyright from "./copyright.js";
// import pdf2 from '../pdf/refraction.pdf';

export default function Layout() {
  // const [isSingle, setIsSingle] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(pdfObject);

  // const displayPdfDemo = () => {
  //   setIsSingle(!isSingle);
  // }

  useEffect(() => {
    copyright();
  });

  const handleSelect = (value) => {
    switch (value) {
      case ('eclipse'):
      default:
        setSelectedPdf(pdfObject);
        break;
      // case ('refraction'):
      //   setSelectedPdf(pdf2);
      //   break;

    }
  }


  return (
    <main className={'layoutContainer'} id="cr-article">
      {/* <div className={'top__info'}>
        <button
          onClick={displayPdfDemo}
          className={'optnBtn'}
        >
          {isSingle ? ("Single-paged pdf with spreads already made") : ("Single-paged pdf into double-page view")}
        </button>
        <label htmlFor="selectPdf" />
        <select id="selectPdf" name="selectPdf"
          className={'optnBtn'}
          onChange={(e) => handleSelect(e.currentTarget.value)}>
          <option value="eclipse">Eclipse</option>
          <option value="refraction">Refraction</option>
        </select>
      </div> */}
      {/* {isSingle ?
        (<Pdf pdfObject={selectedPdf} />)
        :
        (<SpreadPdf pdfObject={selectedPdf} />)
      } */}
      <Pdf pdfObject={selectedPdf} />
    </main>
  );
}