import { forwardRef, useEffect, useRef } from "react";
import negru from "../chitanta_black.png";
import "../styles.css";

// native aspect ratio of the chitanta_black.png artwork — never distorted
const NATIVE_WIDTH = 1748;
const NATIVE_HEIGHT = 982;

const MAIN_WIDTH = 2480;
const MAIN_HEIGHT = 3508;

// slot size is FIXED at "1/3 of the page" always — this is the size that
// looked right with 3 chitanțe. activeCount only controls how many of
// these fixed-size slots get drawn, it never changes their size.
const BOX_HEIGHT = MAIN_HEIGHT / 3;
const BOX_WIDTH = MAIN_WIDTH;

const nativeAspect = NATIVE_WIDTH / NATIVE_HEIGHT;
const boxAspect = BOX_WIDTH / BOX_HEIGHT;

let DRAW_WIDTH, DRAW_HEIGHT;
if (boxAspect > nativeAspect) {
  // box is relatively wider than the receipt -> height is the limiting factor
  DRAW_HEIGHT = BOX_HEIGHT;
  DRAW_WIDTH = DRAW_HEIGHT * nativeAspect;
} else {
  // box is relatively taller/narrower than the receipt -> width is the limiting factor
  DRAW_WIDTH = BOX_WIDTH;
  DRAW_HEIGHT = DRAW_WIDTH / nativeAspect;
}

const SCALE = DRAW_WIDTH / NATIVE_WIDTH; // uniform scale factor, same for x and y
const OFFSET_X = (BOX_WIDTH - DRAW_WIDTH) / 2;
const OFFSET_Y = (BOX_HEIGHT - DRAW_HEIGHT) / 2;

const ImageCanvas = forwardRef(({ textsList, activeCount }, mainCanvasRef) => {
  const subCanvasRefs = useRef([]);

  // always 3 fixed-size slots exist in the DOM/canvas structure; only
  // `activeCount` are drawn/visible. Slot size/scale never depends on activeCount.
  const slots = [0, 1, 2].map((i) => ({
    box: [0, i * BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT],
    draw: [OFFSET_X, OFFSET_Y, DRAW_WIDTH, DRAW_HEIGHT],
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
      const [, , dw, dh] = config.draw;
      const subCTX = subCanvas.getContext("2d");
      subCTX.clearRect(0, 0, dw, dh);

      const isActive = index < activeCount;
      if (!isActive) return; // leave this slot blank in both preview and export

      const backgroundImage = new Image();
      backgroundImage.crossOrigin = "anonymous";
      backgroundImage.src = negru;

      backgroundImage.onload = () => {
        // draw the receipt at the fixed scale (no stretching)
        subCTX.drawImage(backgroundImage, 0, 0, dw, dh);

        // text x/y/scale are authored against the native 1748x982 artwork,
        // so scale them by the same fixed uniform factor as the image
        const texts = (textsList && textsList[index]) || [];
        texts.forEach(({ text, x, y, scale: fontScale }) => {
          subCTX.fillStyle = "black";
          const fontSizeMatch = fontScale.match(/^(\d+)px(.*)$/);
          if (fontSizeMatch) {
            const scaledSize = Math.round(
              parseInt(fontSizeMatch[1], 10) * SCALE
            );
            subCTX.font = `${scaledSize}px${fontSizeMatch[2]}`;
          } else {
            subCTX.font = fontScale;
          }
          subCTX.textAlign = "left";
          subCTX.fillText(text, x * SCALE, y * SCALE);
        });

        const [bx, by] = config.box;
        const [dx, dy] = config.draw;
        mainCTX.drawImage(subCanvas, bx + dx, by + dy);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {slots.map((config, index) => {
          const [, , dw, dh] = config.draw;
          return (
            <canvas
              key={index}
              ref={(el) => (subCanvasRefs.current[index] = el)}
              width={dw}
              height={dh}
              className="chitanta"
              style={{ display: index < activeCount ? "block" : "none" }}
            />
          );
        })}
      </div>
    </div>
  );
});

export default ImageCanvas;
