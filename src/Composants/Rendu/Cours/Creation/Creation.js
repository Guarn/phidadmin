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
import { Button, Icon, Drawer, Radio, Divider, Popover, Select } from "antd";
import Slate from "../../../Fonctionnels/Slate";
import { Resizable, ResizableBox } from "react-resizable";
import "./Creation.css";
import TextArea from "antd/lib/input/TextArea";

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
  background-color: rgb(254, 243, 189);
  user-select: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
`;

const Creation = props => {
  const [state, setState] = useContext(ListeContext);
  const refConteneur = useRef(null);
  const ref = React.createRef();
  const [menuWidgets, setMenuWidgets] = useState(false);
  const [menuParametres, setMenuParametres] = useState(false);
  const [insertWidget, setInsertWidget] = useState(false);
  const [positionNewWidget, setPositionNewWidget] = useState(0);
  function changeState(val, index) {
    setState({ type: "UpdateValue", value: val, index: index });
  }
  function clickOutside(event) {
    let drawer = document.getElementById("drawerParametres");

    if (
      props.modal ||
      event.target.className === "ant-radio-button-wrapper" ||
      event.target.className === "ant-radio-button-input"
    ) {
      return;
    } else if (
      event.target.innerText === "PDF" ||
      event.target.innerText === "IMG" ||
      event.target.innerText === "WEB"
    ) {
      setState({
        type: "ImageOptions",
        option: "lienType",
        value: event.target.innerText,
        index: state.ReadOnly
      });
    } else if (
      state.ReadOnly !== null &&
      !refConteneur.current.contains(event.target) &&
      !menuParametres &&
      !drawer.contains(event.target)
    ) {
      setState({ type: "ReadOnly", index: null });
      setInsertWidget(false);
      return;
    } else if (
      !refConteneur.current.contains(event.target) &&
      !menuParametres &&
      !drawer.contains(event.target)
    ) {
      setInsertWidget(false);
      return;
    } else if (
      refConteneur.current.contains(event.target) &&
      event.target.nodeName === "svg" &&
      state.ReadOnly === null
    ) {
      setInsertWidget(false);
      setPositionNewWidget(event.target.parentNode.id);
      setMenuWidgets(true);
      return;
    } else if (
      refConteneur.current.contains(event.target) &&
      event.target.nodeName === "path" &&
      state.ReadOnly === null
    ) {
      setInsertWidget(false);
      setPositionNewWidget(event.target.parentNode.parentNode.id);
      setMenuWidgets(true);
      return;
    }
    return;
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
      {insertWidget && !props.readonly && (
        <InsertLine
          id="0"
          onClick={e => {
            setPositionNewWidget(0);
            setMenuWidgets(true);
          }}
        />
      )}
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
                display: element.type === "citation" ? "flex" : null,
                fontSize: "16px",
                minHeight: element.image
                  ? element.imageOptions.height + "px"
                  : ""
              }}
              onMouseDown={() => {
                if (state.ReadOnly !== index)
                  setState({ type: "ReadOnly", index: index });
              }}
            >
              {element.image && (
                <Popover
                  placement="bottom"
                  content={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <Radio.Group
                        size="large"
                        defaultValue={element.imageOptions.align}
                        onChange={e => {
                          e.preventDefault();
                          e.stopPropagation();

                          setState({ type: "ReadOnly", index: index });
                          setState({
                            type: "ImageOptions",
                            option: "align",
                            value: e.target.value,
                            index: index
                          });
                        }}
                      >
                        <Radio.Button value="left">
                          <Icon type="pic-left" />
                        </Radio.Button>
                        <Radio.Button value="center">
                          <Icon type="pic-center" />
                        </Radio.Button>
                        <Radio.Button value="right">
                          <Icon type="pic-right" />
                        </Radio.Button>
                      </Radio.Group>
                      <TextArea
                        defaultValue={element.imageOptions.legende}
                        onChange={e =>
                          setState({
                            type: "ImageOptions",
                            option: "legende",
                            value: e.target.value,
                            index: index
                          })
                        }
                        style={{ marginTop: "10px" }}
                      />
                    </div>
                  }
                >
                  <div
                    style={{
                      float:
                        element.imageOptions.align === "center"
                          ? "none"
                          : element.imageOptions.align,
                      display: "flex",
                      justifyContent: "center",
                      zIndex: -1,
                      margin:
                        element.imageOptions.align === "center" ? "auto" : null,

                      marginLeft: element.imageOptions.marginLeft,
                      marginRight: element.imageOptions.marginRight,
                      marginBottom: element.imageOptions.marginBottom
                    }}
                  >
                    <ResizableBox
                      height={parseInt(element.imageOptions.height)}
                      width={parseInt(element.imageOptions.width)}
                      lockAspectRatio={element.imageOptions.ratioActif}
                      onResizeStop={(e, a) => {
                        setState({
                          type: "ImageOptions",
                          option: "height",
                          value: a.size.height,
                          index: index
                        });
                        setState({
                          type: "ImageOptions",
                          option: "width",
                          value: a.size.width,
                          index: index
                        });
                      }}
                      minConstraints={[20, 20]}
                      maxConstraints={[731, 731]}
                      resizeHandles={
                        element.imageOptions.align !== "right" ? ["se"] : ["sw"]
                      }
                      handle={
                        <span
                          className={
                            element.imageOptions.align !== "right"
                              ? "custom-handle custom-handle-se"
                              : "custom-handle custom-handle-sw"
                          }
                        />
                      }
                      handleSize={[20, 20]}
                    >
                      <img
                        style={{
                          height: "inherit",
                          width: "inherit",
                          paddingBottom: "10px",
                          paddingLeft:
                            element.imageOptions.align === "right"
                              ? "10px"
                              : "0px",
                          paddingRight:
                            element.imageOptions.align === "left"
                              ? "10px"
                              : "0px"
                        }}
                        src={element.imageOptions.src}
                        alt={element.imageOptions.legende}
                      />
                    </ResizableBox>
                  </div>
                </Popover>
              )}
              {element.type === "citation" && (
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    minWidth: "6px",
                    marginRight: "30px",
                    float: "left"
                  }}
                />
              )}
              <Slate
                index={index}
                value={element.value}
                readOnly={state.ReadOnly !== index}
              />
            </ConteneurSlate>

            {insertWidget && (
              <InsertLine
                id={index + 1}
                onMouseDown={() => {
                  setPositionNewWidget(index + 1);
                  setMenuWidgets(true);
                }}
              />
            )}
          </Element>
        );
      })}

      <Button
        onMouseDown={() => {
          setState({ type: "ReadOnly", index: null });
          setMenuParametres(false);
          setInsertWidget(true);
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
          position={positionNewWidget}
        />
      </Drawer>
    </ConteneurGlobal>
  );
};
export default Creation;

const MenuWidgets = ({ position }) => {
  const [state, setState] = useContext(ListeContext);
  return (
    <ConteneurWidget>
      <FondWidget
        onMouseDown={() =>
          setState({ type: "Ajout", value: "titre", index: position })
        }
      >
        <h1 style={{ margin: "10px", textAlign: "center" }}>Titre</h1>
      </FondWidget>
      <FondWidget
        style={{ backgroundColor: "white" }}
        onMouseDown={() =>
          setState({ type: "Ajout", value: "chapitre", index: position })
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background: "white"
          }}
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
              backgroundColor: "rgb(254, 243, 189)"
            }}
          >
            1
          </div>
          <h2 style={{ margin: "10px" }}>Chapitre</h2>
        </div>
      </FondWidget>
      <FondWidget
        style={{ backgroundColor: "white" }}
        onMouseDown={() =>
          setState({ type: "Ajout", value: "sousChapitre", index: position })
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background: "white"
          }}
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
              marginLeft: "5px",
              backgroundColor: "rgb(254, 243, 189)"
            }}
          >
            1.1
          </div>
          <h3 style={{ margin: "10px" }}> Sous Chapitre</h3>
        </div>
      </FondWidget>
      <FondWidget
        style={{ backgroundColor: "white", border: "1px dashed lightgrey" }}
        onMouseDown={() =>
          setState({ type: "Ajout", value: "paragraphe", index: position })
        }
      >
        <p style={{ margin: "10px" }}>Paragraphe</p>
      </FondWidget>
      <FondWidget
        style={{
          display: "flex",
          backgroundColor: "white",
          border: "1px dashed lightgrey"
        }}
        onMouseDown={() =>
          setState({ type: "Ajout", value: "citation", index: position })
        }
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            width: "6px",
            marginRight: "30px"
          }}
        />
        <p style={{ margin: "10px" }}>Citation</p>
      </FondWidget>
    </ConteneurWidget>
  );
};

const InsertLine = ({ id }) => {
  return (
    <div
      style={{
        borderTop: "1px dashed lightblue",
        position: "relative",
        height: "1px",
        cursor: "pointer"
      }}
    >
      <Icon
        id={id}
        style={{
          position: "absolute",
          right: "-30px",
          top: "-15px",
          fontSize: "24px",
          backgroundColor: "lightblue",
          padding: "3px",
          borderRadius: "50%"
        }}
        type="plus"
      />
    </div>
  );
};
