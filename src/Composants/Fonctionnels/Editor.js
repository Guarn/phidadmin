import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const FleG = () => <span>«</span>;
const FleD = () => <span>»</span>;
const Ag = () => <span>À</span>;
const Eg = () => <span>È</span>;
const Ea = () => <span>É</span>;
const Oe = () => <span>œ</span>;
const OE = () => <span>Œ</span>;
const Ae = () => <span>æ</span>;
const AE = () => <span>Æ</span>;
const CC = () => <span>Ç</span>;
const Insecable = () => (
  <span style={{ backgroundColor: "grey", color: "grey" }}>ii</span>
);

const FineInsecable = () => <span style={{ backgroundColor: "grey" }}> </span>;

function insertFleG() {
  let cursorPosition = this.quill.getSelection().index;
  let Length = this.quill.getSelection().length;
  let texteRempl = this.quill.getText(cursorPosition, Length);
  if (Length === 0) {
    this.quill.insertText(cursorPosition, "«&nbsp;");
    this.quill.setSelection(cursorPosition + 2);
  } else {
    if (
      texteRempl[texteRempl.length - 1] === " " ||
      texteRempl[texteRempl.length - 1] === " " ||
      texteRempl[texteRempl.length - 1] === " "
    ) {
      this.quill.insertText(cursorPosition + Length - 1, "&nbsp;»");
      this.quill.insertText(cursorPosition, "«&nbsp;");
      this.quill.setSelection(cursorPosition + Length + 3);
    } else {
      this.quill.insertText(cursorPosition + Length, "&nbsp;»");
      this.quill.insertText(cursorPosition, "«&nbsp;");
      this.quill.setSelection(cursorPosition + Length + 4);
    }
  }
}
function insertFleD() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, " »");
}
function insertAg() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "À");
}
function insertEg() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "È");
}
function insertEa() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "É");
}
function insertoe() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "œ");
}
function insertOE() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "Œ");
}
function insertae() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "æ");
}
function insertAE() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "Æ");
}
function insertCC() {
  let cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "Ç");
}
function insertInsecable() {
  let cursorPosition = this.quill.getSelection().index;
  if (this.quill.getSelection().length > 0) {
    this.quill.deleteText(cursorPosition, this.quill.getSelection().length);
    this.quill.insertText(cursorPosition, "&nbsp;");
    this.quill.setSelection(cursorPosition + 1);
  } else {
    this.quill.insertText(cursorPosition, "&nbsp;");
    this.quill.setSelection(cursorPosition + 1);
  }
}
function insertFineInsecable() {
  /*
    let cursorPosition = this.quill.getSelection().index;
    if (this.quill.getSelection().length > 0) {
        this.quill.deleteText(cursorPosition, this.quill.getSelection().length);
        this.quill.insertText(cursorPosition, "thinsp;");
        this.quill.setSelection(cursorPosition + 1);
    } else {
        this.quill.insertText(cursorPosition, "thinsp;");
        this.quill.setSelection(cursorPosition + 1);
    }*/
}
const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
    </span>
    <span className="ql-formats">
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-align" value="" />
      <button className="ql-align" value="center" />
      <button className="ql-align" value="right" />
      <button className="ql-align" value="justify" />
    </span>

    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button
        className="ql-FleG"
        style={{
          position: "relative",
          bottom: "10px",
          fontSize: "1.6em",
          fontWeight: "bold",
          fontFamily: "Roboto"
        }}
      >
        <FleG />
      </button>
      <button
        className="ql-FleD"
        style={{
          position: "relative",
          bottom: "10px",
          fontSize: "1.6em",
          fontWeight: "bold",
          fontFamily: "Roboto"
        }}
      >
        <FleD />
      </button>

      <button
        className="ql-Ag"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <Ag />
      </button>
      <button
        className="ql-Eg"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <Eg />
      </button>
      <button
        className="ql-Ea"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <Ea />
      </button>
      <button
        className="ql-Oe"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <Oe />
      </button>
      <button
        className="ql-OE"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <OE />
      </button>
      <button
        className="ql-Ae"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <Ae />
      </button>
      <button
        className="ql-AE"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <AE />
      </button>
      <button
        className="ql-CC"
        style={{ fontFamily: "Roboto", fontWeight: "bold" }}
      >
        <CC />
      </button>
      <button className="ql-Insecable">
        <Insecable />
      </button>
      <button className="ql-FineInsecable">
        <FineInsecable />
      </button>
    </span>
  </div>
);

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
];
Quill.register(Font, true);

class Editor extends React.Component {
  state = { editorHtml: "" };

  handleChange = html => {
    this.setState({ editorHtml: html });
  };

  static modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        FleG: insertFleG,
        FleD: insertFleD,
        Ag: insertAg,
        Eg: insertEg,
        Ea: insertEa,
        Oe: insertoe,
        OE: insertOE,
        Ae: insertae,
        AE: insertAE,
        CC: insertCC,
        Insecable: insertInsecable,
        FineInsecable: insertFineInsecable
      }
    }
  };

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          value={this.props.value}
          onChange={this.props.changement}
          modules={Editor.modules}
        />
      </div>
    );
  }
}

export default Editor;
