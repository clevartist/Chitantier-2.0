import { forwardRef, useEffect, useRef } from "react";
import negru from "../chitanta_black.png";
import "../styles.css";

const ImageCanvas = forwardRef(({ texts }, mainCanvasRef) => {
  const subCanvasRefs = useRef([]);

  const canvases = [
    { rect: [0, 0, 1748, 982], bg: negru },
    { rect: [0, 982, 1748, 982], bg: negru },
    { rect: [0, 1964, 1748, 982], bg: negru },
  ];

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const mainCTX = mainCanvas.getContext("2d");

    mainCTX.fillStyle = "white";
    mainCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    canvases.forEach((config, index) => {
      const subCanvas = subCanvasRefs.current[index];
      const subCTX = subCanvas.getContext("2d");

      subCTX.clearRect(0, 0, config.rect[2], config.rect[3]);

      const backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.src = config.bg;

      backgroundImage.onload = () => {
        subCTX.drawImage(backgroundImage, 0, 0, config.rect[2], config.rect[3]);

        texts.forEach(({ text, x, y, scale }) => {
          subCTX.fillStyle = "black";
          subCTX.font = scale;
          subCTX.textAlign = "left";
          subCTX.fillText(text, x, y);
        });

        mainCTX.drawImage(subCanvas, config.rect[0], config.rect[1]);
      };
    });
  }, [texts]);

  return (
    <div>
      <div className="a4">
        <canvas
          id="mainCanvas"
          ref={mainCanvasRef}
          width={2480}
          height={3508}
          style={{
            display: "none",
          }}
        />
        {canvases.map((config, index) => (
          <canvas
            key={index}
            ref={(el) => (subCanvasRefs.current[index] = el)}
            width={config.rect[2]}
            height={config.rect[3]}
            className="chitanta"
          />
        ))}
      </div>
    </div>
  );
});

export default ImageCanvas;
