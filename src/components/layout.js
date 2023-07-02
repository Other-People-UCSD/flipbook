import React, { useState } from "react";
import Pdf from "./pdf.js";
import '../styles/layout.css';
import SpreadPdf from "./pdfSpread.js";

export default function Layout() {
  const [isSingle, setIsSingle] = useState(true);

  const displayPdfDemo = () => {
    setIsSingle(!isSingle);
  }
  return (
    <main className={'layoutContainer'}>
      <button
        onClick={displayPdfDemo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: 'fit-content',
          zIndex: 1
        }}
      >
        {isSingle ? ("Single-paged pdf with spreads already made") : ("Single-paged pdf into double-page view")}
      </button>
      <p style={{ color: "white"}}>Unresolved: pdf shifting right on page change. Fixes itself after clicking a full cycle through the pdf.</p>
      {isSingle ?
        (<Pdf />)
        :
        (<SpreadPdf />)
      }
    </main>
  );
}