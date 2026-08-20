// src/App.js
import React, { useState, useRef, useEffect } from "react";
import TextForm from "./components/TextForm";
import ImageCanvas from "./components/ImageCanvas";
import "./styles.css";

const emptyTexts = () => [
  { title: "Chitanța Nr", text: "", x: 934, y: 376, scale: "55px Arial" },
  { title: "Data", text: "", x: 748, y: 460, scale: "40px Arial" },
  {
    title: "Anul 20...",
    text: "26",
    x: 1080,
    y: 460,
    scale: "40px Arial",
  },
  {
    title: "Am primit de la",
    text: "write here",
    x: 490,
    y: 586,
    scale: "38px Arial",
  },
  {
    title: "C.I.F.",
    text: "write here",
    x: 490,
    y: 660,
    scale: "38px Arial",
  },
  {
    title: "Adresa",
    text: "write here",
    x: 490,
    y: 737,
    scale: "38px Arial",
  },
  { title: "Suma de", text: "", x: 490, y: 812, scale: "38px Arial" },
  { title: "adica", text: "", x: 996, y: 812, scale: "38px Arial" },
  {
    title: "Reprezentând",
    text: "transport marfa com",
    x: 490,
    y: 890,
    scale: "38px Arial",
  },
];

// deep-ish clone of a texts array so editing chitanta 2/3 never mutates chitanta 1's objects
const cloneTexts = (texts) => texts.map((obj) => ({ ...obj }));

const App = () => {
  // one entry per active chitanță (always at least 1)
  const [textsList, setTextsList] = useState([emptyTexts()]);
  const [chitanta2, setChitanta2] = useState(false);
  const [chitanta3, setChitanta3] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const mainCanvasRef = useRef(null);

  // bump this to force TextForm (which owns its own internal state from initialTexts)
  // to re-read initialTexts when we prefill it programmatically
  const [formResetKey, setFormResetKey] = useState(0);

  const activeCount = 1 + (chitanta2 ? 1 : 0) + (chitanta3 ? 1 : 0);

  // toggle a `dark` class on <body> so CSS variables in styles.css take over
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleChitanta2 = () => {
    setChitanta2((prev) => {
      const next = !prev;
      setTextsList((list) => syncListLength(list, next, chitanta3));
      if (next) setFormResetKey((k) => k + 1);
      return next;
    });
  };

  const toggleChitanta3 = () => {
    setChitanta3((prev) => {
      const next = !prev;
      setTextsList((list) => syncListLength(list, chitanta2, next));
      if (next) setFormResetKey((k) => k + 1);
      return next;
    });
  };

  // keeps textsList length in sync with how many chitanțe are checked.
  // newly added slots are pre-filled with a clone of chitanta 1's current data,
  // instead of a blank emptyTexts(), so the user only edits the differences.
  const syncListLength = (list, c2, c3) => {
    const count = 1 + (c2 ? 1 : 0) + (c3 ? 1 : 0);
    const next = [...list];
    while (next.length < count) {
      const base = next[0] ? cloneTexts(next[0]) : emptyTexts();
      next.push(base);
    }
    while (next.length > count) next.pop();
    return next;
  };

  const onTextsChangeAt = (index) => (newTexts) => {
    setTextsList((list) => {
      const updated = [...list];
      updated[index] = newTexts;
      return updated;
    });
  };

  const exported_image_title = (() => {
    const numbers = textsList
      .slice(0, activeCount)
      .map((texts) => texts && texts[1] && texts[1].text)
      .filter((text) => text && text.trim() !== "");

    if (numbers.length === 0) return "exported-image";

    const label = textsList[0][1].title; // "Chitanța Nr"
    return `${label}-${numbers.join(", ")}`;
  })();

  const exportImage = (e) => {
    if (e) e.preventDefault();
    const canvas = document.getElementById("mainCanvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${exported_image_title}.png`;
    link.click();
  };

  return (
    <div>
      <h1>Editor de Chitante pentru Mama ♥</h1>

      <label className="dark-mode-toggle">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode((prev) => !prev)}
        />
        Mod întunecat
      </label>

      <div className="main-container">
        <div className="forms-row">
          <div className="form-container">
            <div className="chitanta-toggles">
              <label className="chitanta-checkbox">
                <input
                  type="checkbox"
                  checked={chitanta2}
                  onChange={toggleChitanta2}
                />
                Chitanța 2
              </label>
              <label className="chitanta-checkbox">
                <input
                  type="checkbox"
                  checked={chitanta3}
                  onChange={toggleChitanta3}
                  disabled={!chitanta2}
                />
                Chitanța 3
              </label>
            </div>

            <TextForm
              formLabel="Chitanța 1"
              initialTexts={textsList[0]}
              onTextsChange={onTextsChangeAt(0)}
            />
          </div>

          {chitanta2 && (
            <div className="form-container">
              <TextForm
                key={`c2-${formResetKey}`}
                formLabel="Chitanța 2"
                initialTexts={textsList[1]}
                onTextsChange={onTextsChangeAt(1)}
              />
            </div>
          )}

          {chitanta3 && (
            <div className="form-container">
              <TextForm
                key={`c3-${formResetKey}`}
                formLabel="Chitanța 3"
                initialTexts={textsList[2]}
                onTextsChange={onTextsChangeAt(2)}
              />
            </div>
          )}
        </div>

        <div className="preview-column">
          <ImageCanvas
            ref={mainCanvasRef}
            textsList={textsList}
            activeCount={activeCount}
          />
          <button type="button" className="primenit" onClick={exportImage}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
