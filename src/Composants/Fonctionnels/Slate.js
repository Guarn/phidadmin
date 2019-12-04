import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef
} from "react";
import isHotkey from "is-hotkey";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSelected,
  useFocused
} from "slate-react";
import { Editor, createEditor, Range } from "slate";
import { withHistory } from "slate-history";
import styled from "styled-components";
import { Icon, Button, Collapse } from "antd";
import { GithubPicker } from "react-color";
import "antd/dist/antd.css";
import imageExtensions from "image-extensions";
import isUrl from "is-url";
import "./Slate.css";

//NOTE STYLED  COMPONENTS

const Conteneur = styled.div`
  width: 700px;
  padding-left: calc(81px / 2);
  padding-right: calc(81px / 2);

  display: flex;
  flex-direction: column;
  position: relative;
  font-family: "Century Gothic";
`;

const BarreOutils = styled.div`
  position: absolute;
  background-color: #707070;
  height: 46px;
  border-radius: 5px;
  top: -70px;
  left: 0px;
  display: flex;
  transition: all 0.2s;
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
  transform: scale(1);
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;
const Separateur = styled.div`
  width: 1px;
  background-color: #a59d75;
`;
const RectSelect = styled.div`
  position: absolute;
  width: 35px;
  height: 3px;
  bottom: 2px;
  left: 5px;
  border-radius: 3px;
  background-color: #ffda48;
  transition: all 0.2s;
  opacity: ${props => (props.selected ? 1 : 0)};
`;

const ConteneurExpandable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid grey;
  overflow: hidden;
`;

const TitreExpandable = styled.div`
  display: flex;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.1);
`;
const ContenuExpandable = styled.div`
  display: flex;
  padding: 5px;
`;

//NOTE SC Chapitre

const CollapseNode = props => {
  console.log(props);
  const [open, setOpen] = useState(true);
  return (
    <ConteneurExpandable
      style={{ height: open ? "auto" : "32px" }}
      onMouseDown={e => {
        e.persist();
        console.log(e);

        for (let element in e.nativeEvent.path) {
          console.log(e.nativeEvent.path[element]);

          if (
            e.nativeEvent.path[element].className &&
            e.nativeEvent.path[element].className.includes("titre")
          ) {
            setOpen(!open);
          }
        }
      }}
      {...props.attributes}
    >
      {props.children}
    </ConteneurExpandable>
  );
};

const CollapseTitreNode = props => {
  const editor = useSlate();
  return (
    <TitreExpandable
      className="titre"
      onMouseDown={e => console.log(editor)}
      {...props.attributes}
    >
      {props.children}
    </TitreExpandable>
  );
};

const CollapseContenuNode = props => {
  return (
    <ContenuExpandable {...props.attributes}>
      {props.children}
    </ContenuExpandable>
  );
};

const CollapseT = [
  {
    type: "collapse",

    ouvert: true,
    children: [
      { type: "CollapseTitre", children: [{ text: "TITRE", marks: [] }] },
      {
        type: "CollapseContenu",
        children: [{ text: "Contenu", marks: [] }]
      }
    ]
  }
];

const ChapitreNode = props => {
  return (
    <div {...props.attr} style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          height: "30px",
          width: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          marginRight: "10px",
          background: "white",
          color: "#858585"
        }}
      >
        1
      </div>
      <h2 style={{ margin: "10px" }}>{props.children}</h2>
    </div>
  );
};

const SousChapitreNode = props => {
  return (
    <div {...props.attr} style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          height: "24px",
          width: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          marginRight: "10px",
          marginLeft: "20px",
          background: "white",
          color: "#858585"
        }}
      >
        1.1
      </div>
      <h3 style={{ margin: "10px" }}>{props.children}</h3>
    </div>
  );
};

const isImageUrl = url => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

const withImages = editor => {
  const { exec, isVoid } = editor;

  editor.isVoid = element => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.exec = command => {
    switch (command.type) {
      case "insert_data": {
        const { data } = command;
        const text = data.getData("text/plain");
        const { files } = data;

        if (files && files.length > 0) {
          for (const file of files) {
            const reader = new FileReader();
            const [mime] = file.type.split("/");

            if (mime === "image") {
              reader.addEventListener("load", () => {
                const url = reader.result;
                editor.exec({ type: "insert_image", url });
              });

              reader.readAsDataURL(file);
            }
          }
        } else if (isImageUrl(text)) {
          editor.exec({ type: "insert_image", url: text });
        } else {
          exec(command);
        }

        break;
      }

      case "insert_image": {
        const { url } = command;
        const text = { text: "", marks: [] };
        const image = { type: "image", url, children: [text] };
        Editor.insertNodes(editor, image);
        break;
      }

      default: {
        exec(command);
        break;
      }
    }
  };

  return editor;
};

const MARK_HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underlined",
  "mod+,": "code"
};

const SlateJs = props => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderMark = useCallback(props => <Mark {...props} />, []);
  const [readOnly, setReadOnly] = useState(props.index === 0 ? false : true);
  const refEditor = useRef(null);
  const [lastChar, setLastChar] = useState("");
  const editor = useMemo(
    () => withImages(withRichText(withHistory(withReact(createEditor())))),
    []
  );
  function clickOutside(event) {
    if (!refEditor.current.contains(event.target)) {
      Editor.setSelection(editor, null);
      setReadOnly(true);
    } else if (readOnly) {
      setReadOnly(false);
    }
  }

  useEffect(() => {
    console.log(readOnly);

    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  });

  function onChange(val, te) {
    console.log(val);

    props.onChange(val);
  }

  //NOTE HOTKEYS
  return (
    <Conteneur ref={refEditor}>
      <Slate
        onChange={(val, op) => {
          if (op[0].type !== "set_selection") {
            onChange(val);
          }
        }}
        editor={editor}
        defaultValue={props.initialValue}
      >
        <Toolbar readOnly={readOnly} index={props.index} />
        <Editable
          renderElement={renderElement}
          renderMark={renderMark}
          onKeyDown={event => {
            if (event.key === "Tab") {
              event.preventDefault();
              Editor.insertText(editor, "   ");
            } else if (
              lastChar + event.key === "AE" ||
              lastChar + event.key === "Ae"
            ) {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "Æ");
              setLastChar("");
            } else if (lastChar + event.key === "ae") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "æ");
              setLastChar("");
            } else if (event.ctrlKey && event.key === "Enter") {
              event.preventDefault();

              Editor.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "", marks: [] }]
              });
              setLastChar("");
            } else if (
              lastChar + event.key === "OE" ||
              lastChar + event.key === "Oe"
            ) {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "Œ");
              setLastChar("");
            } else if (lastChar + event.key === "oe") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "œ");
              setLastChar("");
            } else if (lastChar + event.key === "é*") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "É");
              setLastChar("");
            } else if (lastChar + event.key === "à*") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "À");
              setLastChar("");
            } else if (lastChar + event.key === "è*") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.insertText(editor, "È");
              setLastChar("");
            } else if (lastChar + event.key === "#1") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.setNodes(editor, { type: "chapitre" });
              setLastChar("");
            } else if (lastChar + event.key === "#2") {
              event.preventDefault();
              Editor.delete(editor, {
                at: editor.selection.anchor,
                distance: 1,
                unit: "character",
                reverse: true
              });
              Editor.setNodes(editor, { type: "sousChapitre" });
              setLastChar("");
            } else if (event.ctrlKey && event.key === "<") {
              event.preventDefault();
              Editor.insertNodes(editor, CollapseT);
              setLastChar("");
            } else {
              setLastChar(event.key);
            }
            for (const hotkey in MARK_HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                editor.exec({
                  type: "toggle_mark",
                  mark: MARK_HOTKEYS[hotkey]
                });
              }
            }
          }}
        />
      </Slate>
    </Conteneur>
  );
};

const withRichText = editor => {
  const { exec } = editor;
  //NOTE  COMMANDS
  editor.exec = command => {
    if (command.type === "toggle_block") {
      const { block: type } = command;

      const isActive = isBlockActive(editor, type);

      const isListType = type === "bulleted-list" || type === "numbered-list";

      const alignType = Editor.unwrapNodes(editor, {
        match: { type: "bulleted-list" }
      });
      Editor.unwrapNodes(editor, { match: { type: "numbered-list" } });

      const newType = isActive ? "paragraph" : isListType ? "list-item" : type;
      Editor.setNodes(editor, { type: newType });

      if (!isActive && isListType) {
        Editor.wrapNodes(editor, { type, children: [] });
      }

      return;
    }

    if (command.type === "toggle_mark") {
      const { mark: type } = command;
      const isActive = isMarkActive(editor, type);
      const cmd = isActive ? "remove_mark" : "add_mark";
      if (command.mark === "txtColor") {
        if (cmd === "remove_mark") {
          let marks = Editor.activeMarks(editor).filter(
            item => item.type === "txtColor"
          );

          if (marks[0].color === command.color) {
            Editor.removeMarks(editor, marks);
            return;
          } else {
            Editor.removeMarks(editor, marks);
            editor.exec({
              type: "add_mark",
              mark: { type, color: command.color }
            });
            return;
          }
        }
      } else if (command.mark === "bgColor") {
        if (cmd === "remove_mark") {
          let marks = Editor.activeMarks(editor).filter(
            item => item.type === "bgColor"
          );

          if (marks[0].color === command.color) {
            Editor.removeMarks(editor, marks);
            return;
          } else {
            Editor.removeMarks(editor, marks);
            editor.exec({
              type: "add_mark",
              mark: { type, color: command.color }
            });
            return;
          }
        }
      }
      editor.exec({
        type: cmd,
        mark: { type, color: command.color }
      });
      return;
    }

    if (command.type === "margin") {
      const { block: type } = command;
      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin: editor.children[editor.selection.anchor.path[0]].margin + 1
        });
      }
    }
    if (command.type === "unmargin") {
      const { block: type } = command;
      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin:
            editor.children[editor.selection.anchor.path[0]].margin === 0
              ? 0
              : editor.children[editor.selection.anchor.path[0]].margin - 1
        });
      }
    }
    if (command.type === "alignLeft") {
      const { block: type } = command;

      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin:
            editor.children[editor.selection.anchor.path[0]].margin === 0
              ? 0
              : editor.children[editor.selection.anchor.path[0]].margin - 1,
          align: "left"
        });
      }
      return;
    }
    if (command.type === "alignCenter") {
      const { block: type } = command;
      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin:
            editor.children[editor.selection.anchor.path[0]].margin === 0
              ? 0
              : editor.children[editor.selection.anchor.path[0]].margin - 1,
          align: "center"
        });
      }
      return;
    }
    if (command.type === "alignRight") {
      const { block: type } = command;

      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin:
            editor.children[editor.selection.anchor.path[0]].margin === 0
              ? 0
              : editor.children[editor.selection.anchor.path[0]].margin - 1,
          align: "right"
        });
      }
      return;
    }
    if (command.type === "justify") {
      const { block: type } = command;
      if (editor.selection) {
        Editor.setNodes(editor, {
          type: editor.children[editor.selection.anchor.path[0]].type,
          margin:
            editor.children[editor.selection.anchor.path[0]].margin === 0
              ? 0
              : editor.children[editor.selection.anchor.path[0]].margin - 1,
          align: "justify"
        });
      }
      return;
    }

    exec(command);
  };

  return editor;
};
//NOTE IS??ACTIVE
const isMarkActive = (editor, type) => {
  const [mark] = Editor.marks(editor, { match: { type }, mode: "all" });
  return !!mark;
};
const isBlockActive = (editor, type) => {
  const { selection } = editor;
  if (!selection) return false;
  const match = Editor.match(editor, selection, { type });
  return !!match;
};

const isAlign = (editor, type) => {
  const { selection } = editor;
  if (!selection) return false;
  const match = editor.children[editor.selection.anchor.path[0]].align === type;
  return !!match;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return (
        <ul
          style={{
            marginLeft: element.margin * 15 + "px",
            textAlign: element.align
          }}
          {...attributes}
        >
          {children}
        </ul>
      );
    case "chapitre":
      return <ChapitreNode attr={attributes}>{children}</ChapitreNode>;
    case "sousChapitre":
      return <SousChapitreNode attr={attributes}>{children}</SousChapitreNode>;
    case "h1":
      return (
        <h1
          style={{
            marginLeft: element.margin * 15 + "px",
            textAlign: element.align
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
            marginLeft: element.margin * 15 + "px",
            textAlign: element.align
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
            marginLeft: element.margin * 15 + "px",
            paddingLeft: element.padding * 15 + "px",
            textAlign: element.align,
            background: element.background,
            color: element.color,
            fontFamily: "Century Gothic"
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
    case "image":
      return (
        <ImageElement
          attributes={attributes}
          children={children}
          element={element}
        />
      );
    case "paragraph":
      return (
        <p
          style={{
            marginLeft: element.margin * 15 + "px",
            textAlign: element.align,
            fontSize: "16px"
          }}
          {...attributes}
        >
          {children}
        </p>
      );
    case "collapse":
      return (
        <CollapseNode ouvert={element.ouvert} attributes={attributes}>
          {children}
        </CollapseNode>
      );
    case "CollapseTitre":
      return (
        <CollapseTitreNode attributes={attributes}>
          {children}
        </CollapseTitreNode>
      );
    case "CollapseContenu":
      return (
        <CollapseContenuNode attributes={attributes}>
          {children}
        </CollapseContenuNode>
      );
    default:
      return (
        <p
          style={{
            marginLeft: element.margin * 15 + "px",
            textAlign: element.align,
            fontSize: "16px"
          }}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          style={{
            display: "block",
            width: "100%",
            boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none"
          }}
        />
      </div>
      {children}
    </div>
  );
};

const Mark = ({ attributes, children, mark }) => {
  switch (mark.type) {
    case "bold":
      return <strong {...attributes}>{children}</strong>;
    case "code":
      return <code {...attributes}>{children}</code>;
    case "italic":
      return <em {...attributes}>{children}</em>;
    case "underlined":
      return <u {...attributes}>{children}</u>;
    case "sup":
      return <sup {...attributes}>{children}</sup>;
    case "txtColor":
      return (
        <span
          style={{
            color: mark.color
          }}
          {...attributes}
        >
          {children}
        </span>
      );
    case "bgColor":
      return (
        <span
          style={{
            backgroundColor: mark.color
          }}
          {...attributes}
        >
          {children}
        </span>
      );
  }
};

//NOTE Initial Value

const Toolbar = props => {
  const editor = useSlate();
  const [txtColor, setTxtColor] = useState("#eb9694");
  const [bgColor, setBgColor] = useState("#eb9694");
  const [menuColor, setMenuColor] = useState(-1);
  const { selection } = editor;
  const focused = useFocused();
  const selected = useSelected();
  useEffect(() => {
    const { selection } = editor;

    if (
      !selection ||
      Range.isCollapsed(selection) ||
      Editor.text(editor, selection) === ""
    ) {
      return;
    }
    console.log(focused);
    console.log(selected);

    const domSelection = window.getSelection();
    console.log(domSelection);

    const domRange = domSelection.getRangeAt(0);
    console.log(domRange);
    const rect = domRange.getBoundingClientRect();
    console.log(rect);
  });
  function hov(num) {
    setMenuColor(num);
  }

  //NOTE TOOLBAR
  return (
    <>
      {!props.readOnly && (
        <BarreOutils>
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_mark", mark: "bold" });
            }}
          >
            G
            <RectSelect selected={isMarkActive(editor, "bold")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_mark", mark: "italic" });
            }}
            style={{ fontStyle: "italic" }}
          >
            I
            <RectSelect selected={isMarkActive(editor, "italic")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "alignLeft" });
            }}
          >
            <svg viewBox="0 0 15 15" height="25" width="25">
              <line className="ql-stroke" x1="1" x2="7" y1="3" y2="3"></line>
              <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
              <line className="ql-stroke" x1="1" x2="11" y1="13" y2="13"></line>
            </svg>
            <RectSelect selected={isAlign(editor, "left")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "alignCenter" });
            }}
          >
            <svg viewBox="0 0 15 15" height="25" width="25">
              <line className="ql-stroke" x1="6" x2="9" y1="3" y2="3"></line>
              <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
              <line className="ql-stroke" x1="4" x2="11" y1="13" y2="13"></line>
            </svg>
            <RectSelect selected={isAlign(editor, "center")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "alignRight" });
            }}
          >
            <svg viewBox="0 0 15 15" height="25" width="25">
              <line className="ql-stroke" x1="8" x2="14" y1="3" y2="3"></line>
              <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
              <line className="ql-stroke" x1="4" x2="14" y1="13" y2="13"></line>
            </svg>
            <RectSelect selected={isAlign(editor, "right")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "justify" });
            }}
          >
            <svg viewBox="0 0 15 15" height="25" width="25">
              <line className="ql-stroke" x1="1" x2="14" y1="3" y2="3"></line>
              <line className="ql-stroke" x1="1" x2="14" y1="8" y2="8"></line>
              <line className="ql-stroke" x1="1" x2="14" y1="13" y2="13"></line>
            </svg>
            <RectSelect selected={isAlign(editor, "justify")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseEnter={() => hov(0)}
            onMouseLeave={() => hov(-1)}
            onMouseDown={event => {
              event.preventDefault();
              event.stopPropagation();
              if (event.target === event.currentTarget) {
                editor.exec({
                  type: "toggle_mark",
                  mark: "txtColor",
                  color: txtColor
                });
              }
            }}
            style={{ color: txtColor }}
          >
            A
            <RectSelect selected={isMarkActive(editor, "txtColor")} />
            {menuColor === 0 && (
              <div style={{ position: "absolute", top: "45px", left: "5px" }}>
                <GithubPicker
                  color={txtColor}
                  width={212}
                  onChange={color => {
                    setTxtColor(color.hex);
                    editor.exec({
                      type: "toggle_mark",
                      mark: "txtColor",
                      color: color.hex
                    });
                  }}
                />
              </div>
            )}
          </Outils>
          <Separateur />
          <Outils
            onMouseEnter={() => hov(1)}
            onMouseLeave={() => hov(-1)}
            onMouseDown={event => {
              event.preventDefault();

              if (
                event.target === event.currentTarget ||
                event.target === event.currentTarget.children[0]
              ) {
                editor.exec({
                  type: "toggle_mark",
                  mark: "bgColor",
                  color: bgColor
                });
              }
            }}
          >
            <span
              style={{
                backgroundColor: bgColor,
                paddingLeft: "2px",
                paddingRight: "3px",
                borderRadius: "3px",
                lineHeight: "28px"
              }}
            >
              A
            </span>
            <RectSelect selected={isMarkActive(editor, "bgColor")} />
            {menuColor === 1 && (
              <div style={{ position: "absolute", top: "45px", left: "5px" }}>
                <GithubPicker
                  color={bgColor}
                  width={212}
                  onChangeComplete={color => {
                    setBgColor(color.hex);
                    editor.exec({
                      type: "toggle_mark",
                      mark: "bgColor",
                      color: color.hex
                    });
                  }}
                />
              </div>
            )}
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "unmargin" });
            }}
          >
            <Icon
              type="menu-fold"
              style={{ fontSize: "24px", height: "24px" }}
            />
            <RectSelect />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "margin" });
            }}
          >
            <Icon
              type="menu-unfold"
              style={{ fontSize: "24px", height: "24px" }}
            />
            <RectSelect />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_mark", mark: "sup" });
            }}
          >
            <div style={{ fontSize: "17px" }}>
              X<sup style={{ fontSize: "12px" }}>2</sup>
            </div>
            <RectSelect selected={isMarkActive(editor, "sup")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_block", block: "h1" });
            }}
          >
            <span style={{ fontSize: "20px" }}>h1</span>
            <RectSelect selected={isBlockActive(editor, "h1")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_block", block: "h2" });
            }}
          >
            <span style={{ fontSize: "20px" }}>h2</span>
            <RectSelect selected={isBlockActive(editor, "h2")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_block", block: "h3" });
            }}
          >
            <span style={{ fontSize: "20px" }}>h3</span>
            <RectSelect selected={isBlockActive(editor, "h3")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_block", block: "numbered-list" });
            }}
          >
            <Icon
              type="ordered-list"
              style={{ fontSize: "24px", height: "24px" }}
            />
            <RectSelect selected={isBlockActive(editor, "numbered-list")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              editor.exec({ type: "toggle_block", block: "bulleted-list" });
            }}
          >
            <Icon
              type="unordered-list"
              style={{ fontSize: "24px", height: "24px" }}
            />
            <RectSelect selected={isBlockActive(editor, "bulleted-list")} />
          </Outils>
          <Separateur />
          <Outils
            onMouseDown={event => {
              event.preventDefault();
              let url = prompt("entrez l'url de l'image :");

              editor.exec({
                type: "insert_image",
                url
              });
            }}
          >
            <Icon
              type="file-image"
              style={{ fontSize: "24px", height: "24px" }}
            />
            <RectSelect selected={isBlockActive(editor, "image")} />
          </Outils>
        </BarreOutils>
      )}
    </>
  );
};

export default SlateJs;
