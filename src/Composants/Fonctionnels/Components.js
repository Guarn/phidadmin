import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { useSlate } from "slate-react";
import { GithubPicker } from "react-color";
import { Icon, Select, Input, Popover, Radio, Drawer } from "antd";
import { Editor } from "slate";
import {
  clickHandlerContext,
  listeCoursContext,
  listeIndexContext,
  listeExercicesContext
} from "../Rendu/Cours/Creation/index";

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
                "#BE5454",
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
                "#DBD9D1"
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
                "#BE5454",
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
                "#DBD9D1"
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
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
export const FormatLink = ({ selected }) => {
  const editor = useSlate();
  const [clickHandler, setClickHandler] = useContext(clickHandlerContext);
  const [link] = Editor.nodes(editor, {
    match: { type: "link" },
    split: true
  });
  const [listeIndex, setListeIndex] = useContext(listeIndexContext);
  const [listeCours, setListeCours] = useContext(listeCoursContext);
  const [listeExercices, setListeExercices] = useContext(listeExercicesContext);
  useEffect(() => {
    if (selected) {
      setClickHandler(true);
    } else {
      setClickHandler(false);
    }
  });
  return (
    <>
      <Outils
        onMouseDown={event => {
          event.stopPropagation();
          if (!selected) {
            editor.exec({ type: "insert_link", url: "url défaut" });
          } else {
            editor.exec({ type: "remove_link" });
          }
        }}
      >
        <Icon type="link" style={{ fontSize: "24px", height: "24px" }} />
        <RectSelect selected={selected} />
      </Outils>
      <Drawer
        closable={false}
        visible={selected}
        title="Type de lien"
        mask={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Radio.Group
            size="small"
            onChange={val => {
              editor.exec({
                type: "insert_link",
                select: val.target.value,
                state: "",
                paragraphe: "",
                ouverture: "",
                nom: ""
              });
            }}
            value={selected ? link[0].select : ""}
            buttonStyle="solid"
          >
            <Radio.Button block value="web">
              WEB
            </Radio.Button>
            <Radio.Button value="cours">COURS</Radio.Button>
            <Radio.Button value="index">INDEX</Radio.Button>
            <Radio.Button value="exercices">EXERCICES</Radio.Button>
          </Radio.Group>
          {selected && link[0].select === "web" && (
            <>
              <Input
                defaultValue={link[0].value}
                style={{ marginTop: "10px" }}
                onChange={e => {
                  editor.exec({
                    type: "insert_link",
                    state: e.target.value,
                    select: link[0].select
                  });
                }}
              />
              <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                Ouverture du lien :
              </div>
              <Radio.Group
                onChange={val => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: link[0].value,
                    ouverture: val.target.value
                  });
                }}
                value={selected ? link[0].ouverture : ""}
                buttonStyle="solid"
              >
                <Radio style={radioStyle} value="same">
                  Même onglet
                </Radio>
                <Radio style={radioStyle} value="new">
                  Nouvel onglet
                </Radio>
              </Radio.Group>
            </>
          )}
          {selected && link[0].select === "cours" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Select
                defaultValue={link[0].value}
                onChange={(val, a) => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: val,
                    paragraphe: "",
                    nom: a.props.children,
                    ouverture: link[0].ouverture
                  });
                }}
                style={{ marginTop: "10px" }}
              >
                {listeCours.map((el, index) => {
                  return (
                    <Select.Option value={el.id} key={`cours-${index}`}>
                      {el.Titre}
                    </Select.Option>
                  );
                })}
              </Select>
              {link[0].value && (
                <Select
                  defaultValue={link[0].paragraphe}
                  onChange={val => {
                    editor.exec({
                      type: "insert_link",
                      select: link[0].select,
                      state: link[0].value,
                      ouverture: link[0].ouverture,
                      paragraphe: val,
                      nom: link[0].nom
                    });
                  }}
                  style={{ marginTop: "10px" }}
                >
                  {JSON.parse(
                    listeCours.filter(el => el.id === link[0].value)[0].Contenu
                  ).map((el, index) => {
                    return (
                      <Select.Option value={index} key={`paragraph-${index}`}>
                        {`Bloc ${index}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
              <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                Ouverture du lien :
              </div>
              <Radio.Group
                onChange={val => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: link[0].value,
                    paragraphe: link[0].paragraphe,
                    nom: link[0].nom,
                    ouverture: val.target.value
                  });
                }}
                value={selected ? link[0].ouverture : ""}
                buttonStyle="solid"
              >
                <Radio style={radioStyle} value="popup">
                  Popup
                </Radio>
                <Radio style={radioStyle} value="same">
                  Même onglet
                </Radio>
                <Radio style={radioStyle} value="new">
                  Nouvel onglet
                </Radio>
              </Radio.Group>
            </div>
          )}
          {selected && link[0].select === "index" && (
            <>
              <Select
                onChange={(val, a) => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: val,
                    ouverture: link[0].ouverture,
                    nom: a.props.children
                  });
                }}
                defaultValue={link[0].value}
                style={{ marginTop: "10px" }}
              >
                {listeIndex.map((el, index) => {
                  return (
                    <Select.Option value={el.id} key={`index-${index}`}>
                      {el.nom}
                    </Select.Option>
                  );
                })}
              </Select>
              <Radio.Group
                onChange={val => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: link[0].value,
                    ouverture: val.target.value,
                    nom: link[0].nom
                  });
                }}
                value={selected ? link[0].ouverture : ""}
                buttonStyle="solid"
              >
                <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                  Ouverture du lien :
                </div>
                <Radio style={radioStyle} value="popup">
                  Popup
                </Radio>
                <Radio style={radioStyle} value="same">
                  Même onglet
                </Radio>
                <Radio style={radioStyle} value="new">
                  Nouvel onglet
                </Radio>
              </Radio.Group>
            </>
          )}
          {selected && link[0].select === "exercices" && (
            <>
              <Select
                onChange={(val, a) => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: val,
                    ouverture: link[0].ouverture,
                    nom: a.props.children
                  });
                }}
                defaultValue={link[0].value}
                style={{ marginTop: "10px" }}
              >
                {listeExercices.map((el, index) => {
                  return (
                    <Select.Option value={el.id} key={`exercice-${index}`}>
                      {el.Titre}
                    </Select.Option>
                  );
                })}
              </Select>
              <Radio.Group
                onChange={val => {
                  editor.exec({
                    type: "insert_link",
                    select: link[0].select,
                    state: link[0].value,
                    ouverture: val.target.value,
                    nom: link[0].nom
                  });
                }}
                value={selected ? link[0].ouverture : ""}
                buttonStyle="solid"
              >
                <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                  Ouverture du lien :
                </div>
                <Radio style={radioStyle} value="popup">
                  Popup
                </Radio>
                <Radio style={radioStyle} value="same">
                  Même onglet
                </Radio>
                <Radio style={radioStyle} value="new">
                  Nouvel onglet
                </Radio>
              </Radio.Group>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
