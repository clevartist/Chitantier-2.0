import "../styles.css";
export default function FileTab({ exportImage, printImage }) {
  return (
    <>
      <button onClick={exportImage} className="primenit">
        Salvează
      </button>
      <button onClick={printImage} className="new-chitanta">
        Print
      </button>
      <button
        onClick={() => window.location.reload(false)}
        className="new-chitanta"
      >
        Chitanță nouă
      </button>
    </>
  );
}
