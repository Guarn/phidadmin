import React, { useState, useContext } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import styled from "styled-components";

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
const CustomToolbar = ({ id }) => {
  const [cs, setCs] = useState(false);
  return (
    <div
      id={`container-${id}`}
      style={{
        transition: "all 0.1s ease"
      }}
    >
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />

        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />

        <button className="ql-align" value="" />
        <button className="ql-align" value="center" />
        <button className="ql-align" value="right" />
        <button className="ql-align" value="justify" />

        <select className="ql-header">
          <option defaultValue="4">Normal</option>
          <option value="3">H3</option>
          <option value="2">H2</option>
          <option value="1">H1</option>
        </select>
        <button className="ql-link" />
        <button className="ql-script" value="super" />
        <select className="ql-color" />
        <select className="ql-background" />

        <button className="ql-blockquote" />

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
      </span>
      <div className="ql-formats">
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
      </div>
    </div>
  );
};

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

const IconeFlottante = styled.div`
  background-color: ${props => props.bg};
  height: 30px;
  width: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      theme: this.props.theme ? this.props.theme : "snow"
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.clickOutside.bind(this);
    this.cours = this.props.gauche
      ? this.props.state.listeCours[this.props.index].contenu[0]
      : this.props.droite
      ? this.props.state.listeCours[this.props.index].contenu[1]
      : this.props.state.listeCours[this.props.index];
    console.log(this.cours);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleChange = html => {
    this.props.setState({
      type: "UPDATE",
      value: html,
      index: this.props.index,
      direction: this.props.gauche ? 0 : this.props.droite ? 1 : null
    });
  };

  clickOutside = event => {
    if (
      !this.cours.readOnly &&
      this.state.theme !== "bubble" &&
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target)
    ) {
      this.props.setState({
        type: "UPDATE-RO",
        value: true,
        index: this.props.index,
        direction: this.props.gauche ? 0 : this.props.droite ? 1 : null
      });
    }
    if (
      this.props.state.options.select !== null &&
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target)
    ) {
      this.props.setState({ type: "SELECT", value: null });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.clickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
  }

  render() {
    return (
      <div
        ref={this.setWrapperRef}
        readOnly={this.cours.ReadOnly}
        onDoubleClick={() => {
          if (this.cours.readOnly) {
            this.props.setState({
              type: "UPDATE-RO",
              value: false,
              index: this.props.index,
              direction: this.props.gauche ? 0 : this.props.droite ? 1 : null
            });
          }
        }}
      >
        <div
          className="text-editor"
          style={{
            backgroundColor: this.cours.readOnly ? null : "white"
          }}
        >
          {!this.cours.readOnly && <CustomToolbar id={this.state.id} />}

          <ReactQuill
            value={this.cours.texte}
            onChange={val => {
              this.handleChange(val);
            }}
            modules={
              this.cours.readOnly
                ? { toolbar: null }
                : {
                    toolbar: {
                      container: `#container-${this.state.id}`,
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
                  }
            }
            readOnly={this.cours.readOnly}
            theme={this.cours.readOnly ? null : this.state.theme}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
