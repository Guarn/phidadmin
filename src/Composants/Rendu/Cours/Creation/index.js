import React, { useReducer, createContext, useState, useContext } from "react";
import styled from "styled-components";
import {
  Card,
  Icon,
  Drawer,
  Radio,
  Divider,
  Button,
  InputNumber,
  Input,
  Switch,
  Modal,
  Checkbox,
  Select
} from "antd";
import Creation from "./Creation";
import {
  initialValueCours,
  initialValueExercice,
  initialValueIndexes,
  reducerCreationCours
} from "./reducer";
import { GithubPicker } from "react-color";
import TableMatiere from "./TableMatiere";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from "react-scroll";
import Axios from "../../../Fonctionnels/Axios";
import { useHistory } from "react-router-dom";

const Conteneur = styled(Element)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  overflow: scroll;
  position: relative;
`;

const ConteneurParametres = styled.div`
  display: flex;
  height: 100px;
  width: calc(100% - 250px);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  position: fixed;
  z-index: 100;
`;

const SousConteneurParametres = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  position: relative;
`;

const Marges = styled.div`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 80px;
  width: 100px;
  margin-left: 10px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
`;
const MargesExt = styled.div`
  position: absolute;
  height: 78px;
  background-color: white;
  width: 98px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 12px;
  &:hover {
    background-color: lightgrey;
  }
`;
const MargesInt = styled.div`
  position: absolute;
  margin: 19px;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 40px;
  font-size: 12px;
  line-height: 12px;
  transition: all 0.2s;
  width: 60px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: lightgrey;
  }
`;

const InputMarge = styled.input`
  width: 18px;
  height: 18px;
  border: none;
  text-align: center;
  background-color: transparent;
`;

const ConteneurMatieres = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 200px;
  height: 80px;
  margin-right: 10px;
`;

const Rectangle = styled.div`
  cursor: pointer;
  width: 20px;
  border: 1px solid lightgrey;
  background-color: ${props => (props.selected ? "lightblue" : "white")};
`;

export const ListeContext = createContext(null);

const CreactionCours = props => {
  const [menuImage, setMenuImage] = useState(false);

  function init() {
    if (
      JSON.parse(localStorage.getItem("Cours")) &&
      JSON.parse(localStorage.getItem("Cours")).type !== "indexes"
    ) {
      return JSON.parse(localStorage.getItem("Cours"));
    } else if (props.type === "Cours") {
      return initialValueCours;
    } else if (props.type === "Exercice") {
      return initialValueExercice;
    } else if (
      JSON.parse(localStorage.getItem("Cours")) &&
      JSON.parse(localStorage.getItem("Cours")).type === "indexes"
    ) {
      return JSON.parse(localStorage.getItem("Cours"));
    }
  }
  const [state, setState] = useReducer(reducerCreationCours, init());

  return (
    <ListeContext.Provider value={[state, setState]}>
      <Conteneur id="ScrollConteneur" className="element">
        <MenuParametres
          menuImage={menuImage}
          setMenuImage={val => setMenuImage(val)}
        />

        <Card
          style={{
            marginTop: "140px",
            marginBottom: "100px",
            marginLeft: "20px",
            width: "781px"
          }}
        >
          <Creation modal={menuImage} />
        </Card>
        <Card
          style={{
            position: "fixed",
            top: "196px",
            width: "250px",
            left: "1071px",
            zIndex: "1"
          }}
        >
          <TableMatiere />
        </Card>
      </Conteneur>
    </ListeContext.Provider>
  );
};
export default CreactionCours;

const MenuParametres = ({ menuImage, setMenuImage }) => {
  const [menuCouleur, setMenuCouleur] = useState(false);
  const [state, setState] = useContext(ListeContext);

  function majParametres(value) {
    if (state.ReadOnly !== null) {
      setState({
        type: "Parametres",
        param: "backgroundColor",
        value
      });
    }
  }

  function getMeta(url) {
    var img = new Image();
    img.src = url;
    img.onload = async function() {
      await setState({
        type: "ImageOptions",
        option: "width",
        value: 100,
        index: state.ReadOnly
      });
      await setState({
        type: "ImageOptions",
        option: "height",
        value: 100 / (this.width / this.height),
        index: state.ReadOnly
      });
      await setState({
        type: "ImageOptions",
        option: "ratio",
        value: this.width / this.height,
        index: state.ReadOnly
      });
      await setState({
        type: "ImageOptions",
        option: "src",
        value: url,
        index: state.ReadOnly
      });
    };
  }
  const selectBefore = (
    <Select>
      <Select.Option value="PDF">PDF</Select.Option>
      <Select.Option value="WEB">WEB</Select.Option>
      <Select.Option value="IMG">IMG</Select.Option>
    </Select>
  );

  return (
    <ConteneurParametres id="drawerParametres">
      {state.ReadOnly === null && <DescriptionCours />}
      {state.ReadOnly >= 0 && state.ReadOnly !== null && (
        <SousConteneurParametres>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              onMouseDown={e => {
                e.stopPropagation();
                setMenuCouleur(!menuCouleur);
              }}
              style={{
                height: "80px",
                width: "20px",
                border: "1px solid rgba(0,0,0,0.1)",
                backgroundColor:
                  state.Cours[state.ReadOnly].options.backgroundColor,

                cursor: "pointer"
              }}
            ></div>
            {menuCouleur && (
              <div
                style={{
                  bottom: "-40px",
                  left: "-5px",
                  position: "absolute",
                  zIndex: "1000"
                }}
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
                    "transparent",
                    "#EB9694",
                    "#FAD0C3",
                    "#FEF3BD",
                    "#C1E1C5",
                    "#BEDADC",
                    "#C4DEF6",
                    "#BED3F3",
                    "#D4C4FB"
                  ]}
                  onChangeComplete={val => {
                    majParametres(val.hex);
                    setMenuCouleur(false);
                  }}
                  width={240}
                />
              </div>
            )}
            <Marges>
              <MargesExt>
                <div style={{ flex: "1", textAlign: "center" }}>
                  <InputMarge
                    placeholder={state.Cours[state.ReadOnly].options.marginTop}
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "marginTop",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: "5"
                  }}
                >
                  <InputMarge
                    placeholder={state.Cours[state.ReadOnly].options.marginLeft}
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "marginLeft",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />

                  <InputMarge
                    placeholder={
                      state.Cours[state.ReadOnly].options.marginRight
                    }
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "marginRight",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />
                </div>
                <div style={{ flex: "1", textAlign: "center" }}>
                  <InputMarge
                    placeholder={
                      state.Cours[state.ReadOnly].options.marginBottom
                    }
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "marginBottom",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />
                </div>
              </MargesExt>
              <MargesInt>
                <div style={{ textAlign: "center" }}>
                  <InputMarge
                    placeholder={state.Cours[state.ReadOnly].options.paddingTop}
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "paddingTop",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "-7px"
                  }}
                >
                  <div>
                    <InputMarge
                      placeholder={
                        state.Cours[state.ReadOnly].options.paddingLeft
                      }
                      onChange={val => {
                        setState({
                          type: "Parametres",
                          param: "paddingLeft",
                          value: parseInt(val.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <InputMarge
                      placeholder={
                        state.Cours[state.ReadOnly].options.paddingRight
                      }
                      onChange={val => {
                        setState({
                          type: "Parametres",
                          param: "paddingRight",
                          value: parseInt(val.target.value)
                        });
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "-9px" }}>
                  <InputMarge
                    placeholder={
                      state.Cours[state.ReadOnly].options.paddingBottom
                    }
                    onChange={val => {
                      setState({
                        type: "Parametres",
                        param: "paddingBottom",
                        value: parseInt(val.target.value)
                      });
                    }}
                  />
                </div>
              </MargesInt>
            </Marges>
            <div
              style={{
                height: "80px",
                border: state.Cours[state.ReadOnly].image
                  ? "1px solid lightblue"
                  : "1px  solid rgba(0, 0, 0, 0.1)",
                padding: "5px",
                marginLeft: "10px",
                display: "flex",
                transition: "all  0.2s",
                overflow: "hidden",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: state.Cours[state.ReadOnly].image
                    ? "lightblue"
                    : "rgba(0, 0, 0, 0.2)"
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({ type: "ImageVisible", index: state.ReadOnly });
                }}
              >
                <Icon
                  type="picture"
                  style={{
                    fontSize: "25px",
                    color: state.Cours[state.ReadOnly].image
                      ? "lightblue"
                      : "rgba(0, 0, 0, 0.1)"
                  }}
                />
                Illustration
              </div>
              {state.Cours[state.ReadOnly].image && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "10px",
                    color: state.Cours[state.ReadOnly].image
                      ? "lightblue"
                      : "rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginLeft: "10px"
                    }}
                  >
                    <Checkbox
                      checked={
                        state.Cours[state.ReadOnly].imageOptions.ratioActif
                      }
                      value="ratio"
                      onChange={e => {
                        setState({
                          type: "ImageOptions",
                          option: "height",
                          value:
                            state.Cours[state.ReadOnly].imageOptions.width /
                            state.Cours[state.ReadOnly].imageOptions.ratio,
                          index: state.ReadOnly
                        });
                        setState({
                          type: "ImageOptions",
                          option: "ratioActif",
                          value: e.target.checked,
                          index: state.ReadOnly
                        });
                      }}
                    >
                      Conserver le ratio
                    </Checkbox>
                    <Input
                      placeholder={
                        state.Cours[state.ReadOnly].imageOptions.src ===
                        "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
                          ? "Url de l'image"
                          : state.Cours[state.ReadOnly].imageOptions.src
                      }
                      onChange={e => {
                        e.preventDefault();
                        getMeta(e.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginLeft: "10px"
                    }}
                  >
                    <Checkbox
                      checked={
                        state.Cours[state.ReadOnly].imageOptions.lienActif
                      }
                      value="ratio"
                      onChange={e => {
                        setState({
                          type: "ImageOptions",
                          option: "lienActif",
                          value: e.target.checked,
                          index: state.ReadOnly
                        });
                      }}
                    >
                      Lien actif
                    </Checkbox>
                    <Input
                      addonBefore={selectBefore}
                      placeholder={
                        state.Cours[state.ReadOnly].imageOptions.lien === ""
                          ? "Url du lien"
                          : state.Cours[state.ReadOnly].imageOptions.lien
                      }
                      onChange={e =>
                        setState({
                          type: "ImageOptions",
                          option: "lien",
                          value: e.target.value,
                          index: state.ReadOnly
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <ConteneurMatieres>
              <div style={{ display: "flex" }}>
                <Switch
                  style={{ flex: 1, marginTop: "0px", marginBottom: "0px" }}
                  checked={state.Cours[state.ReadOnly].TableMatiere.actif}
                  checkedChildren="Visible"
                  unCheckedChildren="Visible"
                  onChange={val => {
                    setState({
                      type: "TableMatiereVisible",
                      value: val,
                      index: state.ReadOnly
                    });
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-evenly"
                  }}
                >
                  <Rectangle
                    selected={
                      state.Cours[state.ReadOnly].TableMatiere.type === "0"
                    }
                    onMouseDown={() =>
                      setState({
                        type: "TableMatiereType",
                        value: "0",
                        index: state.ReadOnly
                      })
                    }
                  />
                  <Rectangle
                    selected={
                      state.Cours[state.ReadOnly].TableMatiere.type === "1"
                    }
                    onMouseDown={() =>
                      setState({
                        type: "TableMatiereType",
                        value: "1",
                        index: state.ReadOnly
                      })
                    }
                  />
                  <Rectangle
                    selected={
                      state.Cours[state.ReadOnly].TableMatiere.type === "2"
                    }
                    onMouseDown={() =>
                      setState({
                        type: "TableMatiereType",
                        value: "2",
                        index: state.ReadOnly
                      })
                    }
                  />
                  <Rectangle
                    selected={
                      state.Cours[state.ReadOnly].TableMatiere.type === "3"
                    }
                    onMouseDown={() =>
                      setState({
                        type: "TableMatiereType",
                        value: "3",
                        index: state.ReadOnly
                      })
                    }
                  />
                </div>
              </div>
              <Input
                style={{ marginTop: "0px", marginBottom: "0px" }}
                placeholder="Titre du lien"
                placeholder={state.Cours[state.ReadOnly].TableMatiere.value}
                onChange={val => {
                  setState({
                    type: "TableMatiere",
                    value: val.target.value,
                    index: state.ReadOnly
                  });
                }}
              />
            </ConteneurMatieres>
            <Button
              icon="delete"
              type="danger"
              style={{ height: "80px" }}
              onMouseDown={e => {
                let index = state.ReadOnly;
                setState({ type: "ReadOnly", value: null });
                setTimeout(() => {
                  setState({ type: "Suppression", index: index });
                }, 100);
              }}
            />
          </div>
        </SousConteneurParametres>
      )}
    </ConteneurParametres>
  );
};

const ConteneurDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  overflow: hidden;
`;

const DescriptionCours = () => {
  const [state, setState] = useContext(ListeContext);
  const history = useHistory();
  function saveBDD() {
    if (state.type === "indexes") {
      Axios.post("/IndexesUpdate", {
        id: state.id,
        description: state.Cours
      }).then(() => {
        localStorage.removeItem("Cours");
        history.push("/Index/Gestion");
      });
    } else {
      Axios.post(`/Cours${state.id}`, {
        Titre: state.Titre,
        Description: state.Description,
        Contenu: JSON.stringify(state.Cours)
      }).then(() => {
        localStorage.removeItem("Cours");
        if (state.type === "PageUnique") history.push("/Cours/Modification");
        if (state.type === "Cours") history.push("/Cours/ListeCours");
        if (state.type === "Exercice") history.push("/Cours/ListeExercices");
      });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",

        justifyContent: "space-between"
      }}
    >
      <ConteneurDescription>
        <div
          style={{
            display: "flex"
          }}
        >
          <div style={{ fontWeight: "bold", marginRight: "10px" }}>
            Titre :
            <span style={{ fontWeight: "normal", marginLeft: "10px" }}>
              {state.Titre}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex"
          }}
        >
          <div style={{ fontWeight: "bold", marginRight: "10px" }}>
            Description :
            <span style={{ fontWeight: "normal", marginLeft: "10px" }}>
              {state.Description}
            </span>
          </div>
        </div>
      </ConteneurDescription>
      <Button
        style={{
          height: "80px",
          width: "80px"
        }}
        onMouseDown={saveBDD}
      >
        <Icon
          type="save"
          style={{
            fontSize: "35px"
          }}
        />
      </Button>
    </div>
  );
};
