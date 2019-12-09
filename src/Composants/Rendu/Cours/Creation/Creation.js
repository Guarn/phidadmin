import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useRef,
  forwardRef,
  useContext
} from "react";
import { Element } from "react-scroll";
import styled from "styled-components";
import { ListeContext } from "./index";
import { Button, Icon, Drawer, Radio, Divider } from "antd";
import { GithubPicker } from "react-color";

import Slate from "../../../Fonctionnels/Slate";
const whyDidYouRender = require("@welldone-software/why-did-you-render");
whyDidYouRender(React);
const ConteneurGlobal = styled.div`
  height: ${props => props.height + "px"};
  width: ${props => props.width + "px"};
`;

const ConteneurSlate = styled.div`
  position: relative;
  box-sizing: border-box;
  border: ${props =>
    props.selected ? "1px dashed #3a92ff" : " 1px dashed transparent"};
  transition: all 0.2s;
  &:hover {
    margin-bottom: -4px;
    border: 1px dashed rgba(0, 0, 0, 0.2);
  }
`;

const Icone = styled.div`
  position: absolute;
  font-size: 20px;
  height: 30px;
  width: 30px;
  top: 5px;
  right: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.2);
  user-select: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border: 1px solid #1890ff;
    color: #1890ff;
  }
`;

const ConteneurWidget = styled.div`
  display: flex;
  flex-direction: column;
`;

const FondWidget = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid grey;
  background-color: rgb(226, 224, 216);
  user-select: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
  &:hover {
    border: 1px solid #1890ff;
  }
`;

const Creation = props => {
  const [state, setState] = useContext(ListeContext);
  const refConteneur = useRef(null);
  const ref = React.createRef();
  const [menuWidgets, setMenuWidgets] = useState(false);
  const [menuParametres, setMenuParametres] = useState(false);
  function changeState(val, index) {
    setState({ type: "UpdateValue", value: val, index: index });
  }
  function clickOutside(event) {
    let drawer = document.getElementById("drawerParametres");

    if (
      state.ReadOnly !== null &&
      !refConteneur.current.contains(event.target) &&
      !menuParametres &&
      !drawer.contains(event.target)
    ) {
      event.stopPropagation();

      setState({ type: "ReadOnly", index: null });
    }
  }

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  });

  return (
    <ConteneurGlobal
      ref={refConteneur}
      height={props.height}
      width={props.width}
    >
      {state.Cours.map((element, index) => {
        return (
          <Element
            id={`element-${index}`}
            name={`element-${index}`}
            key={`element-${index}`}
            className="element"
          >
            <ConteneurSlate
              selected={state.ReadOnly === index}
              style={{
                backgroundColor: element.options.backgroundColor,
                marginTop: element.options.marginTop + "px",
                marginBottom: element.options.marginBottom + "px",
                marginLeft: element.options.marginLeft + "px",
                paddingLeft: element.options.paddingLeft + "px",
                marginRight: element.options.marginRight + "px",
                paddingRight: element.options.paddingRight + "px",
                paddingTop: element.options.paddingTop + "px",
                paddingBottom: element.options.paddingBottom + "px",
                fontFamily: "Century Gothic",
                fontSize: "16px"
              }}
              onMouseDown={() => {
                if (state.ReadOnly !== index)
                  setState({ type: "ReadOnly", index: index });
              }}
            >
              <Slate
                index={index}
                value={element.value}
                readOnly={state.ReadOnly !== index}
              />
            </ConteneurSlate>
          </Element>
        );
      })}

      <Button
        onMouseDown={() => {
          setMenuParametres(false);
          setMenuWidgets(true);
        }}
        type="round"
        style={{ position: "absolute", right: "10px", bottom: "-50px" }}
      >
        Ajouter un widget
      </Button>
      <Drawer
        onClose={() => {
          setMenuWidgets(false);
        }}
        title="Widgets"
        visible={menuWidgets}
      >
        <MenuWidgets
          setState={val => {
            setState(val);
            setMenuWidgets(false);
          }}
        />
      </Drawer>
    </ConteneurGlobal>
  );
};
export default Creation;

const MenuWidgets = () => {
  const [state, setState] = useContext(ListeContext);
  return (
    <ConteneurWidget>
      <FondWidget
        onMouseDown={() => setState({ type: "Ajout", value: "titre" })}
      >
        <h1 style={{ margin: "10px", textAlign: "center" }}>Titre</h1>
      </FondWidget>
      <FondWidget
        onMouseDown={() => setState({ type: "Ajout", value: "chapitre" })}
      >
        <div
          style={{
            height: "30px",
            width: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            marginRight: "10px",
            marginLeft: "5px",
            background: "white",
            color: "#858585"
          }}
        >
          1
        </div>
        <h2 style={{ margin: "10px" }}>Chapitre</h2>
      </FondWidget>
      <FondWidget
        onMouseDown={() => setState({ type: "Ajout", value: "sousChapitre" })}
      >
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
        <h3 style={{ margin: "10px" }}>Sous chapitre</h3>
      </FondWidget>
      <FondWidget
        onMouseDown={() => setState({ type: "Ajout", value: "paragraphe" })}
      >
        <p style={{ margin: "10px" }}>Paragraphe</p>
      </FondWidget>
    </ConteneurWidget>
  );
};
