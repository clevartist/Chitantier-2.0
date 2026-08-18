// src/components/TextForm.js
import React, { useState } from "react";
import "../styles.css";

const TextForm = ({ onTextsChange, exportImage }) => {
  const [valuta, setValuta] = useState("€");
  const [texts, setTexts] = useState([
    {
      title: "Nr. (ignora)",
      text: "",
      x: 1300,
      y: 163,
      scale: "30px Arial",
    },
    {
      title: "Chitanța Nr",
      text: "",
      x: 934,
      y: 376,
      scale: "55px Arial",
    },
    {
      title: "Data",
      text: "",
      x: 748,
      y: 460,
      scale: "40px Arial",
    },
    {
      title: "Anul 20...",
      text: "",
      x: 1080,
      y: 460,
      scale: "40px Arial",
    },
    {
      title: "Am primit de la",
      text: "",
      x: 490,
      y: 586,
      scale: "38px Arial",
    },
    {
      title: "C.I.F.",
      text: "",
      x: 490,
      y: 660,
      scale: "38px Arial",
    },
    {
      title: "Adresa",
      text: "",
      x: 490,
      y: 737,
      scale: "38px Arial",
    },
    {
      title: "Suma de",
      text: "",
      x: 490,
      y: 812,
      scale: "38px Arial",
    },
    {
      title: "adica",
      text: "",
      x: 996,
      y: 812,
      scale: "38px Arial",
    },
    {
      title: "Reprezentând",
      text: "",
      x: 490,
      y: 890,
      scale: "38px Arial",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updatedTexts = [...texts];
    updatedTexts[index][field] = value;
    setTexts(updatedTexts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mitEuro = texts.map((obj, index) => {
      if (index === 7 && !isNaN(obj.text)) {
        return { ...obj, text: obj.text + valuta };
      }
      return obj;
    });

    onTextsChange(mitEuro);
  };

  const alegeValuta = (props) => {
    setValuta(props.valuta);
  };

  return (
    <form onSubmit={handleSubmit}>
      <span style={{ fontWeight: "bold", fontSize: 18 }}>Formular</span>
      <br></br>
      <br></br>
      {texts.map((textObj, index) => (
        <div
          key={index}
          style={{
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <label>{textObj.title}</label>
          <br></br>
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
          className="valutaButton"
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: valuta == "€" ? "#575757" : "#bababa",
            color: valuta == "€" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "€" })}
        >
          EUR
        </button>
        <button
          className="valutaButton"
          style={{
            borderRadius: 0,
            backgroundColor: valuta == "$" ? "#575757" : "#bababa",
            color: valuta == "$" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "$" })}
        >
          USD
        </button>
        <button
          className="valutaButton"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: valuta == "RON" ? "#575757" : "#bababa",
            color: valuta == "RON" ? "white" : "black",
          }}
          onClick={() => alegeValuta({ valuta: "RON" })}
        >
          RON
        </button>
      </div>
      <br></br>
      <button type="submit" className="primenit">
        Aplică
      </button>
      <br></br>
      <br></br>
      <button onClick={exportImage} className="primenit">
        Salvează
      </button>
    </form>
  );
};

export default TextForm;
