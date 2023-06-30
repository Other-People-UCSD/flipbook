import React from "react";
import Pdf from "./pdf.js";
import '../styles/layout.css';

export default function Layout() {
  return (
    <main className={'layoutContainer'}>
      <Pdf />
    </main>
  );
}