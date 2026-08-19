// src/components/TextForm.js
import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

const TextForm = ({ formLabel, initialTexts, onTextsChange }) => {
  const [valuta, setValuta] = useState("€");
  const [texts, setTexts] = useState(initialTexts);
  const isFirstRun = useRef(true);

  // push changes up live, so a single shared submit button can render everything
  useEffect(() => {
    const mitEuro = texts.map((obj, index) => {
      if (index === 7 && obj.text !== "" && !isNaN(obj.text)) {
        return { ...obj, text: obj.text + valuta };
      }
      return obj;
    });
    onTextsChange(mitEuro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, valuta]);

  const handleChange = (index, field, value) => {
    const updatedTexts = [...texts];
    updatedTexts[index] = { ...updatedTexts[index], [field]: value };
    setTexts(updatedTexts);
  };

  const alegeValuta = (props) => {
    setValuta(props.valuta);
  };

  return (
    <div>
      <span style={{ fontWeight: "bold", fontSize: 18 }}>
        Formular {formLabel ? `— ${formLabel}` : ""}
      </span>
      <br />
      <br />
      {texts.map((textObj, index) => (
        <div
          key={index}
          style={{
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <label>{textObj.title}</label>
          <br />
          <input
            type="text"
            placeholder={"scrie..."}
            value={textObj.text}
            onChange={(e) => handleChange(index, "text", e.target.value)}
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              borderRadius: 8,
              border: "none",
              outline: 0,
            }}
          />
          <hr></hr>
        </div>
      ))}
      <div>
        <br></br>
        <span>Valuta:</span>
        <br></br>
        <button
          type="button"
          className="valutaButton"
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: valuta === "€" ? "#575757" : "#bababa",
            color: valuta === "€" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "€" })}
        >
          EUR
        </button>
        <button
          type="button"
          className="valutaButton"
          style={{
            borderRadius: 0,
            backgroundColor: valuta === "$" ? "#575757" : "#bababa",
            color: valuta === "$" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "$" })}
        >
          USD
        </button>
        <button
          type="button"
          className="valutaButton"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: valuta === "RON" ? "#575757" : "#bababa",
            color: valuta === "RON" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "RON" })}
        >
          RON
        </button>
      </div>
    </div>
  );
};

export default TextForm;
