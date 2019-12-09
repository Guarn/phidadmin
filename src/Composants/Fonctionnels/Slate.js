import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext
} from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import styled from "styled-components";
import { isEqual } from "lodash";
import {
  BarreOutils,
  FormatGras,
  FormatItalic,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatFold,
  FormatUnfold,
  FormatH1,
  FormatH2,
  FormatH3,
  Separateur,
  FormatCouleurTexte,
  FormatCouleurBackground,
  FormatNumberedList,
  FormatOrderedList
} from "./Components";
import "./Slate.css";
import { ListeContext } from "../Rendu/Cours/Creation/index";

import { Button, Icon } from "antd";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underlined",
  "mod+`": "code"
};

const TEXT_FORMATS = [
  "bold",
  "italic",
  "underlined",
  "code",
  "couleurTexteActive",
  "couleurBackgroundActive"
];
const LIST_FORMATS = ["numbered-list", "bulleted-list"];
const BLOCK_FORMATS = [...LIST_FORMATS, "h1", "h2", "h3", "block-quote"];

const SlateJs = props => {
  const [state, setState] = useContext(ListeContext);
  const [selection, setSelection] = useState(null);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withRichText(withHistory(withReact(createEditor()))),
    []
  );
  useEffect(() => {}, [state]);

  return (
    <Slate
      editor={editor}
      value={
        state.Cours[props.index].value === undefined
          ? []
          : state.Cours[props.index].value
      }
      selection={selection}
      onChange={(value, selection) => {
        if (!props.readOnly) {
          if (!isEqual(value, state.Cours[props.index].value)) {
            setState({ type: "UpdateValue", index: props.index, value: value });
          }
          console.log(value);

          setSelection(selection);
        }
      }}
    >
      {!props.readOnly && (
        <div>
          <BarreOutils>
            <FormatGras selected={isFormatActive(editor, "bold")} />
            <Separateur />
            <FormatItalic selected={isFormatActive(editor, "italic")} />
            <Separateur />
            <FormatAlignLeft selected={isAlignActive(editor, "left")} />
            <Separateur />
            <FormatAlignCenter selected={isAlignActive(editor, "center")} />
            <Separateur />
            <FormatAlignRight selected={isAlignActive(editor, "right")} />
            <Separateur />
            <FormatAlignJustify selected={isAlignActive(editor, "justify")} />
            <Separateur />
            <FormatCouleurTexte
              selected={isFormatActive(editor, "couleurTexteActive")}
              couleurTexte={getCouleur(editor)}
            />
            <Separateur />
            <FormatCouleurBackground
              selected={isFormatActive(editor, "couleurBackgroundActive")}
              couleurBackground={getBackground(editor)}
            />
            <Separateur />
            <FormatUnfold />
            <Separateur />
            <FormatFold selected={isFoldActive(editor, "marginLeft")} />
            <Separateur />
            <FormatH1 selected={isFormatActive(editor, "h1")} />
            <Separateur />
            <FormatH2 selected={isFormatActive(editor, "h2")} />
            <Separateur />
            <FormatH3 selected={isFormatActive(editor, "h3")} />
            <Separateur />
            <FormatNumberedList
              selected={isFormatActive(editor, "numbered-list")}
            />
            <Separateur />
            <FormatOrderedList
              selected={isFormatActive(editor, "bulleted-list")}
            />
          </BarreOutils>
        </div>
      )}

      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              editor.exec({ type: "toggle_format", format: HOTKEYS[hotkey] });
            }
          }
        }}
      />
    </Slate>
  );
};

const withRichText = editor => {
  const { exec } = editor;

  editor.exec = command => {
    if (command.type === "marginLeft") {
      const { format, type } = command;
      const [match] = Editor.nodes(editor, { match: "block", mode: "all" });
      let margin;
      if (format === "unfold") {
        margin = match[0].marginLeft
          ? match[0].marginLeft === 0
            ? null
            : match[0].marginLeft - 15
          : null;
      }
      if (format === "fold") {
        margin = match[0].marginLeft ? match[0].marginLeft + 15 : 15;
      }
      Editor.setNodes(editor, {
        type: match[0].type,
        marginLeft: margin
      });
    }
    if (command.type === "alignement") {
      const { format, type } = command;
      const isActive = isFormatActive(editor, format);
      const isAlign = isAlignActive(editor, type);
      const [match] = Editor.nodes(editor, { match: "block", mode: "all" });
      if (match)
        Editor.setNodes(editor, {
          type: match[0].type,
          align: format
        });
    }
    if (command.type === "couleur") {
      const { format } = command;
      const { couleurTexte, couleurBackground } = command;
      const isActive = isFormatActive(editor, format);
      const memeCouleur = sontMemeCouleurs(editor, couleurTexte);
      const memeCouleur1 = sontMemeCouleurs1(editor, couleurBackground);
      console.log(command);
      const active = () => {
        if (isActive) {
          if (command.couleurTexte === "" || memeCouleur) {
            return false;
          }
          if (command.couleurTexte !== "" && !memeCouleur) {
            return true;
          }
        } else {
          if (command.couleurTexte === "") {
            return false;
          }
          if (command.couleurTexte !== "") {
            return true;
          }
        }
      };

      const active1 = () => {
        if (isActive) {
          if (command.couleurBackground === "" || memeCouleur1) {
            return false;
          }
          if (command.couleurBackground !== "" && !memeCouleur1) {
            return true;
          }
        } else {
          if (command.couleurBackground === "") {
            return false;
          }
          if (command.couleurBackground !== "") {
            return true;
          }
        }
      };

      if (format === "couleurTexteActive") {
        Editor.setNodes(
          editor,
          {
            [format]: active() ? true : null,
            couleurTexte: active() ? command.couleurTexte : null
          },
          { match: "text", split: true }
        );
      }
      if (format === "couleurBackgroundActive") {
        console.log("TTTTT");
        console.log(active1());
        console.log(command);

        Editor.setNodes(
          editor,
          {
            [format]: active1() ? true : null,
            couleurBackground: active1() ? command.couleurBackground : null
          },
          { match: "text", split: true }
        );
      }
    }

    if (command.type === "toggle_format") {
      const { format } = command;
      const isActive = isFormatActive(editor, format);
      const isList = LIST_FORMATS.includes(format);

      if (TEXT_FORMATS.includes(format)) {
        Editor.setNodes(
          editor,
          { [format]: isActive ? null : true },
          { match: "text", split: true }
        );
      }

      if (BLOCK_FORMATS.includes(format)) {
        for (const f of LIST_FORMATS) {
          Editor.unwrapNodes(editor, { match: { type: f }, split: true });
        }

        Editor.setNodes(editor, {
          type: isActive ? "paragraph" : isList ? "list-item" : format
        });

        if (!isActive && isList) {
          Editor.wrapNodes(editor, { type: format, children: [] });
        }
      }
    } else {
      exec(command);
    }
  };

  return editor;
};

const getCouleur = editor => {
  const [match] = Editor.nodes(editor, {
    match: { couleurTexteActive: true }
  });
  console.log(match);
  if (match) {
    return match[0].couleurTexte;
  } else {
    return "";
  }
};

const getBackground = editor => {
  const [match] = Editor.nodes(editor, {
    match: { couleurBackgroundActive: true }
  });
  console.log(match);
  if (match) {
    return match[0].couleurBackground;
  } else {
    return "";
  }
};

const sontMemeCouleurs = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: { couleurTexte: format },
    mode: "all"
  });

  return !!match;
};

const sontMemeCouleurs1 = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: { couleurBackground: format },
    mode: "all"
  });

  return !!match;
};

const isAlignActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: { align: format },
    mode: "all"
  });

  return !!match;
};

const isFoldActive = (editor, format) => {
  const [match] = Editor.nodes(editor, { match: "element" });

  return match ? (match[0].marginLeft ? true : false) : false;
};

const isFormatActive = (editor, format) => {
  if (TEXT_FORMATS.includes(format)) {
    const [match] = Editor.nodes(editor, {
      match: { [format]: true },
      mode: "all"
    });

    return !!match;
  }

  if (BLOCK_FORMATS.includes(format)) {
    const [match] = Editor.nodes(editor, {
      match: { type: format },
      mode: "all"
    });

    return !!match;
  }

  return false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={{
            textAlign: element.align,
            marginLeft: element.marginLeft,
            marginTop: "0px",
            marginBottom: "0px"
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "h1":
      return (
        <h1
          style={{
            textAlign: element.align,
            marginLeft: element.marginLeft,
            marginTop: "0px",
            marginBottom: "0px"
          }}
          {...attributes}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          style={{
            textAlign: element.align,
            marginLeft: element.marginLeft,
            marginTop: "0px",
            marginBottom: "0px"
          }}
          {...attributes}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          style={{
            textAlign: element.align,
            marginLeft: element.marginLeft,
            marginTop: "0px",
            marginBottom: "0px"
          }}
          {...attributes}
        >
          {children}
        </h3>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return (
        <p
          style={{
            textAlign: element.align,
            marginLeft: element.marginLeft,
            marginTop: "0px",
            marginBottom: "0px"
          }}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return (
    <span
      style={{
        color: leaf.couleurTexteActive ? leaf.couleurTexte : null,
        backgroundColor: leaf.couleurBackgroundActive
          ? leaf.couleurBackground
          : null,
        textAlign: leaf.alignement ? leaf.align : null
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};

export default SlateJs;

let t = {
  Cours: [
    {
      value: [
        {
          type: "h1",
          id: 1,
          align: "center",
          children: [{ text: "LES  TEXTES REGLEMENTAIRES" }]
        }
      ],
      type: "h1",
      TableMatiere: {
        actif: true,
        value: "LES TEXTES REGLEMENTAIRES",
        type: "titre",
        position: 0
      },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "h2",
          id: "a7a44a8b-87e3-4593-bf43-52f9da0d394e",
          align: "center",
          children: [
            { text: "LE ", marks: [] },
            {
              text: "PROGRAMME ",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            { text: "ET LES ", marks: [] },
            {
              text: "EPREUVES",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            }
          ]
        }
      ],
      type: "paragraphe",
      TableMatiere: { actif: false, value: "", titre: false, position: 0 },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "h2",
          id: "bfc1a690-fbb1-43ad-a70c-2da1fd6af505",
          align: "left",
          children: [
            {
              text: " ",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red"
            },
            {
              text: "1 ",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red",
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            {
              text: " ",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            { text: "LES TEXTES REGLEMENTAIRES", marks: [] }
          ]
        }
      ],
      type: "chapitre",
      TableMatiere: {
        actif: true,
        value: "Les textes réglementaires",
        titre: false,
        position: 0,
        type: "0"
      },
      options: {
        marginTop: 50,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "paragraph",
          id: "f3c06329-b9e0-4b8e-905d-5d183476f49d",
          align: "justify",
          children: [
            {
              text:
                "Un candidat au baccalauréat ES n'est pas forcément porté à la lecture des textes réglementaires parus au « BO ». Tant qu'à lire, mieux vaut qu'il lise autre chose ! Les textes officiels comportent pourtant des renseignements particulièrement précieux, puisqu'ils définissent ce qui est attendu des candidats, en fonction des objectifs de l'enseignement et de l'épreuve de philosophie. Ils indiquent aussi la façon dont les sujets de bac doivent être conçus, et donc les sujets qui peuvent, et ceux qui ne peuvent pas, être donnés. Enfin, ils précisent de quelle manière les copies doivent être corrigées, évaluées et notées : toutes choses qu'il vaut mieux savoir.",
              marks: []
            }
          ]
        }
      ],
      type: "paragraphe",
      TableMatiere: { actif: false, value: "", titre: false, position: 0 },
      options: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "h2",
          id: "74f59739-0cbf-4160-bd4b-40afec875a76",
          align: "left",
          children: [
            { text: " ", marks: [] },
            {
              text: " ",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red"
            },
            {
              text: "2 ",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red",
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            {
              text: " ",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            { text: "LES CONDITIONS DE L'EPREUVE ECRITE", marks: [] }
          ],
          marginLeft: 0
        }
      ],
      type: "paragraphe",
      TableMatiere: {
        actif: true,
        value: "Les conditions de l'épreuve écrite",
        titre: false,
        position: 0,
        type: "0"
      },
      options: {
        marginTop: 20,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "paragraph",
          id: "752c7c81-656a-450a-9827-fe7ba3677994",
          align: "justify",
          children: [
            {
              text:
                "Dans les différentes séries actuelles, le coefficient de l'épreuve de philosophie n'est pas le même (4 en série ES). Durant l'année, l'horaire hebdomadaire aussi est différent (4 heures en terminale ES). Mais l'épreuve a la même durée, parce qu'on estime que, pour le travail qui est demandé aux candidats, et pe",
              marks: []
            },
            {
              text:
                "u importe le coefficient ou le nombre d'heures de cours, 4 heures, c'est suffisant, et ce n'est pas trop !",
              marks: []
            }
          ]
        }
      ],
      type: "paragraphe",
      TableMatiere: { actif: false, value: "", titre: false, position: 0 },
      options: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "h2",
          id: "3459965d-414f-4427-ad5d-df4f7f2c7f4b",
          align: "left",
          children: [
            {
              text: " 3 ",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red",
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            {
              text: " ",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            { text: "LES AUTRES CONDITIONS", marks: [] }
          ]
        }
      ],
      type: "chapitre",
      TableMatiere: {
        actif: true,
        value: "Les autres conditions",
        titre: false,
        position: 0,
        type: "0"
      },
      options: {
        marginTop: 20,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "h3",
          id: "d96749d9-637d-4296-bdf5-d16a608c60d7",
          align: "left",
          children: [
            {
              text: "3.1",
              marks: [],
              couleurBackgroundActive: true,
              couleurBackground: "red",
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            {
              text: " ",
              marks: [],
              couleurTexteActive: true,
              couleurTexte: "#eb9694"
            },
            { text: "QUOI QUE CA DONNE", marks: [] }
          ],
          marginLeft: 15
        }
      ],
      type: "sousChapitre",
      TableMatiere: {
        actif: true,
        value: "Quoi que ça donne",
        titre: false,
        position: 0,
        type: "1"
      },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "paragraph",
          id: "eb5456ff-9ea1-41ba-8bb6-202fcfa7af58",
          align: "justify",
          children: [
            {
              text:
                "Un candidat au baccalauréat ES n'est pas forcément porté à la lecture des textes réglementaires parus au « BO ». Tant qu'à lire, mieux vaut qu'il lise autre chose ! Les textes officiels comportent pourtant des renseignements particulièrement précieux, puisqu'ils définissent ce qui est attendu des candidats, en fonction des objectifs de l'enseignement et de l'épreuve de philosophie. Ils indiquent aussi la façon dont les sujets de bac doivent être conçus, et donc les sujets qui peuvent, et ceux qui ne peuvent pas, être donnés. Enfin, ils précisent de quelle manière les copies doivent être corrigées, évaluées et notées : toutes choses qu'il vaut mieux savoir.",
              marks: []
            }
          ]
        },
        {
          type: "paragraph",
          id: "eb5456ff-9ea1-41ba-8bb6-202fcfa7af58",
          align: "justify",
          children: [
            {
              text:
                "Un candidat au baccalauréat ES n'est pas forcément porté à la lecture des textes réglementaires parus au « BO ». Tant qu'à lire, mieux vaut qu'il lise autre chose ! Les textes officiels comportent pourtant des renseignements particulièrement précieux, puisqu'ils définissent ce qui est attendu des candidats, en fonction des objectifs de l'enseignement et de l'épreuve de philosophie. Ils indiquent aussi la façon dont les sujets de bac doivent être conçus, et donc les sujets qui peuvent, et ceux qui ne peuvent pas, être donnés. Enfin, ils précisent de quelle manière les copies doivent être corrigées, évaluées et notées : toutes choses qu'il vaut mieux savoir.",
              marks: []
            }
          ]
        },
        {
          type: "paragraph",
          id: "eb5456ff-9ea1-41ba-8bb6-202fcfa7af58",
          align: "justify",
          children: [
            {
              text:
                "Un candidat au baccalauréat ES n'est pas forcément porté à la lecture des textes réglementaires parus au « BO ». Tant qu'à lire, mieux vaut qu'il lise autre chose ! Les textes officiels comportent pourtant des renseignements particulièrement précieux, puisqu'ils définissent ce qui est attendu des candidats, en fonction des objectifs de l'enseignement et de l'épreuve de philosophie. Ils indiquent aussi la façon dont les sujets de bac doivent être conçus, et donc les sujets qui peuvent, et ceux qui ne peuvent pas, être donnés. Enfin, ils précisent de quelle manière les copies doivent être corrigées, évaluées et notées : toutes choses qu'il vaut mieux savoir.",
              marks: []
            }
          ]
        },
        {
          type: "paragraph",
          id: "eb5456ff-9ea1-41ba-8bb6-202fcfa7af58",
          align: "justify",
          children: [
            {
              text:
                "Un candidat au baccalauréat ES n'est pas forcément porté à la lecture des textes réglementaires parus au « BO ». Tant qu'à lire, mieux vaut qu'il lise autre chose ! Les textes officiels comportent pourtant des renseignements particulièrement précieux, puisqu'ils définissent ce qui est attendu des candidats, en fonction des objectifs de l'enseignement et de l'épreuve de philosophie. Ils indiquent aussi la façon dont les sujets de bac doivent être conçus, et donc les sujets qui peuvent, et ceux qui ne peuvent pas, être donnés. Enfin, ils précisent de quelle manière les copies doivent être corrigées, évaluées et notées : toutes choses qu'il vaut mieux savoir.",
              marks: []
            }
          ]
        }
      ],
      type: "paragraphe",
      TableMatiere: { actif: false, value: "", titre: false, position: 0 },
      options: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    },
    {
      value: [
        {
          type: "paragraph",
          id: "1de0c8d2-1e23-4a1c-af4d-dbb48ffeb2fd",
          align: "left",
          children: [{ text: "Nouveau paragraphe", marks: [] }]
        }
      ],
      type: "paragraphe",
      TableMatiere: { actif: false, value: "", titre: false, position: 0 },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    }
  ],
  ReadOnly: null
};
