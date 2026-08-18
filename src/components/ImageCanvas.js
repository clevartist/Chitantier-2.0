import { forwardRef, useEffect, useRef } from "react";
import albastru from "../chitanta_albastra.png";
import rosu from "../chitanta_rosie.png";
import verde from "../chitanta_verde.png";
import "../styles.css";

const ImageCanvas = forwardRef(({ texts }, mainCanvasRef) => {
  const subCanvasRefs = useRef([]);

  const canvases = [
    { rect: [0, 0, 1748, 982], bg: albastru },
    { rect: [0, 1263, 1748, 982], bg: rosu }, // Updated position
    { rect: [0, 2524, 1748, 982], bg: verde }, // Updated position
  ];

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const mainCTX = mainCanvas.getContext("2d");

    // Clear the main canvas
    mainCTX.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // Draw each sub-canvas onto the main canvas
    canvases.forEach((config, index) => {
      const subCanvas = subCanvasRefs.current[index];
      const subCTX = subCanvas.getContext("2d");

      // Clear and draw the background for the sub-canvas
      subCTX.clearRect(
        config.rect[0],
        config.rect[1],
        config.rect[2],
        config.rect[3]
      );

      const backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.src = config.bg;

      backgroundImage.onload = () => {
        subCTX.drawImage(backgroundImage, 0, 0, config.rect[2], config.rect[3]);

        // Loop through each text and draw it on the canvas
        texts.forEach(({ text, x, y, scale }) => {
          subCTX.fillStyle = "black";
          subCTX.font = scale;
          subCTX.textAlign = "left";
          subCTX.fillText(text, x, y);
        });

        // Draw the sub-canvas onto the main canvas after the image is loaded
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
