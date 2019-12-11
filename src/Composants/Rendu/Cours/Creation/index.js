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
  Switch
} from "antd";
import Creation from "./Creation";
import { initialValue, reducerCreationCours } from "./reducer";
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

const CreactionCours = () => {
  let init = JSON.parse(localStorage.getItem("Cours"))
    ? JSON.parse(localStorage.getItem("Cours"))
    : initialValue;
  const [state, setState] = useReducer(reducerCreationCours, init);

  return (
    <ListeContext.Provider value={[state, setState]}>
      <Conteneur id="ScrollConteneur" className="element">
        <MenuParametres />

        <Card
          style={{
            marginTop: "140px",
            marginBottom: "100px",
            marginLeft: "20px",
            width: "781px"
          }}
        >
          <Creation />
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

const MenuParametres = () => {
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
                  onChangeComplete={val => {
                    majParametres(val.hex);
                    setMenuCouleur(false);
                  }}
                  width={212}
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
                setState({ type: "Suppression", index: index });
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
    Axios.post(`/Cours${state.id}`, {
      Titre: state.Titre,
      Description: state.Description,
      Contenu: JSON.stringify(state.Cours)
    }).then(() => {
      localStorage.removeItem("Cours");
      history.push("/Cours/Modification");
    });
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
