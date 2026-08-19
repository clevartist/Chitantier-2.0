import { forwardRef, useEffect, useRef } from "react";
import negru from "../chitanta_black.png";
import "../styles.css";

const SLOT_HEIGHT = 982;
const SLOT_WIDTH = 1748;
const MAIN_WIDTH = 2480;
const MAIN_HEIGHT = 3508;

const ImageCanvas = forwardRef(({ textsList, activeCount }, mainCanvasRef) => {
  const subCanvasRefs = useRef([]);

  // always 3 slots exist in the DOM/canvas structure; only `activeCount` are drawn/visible
  const slots = [0, 1, 2].map((i) => ({
    rect: [0, i * SLOT_HEIGHT, SLOT_WIDTH, SLOT_HEIGHT],
  }));

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const mainCTX = mainCanvas.getContext("2d");

    // canvas size is always fixed A4, regardless of how many chitanțe are active
    mainCTX.fillStyle = "white";
    mainCTX.fillRect(0, 0, MAIN_WIDTH, MAIN_HEIGHT);

    slots.forEach((config, index) => {
      const subCanvas = subCanvasRefs.current[index];
      if (!subCanvas) return;
      const subCTX = subCanvas.getContext("2d");
      subCTX.clearRect(0, 0, config.rect[2], config.rect[3]);

      const isActive = index < activeCount;
      if (!isActive) return; // leave this slot blank in both preview and export

      const backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.src = negru;

      backgroundImage.onload = () => {
        subCTX.drawImage(backgroundImage, 0, 0, config.rect[2], config.rect[3]);

        const texts = (textsList && textsList[index]) || [];
        texts.forEach(({ text, x, y, scale }) => {
          subCTX.fillStyle = "black";
          subCTX.font = scale;
          subCTX.textAlign = "left";
          subCTX.fillText(text, x, y);
        });

        mainCTX.drawImage(subCanvas, config.rect[0], config.rect[1]);
      };
    });
  }, [textsList, activeCount]);

  return (
    <div>
      <div className="a4">
        <canvas
          id="mainCanvas"
          ref={mainCanvasRef}
          width={MAIN_WIDTH}
          height={MAIN_HEIGHT}
          style={{ display: "none" }}
        />
        {slots.map((config, index) => (
          <canvas
            key={index}
            ref={(el) => (subCanvasRefs.current[index] = el)}
            width={config.rect[2]}
            height={config.rect[3]}
            className="chitanta"
            style={{ display: index < activeCount ? "block" : "none" }}
          />
        ))}
      </div>
    </div>
  );
});

export default ImageCanvas;
