// src/App.js
import React, { useState, useRef } from "react";
import TextForm from "./components/TextForm";
import ImageCanvas from "./components/ImageCanvas";
import FileTab from "./components/FileTab";
import "./styles.css";
import { useReactToPrint } from "react-to-print";

const App = () => {
  const [texts, setTexts] = useState([]);
  const mainCanvasRef = useRef(null);

  const exported_image_title =
    texts && texts.length > 0
      ? `${texts[1].title}-${texts[1].text}`
      : "exported-image";

  const onTextChange = (newTexts) => {
    setTexts(newTexts);
  };

  const exportImage = () => {
    const canvas = document.getElementById("mainCanvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${exported_image_title}.png`;
    link.click();
  };

  const printImage = useReactToPrint({
    content: () => mainCanvasRef.current,

    onBeforeGetContent: () => {
      mainCanvasRef.current.style.display = "block";
    },

    onAfterPrint: () => {
      mainCanvasRef.current.style.display = "none";
    },
  });

  return (
    <div>
      <h1>Editor de Chitante pentru Mama ♥</h1>
      <div className="main-container">
        <div className="form-container">
          <TextForm onTextsChange={onTextChange} exportImage={exportImage} />
        </div>
        <div>
          <ImageCanvas ref={mainCanvasRef} texts={texts} />
        </div>
        <div className="right-buttons-container">
          <FileTab exportImage={exportImage} printImage={printImage} />
        </div>
      </div>
    </div>
  );
};

export default App;
