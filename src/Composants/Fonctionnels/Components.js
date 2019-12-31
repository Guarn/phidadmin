import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSlate } from "slate-react";
import { GithubPicker } from "react-color";
import { Icon } from "antd";

//SECTION STYLED COMPONENTS

const BarreOutilsConteneur = styled.div`
  position: absolute;
  top: -50px;
  left: -2px;
  background-color: #707070;
  height: 46px;
  border-radius: 5px;
  display: flex;
  box-shadow: 0 0 5px;
`;
const Outils = styled.div`
  position: relative;
  width: 45px;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "century gothic";
  font-size: 24px;
  color: white;
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;
export const Separateur = styled.div`
  width: 1px;
  background-color: #a59d75;
`;
const RectSelect = styled.div`
  position: absolute;
  width: ${props => (props.selected ? "35px" : "0px")};
  height: 3px;
  bottom: 2px;
  left: 5px;
  border-radius: 3px;
  background-color: #ffda48;
  transition: all 0.2s;
  transform: ${props =>
    props.selected ? "translate3d(0,0,0)" : "translate3d(17px,0,0)"};
`;

const ConteneurChoixCouleur = styled.div`
  position: absolute;
  transition: all 0.2s;
  bottom: ${props => (props.actif ? "-30px" : "2px")};
  height: 20px;
  left: 20px;
  width: ${props => props.children.length * 20 + "px"};
  padding: 5px;
  background: #b1b1b1;
  border-radius: 0px 0px 5px 5px;
  display: flex;
  z-index: -1;
`;

const Couleur = styled.div`
  cursor: pointer;
  height: 20px;
  width: 20px;
  background-color: ${props => props.type};
  box-sizing: border-box;
  transform: scale(1);
  transition: all 0.2s;
  z-index: 1;

  &:hover {
    border: 2px solid white;
    box-shadow: 0 0 10px grey;
    transform: scale(1.2);
    z-index: 100;
  }
`;

const Triangle = styled.div`
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0px 10px 10px 10px;
  position: absolute;
  top: -10px;
  left: 50%;
  margin-left: -10px;
  border-color: transparent transparent white;
`;

//!SECTION

export const BarreOutils = ({ children }) => {
  return <BarreOutilsConteneur>{children}</BarreOutilsConteneur>;
};

export const FormatGras = ({ selected }) => {
  const editor = useSlate();
  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "bold" });
      }}
    >
      G
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatItalic = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "italic" });
      }}
      style={{ fontStyle: "italic" }}
    >
      I
      <RectSelect selected={selected} />
    </Outils>
  );
};
export const FormatCouleurTexte = ({ selected, couleurTexte }) => {
  const editor = useSlate();
  const refCouleur = useRef(null);
  const [couleur, setCouleur] = useState(couleurTexte);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Outils
        onMouseDown={event => {
          event.preventDefault();

          if (menuVisible && !refCouleur.current.contains(event.target)) {
            editor.exec({
              type: "couleur",
              format: "couleurTexteActive",
              couleurTexte: couleur
            });
          }
        }}
        onMouseEnter={() => setMenuVisible(true)}
        onMouseLeave={() => setMenuVisible(false)}
      >
        <span
          style={{
            color:
              couleurTexte === "" || couleurTexte === "transparent"
                ? "#EB9694"
                : couleurTexte
          }}
        >
          A
        </span>
        {menuVisible && (
          <div
            style={{
              bottom: "-60px",
              left: "5px",
              position: "absolute",
              zIndex: "1000"
            }}
            ref={refCouleur}
          >
            <GithubPicker
              colors={[
                "white",
                "#B80000",
                "#DB3E00",
                "#FCCB00",
                "#008B02",
                "#006B76",
                "#1273DE",
                "#004DCF",
                "#5300EB",
                "black",
                "transparent",
                "#EB9694",
                "#FAD0C3",
                "#FEF3BD",
                "#C1E1C5",
                "#BEDADC",
                "#C4DEF6",
                "#BED3F3",
                "#D4C4FB",
                "lightgrey"
              ]}
              onChange={val => {
                setCouleur(val.hex);

                editor.exec({
                  type: "couleur",
                  format: "couleurTexteActive",
                  couleurTexte: val.hex
                });
              }}
              width={265}
            />
          </div>
        )}
        <RectSelect selected={selected} />
      </Outils>
    </>
  );
};

export const FormatCouleurBackground = ({ selected, couleurBackground }) => {
  const editor = useSlate();
  const refCouleur = useRef(null);
  const [couleur, setCouleur] = useState(couleurBackground);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Outils
        onMouseDown={event => {
          event.preventDefault();

          if (menuVisible && !refCouleur.current.contains(event.target)) {
            editor.exec({
              type: "couleur",
              format: "couleurBackgroundActive",
              couleurBackground: couleur
            });
          }
        }}
        onMouseEnter={() => setMenuVisible(true)}
        onMouseLeave={() => setMenuVisible(false)}
      >
        <span
          style={{
            backgroundColor:
              couleurBackground === "" || couleurBackground === "transparent"
                ? "#EB9694"
                : couleurBackground,
            borderRadius: "5px",
            paddingLeft: "2px",
            paddingRight: "2px",
            lineHeight: "30px"
          }}
        >
          A
        </span>
        {menuVisible && (
          <div
            style={{
              bottom: "-60px",
              left: "5px",
              position: "absolute",
              zIndex: "1000"
            }}
            ref={refCouleur}
          >
            <GithubPicker
              colors={[
                "white",
                "#B80000",
                "#DB3E00",
                "#FCCB00",
                "#008B02",
                "#006B76",
                "#1273DE",
                "#004DCF",
                "#5300EB",
                "black",
                "transparent",
                "#EB9694",
                "#FAD0C3",
                "#FEF3BD",
                "#C1E1C5",
                "#BEDADC",
                "#C4DEF6",
                "#BED3F3",
                "#D4C4FB",
                "lightgrey"
              ]}
              onChange={val => {
                setCouleur(val.hex);

                editor.exec({
                  type: "couleur",
                  format: "couleurBackgroundActive",
                  couleurBackground: val.hex
                });
              }}
              width={265}
            />
          </div>
        )}
        <RectSelect selected={selected} />
      </Outils>
    </>
  );
};
const ChoixCouleur = ({ actif, setCouleur, setMenuVisible }) => {
  function changementCouleur(event, couleur) {
    event.preventDefault();
    setCouleur(couleur);
  }
  return (
    <ConteneurChoixCouleur
      onMouseLeave={() => setMenuVisible(false)}
      actif={actif}
    >
      <Couleur onMouseDown={e => changementCouleur(e, "red")} type="red" />
      <Couleur onMouseDown={e => changementCouleur(e, "blue")} type="blue" />
      <Couleur type="yellow" />
      <Couleur type="green" />
      <Couleur type="lightgreen" />
      <Couleur type="salmon" />
      <Couleur type="lightsalmon" />
      <Couleur type="lightblue" />
      <Couleur type="red" />
    </ConteneurChoixCouleur>
  );
};

export const FormatAlignLeft = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "alignement", format: "left" });
      }}
    >
      <svg viewBox="0 0 15 15" height="25" width="25">
        <line className="ql-stroke" x1="1" x2="7" y1="3" y2="3"></line>
        <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
        <line className="ql-stroke" x1="1" x2="11" y1="13" y2="13"></line>
      </svg>
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatAlignCenter = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "alignement", format: "center" });
      }}
    >
      <svg viewBox="0 0 15 15" height="25" width="25">
        <line className="ql-stroke" x1="6" x2="9" y1="3" y2="3"></line>
        <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
        <line className="ql-stroke" x1="4" x2="11" y1="13" y2="13"></line>
      </svg>
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatAlignRight = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "alignement", format: "right" });
      }}
    >
      <svg viewBox="0 0 15 15" height="25" width="25">
        <line className="ql-stroke" x1="8" x2="14" y1="3" y2="3"></line>
        <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
        <line className="ql-stroke" x1="4" x2="14" y1="13" y2="13"></line>
      </svg>
      <RectSelect selected={selected} />
    </Outils>
  );
};
export const FormatAlignJustify = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "alignement", format: "justify" });
      }}
    >
      <svg viewBox="0 0 15 15" height="25" width="25">
        <line className="ql-stroke" x1="1" x2="14" y1="3" y2="3"></line>
        <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
        <line className="ql-stroke" x1="1" x2="14" y1="13" y2="13"></line>
      </svg>
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatUnfold = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "marginLeft", format: "unfold" });
      }}
    >
      <Icon type="menu-fold" style={{ fontSize: "24px", height: "24px" }} />
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatFold = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "marginLeft", format: "fold" });
      }}
    >
      <Icon type="menu-unfold" style={{ fontSize: "24px", height: "24px" }} />
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatH1 = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "h1" });
      }}
    >
      <span style={{ fontSize: "20px" }}>h1</span>
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatH2 = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "h2" });
      }}
    >
      <span style={{ fontSize: "20px" }}>h2</span>
      <RectSelect selected={selected} />
    </Outils>
  );
};
export const FormatH3 = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "h3" });
      }}
    >
      <span style={{ fontSize: "20px" }}>h3</span>
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatNumberedList = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "numbered-list" });
      }}
    >
      <Icon type="ordered-list" style={{ fontSize: "24px", height: "24px" }} />
      <RectSelect selected={selected} />
    </Outils>
  );
};
export const FormatOrderedList = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        editor.exec({ type: "toggle_format", format: "bulleted-list" });
      }}
    >
      <Icon
        type="unordered-list"
        style={{ fontSize: "24px", height: "24px" }}
      />
      <RectSelect selected={selected} />
    </Outils>
  );
};

export const FormatLink = ({ selected }) => {
  const editor = useSlate();

  return (
    <Outils
      onMouseDown={event => {
        event.preventDefault();
        if (!selected) {
          const url = window.prompt("URL du  lien :");
          if (!url) return;
          editor.exec({ type: "insert_link", url });
        } else {
          editor.exec({ type: "remove_link" });
        }
      }}
    >
      <Icon type="link" style={{ fontSize: "24px", height: "24px" }} />
      <RectSelect selected={selected} />
    </Outils>
  );
};
