import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Icon, Tooltip, Drawer, Popconfirm } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { initialValueCours } from "../Creation/reducer";
import axios from "axios";
import { useCookies } from "react-cookie";
const Conteneur = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
const ConteneurCours = styled.div`
  display: flex;
  height: 100px;
  margin-bottom: 20px;
`;
const ConteneurTitreDesc = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 700px;
  padding: 10px;
  background-color: white;
  margin-right: 10px;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 0 3px lightgrey;
  }
`;
const Titre = styled.div`
  color: orange;
  font-size: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  overflow: hidden;
`;

const ConteneurIcone = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ConteneurInformations = styled.div`
  display: flex;
  flex-direction: column;
`;

const getListStyle = isDraggingOver => ({
  padding: grid
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  ...draggableStyle
});

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const grid = 2;

const ListeCours = props => {
  const [showModif, setShowModif] = useState(false);
  const [state, setState] = useState([]);
  const [id, setId] = useState(0);
  const history = useHistory();
  const refTitre = useRef(null);
  const refDescription = useRef(null);
  const [cookies] = useCookies();

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(state, result.source.index, result.destination.index);

    setState(items);
    const ordre = items.map((el, index) => {
      return { id: el.id, position: index + 1 };
    });

    axios.create({ baseURL: "/api", auth: document.cookie.token.substring(7), responseType: "json" }).post("/PositionCours", ordre);
  }

  function ajoutCours() {
    axios.create({
      baseURL: "/api/",
      headers: { authorization: cookies.token.substring(7) },
      responseType: "json"
    }).post(`/Cours`, {
      Titre: "Nouveau Cours",
      Description: "Description manquante",
      Contenu: JSON.stringify(initialValueCours.Cours),
      type: "Cours",
      position: state.length + 1
    }).then(() => {
      localStorage.removeItem("Cours");
    });
  }

  function ajoutExercice() {
    axios.create({
      baseURL: "/api/",
      headers: { authorization: cookies.token.substring(7) },
      responseType: "json"
    }).post(`/Cours`, {
      Titre: "Nouvel exercice",
      Description: "Description manquante",
      Contenu: JSON.stringify(initialValueCours.Cours),
      type: "Exercice",
      position: state.length + 1
    }).then(() => {
      localStorage.removeItem("Cours");
    });
  }
  useEffect(() => {
    if (state.length === 0) {
      axios.create({
        baseURL: "/api/",
        headers: { authorization: cookies.token.substring(7) },
        responseType: "json"
      }).get(`/${props.type}`).then(rep => {
        setState(rep.data);
      });
    }
  });
  return (
    <Conteneur>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {state.map((el, index) => {
                if (el.id > 1) {
                  return (
                    <Draggable
                      key={el.id.toString()}
                      draggableId={el.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <ConteneurCours key={`${props.type}-${index}`}>
                            <ConteneurTitreDesc
                              onClick={() => {
                                localStorage.setItem(
                                  "Cours",
                                  JSON.stringify({
                                    Cours: JSON.parse(state[index].contenu),
                                    id: "/" + state[index].id,
                                    titre: state[index].titre,
                                    description: state[index].description,
                                    type: state[index].type
                                  })
                                );
                                history.push("/admin/Cours/Creation");
                              }}
                            >
                              <Titre>{el.titre}</Titre>
                              <Description>{el.description}</Description>
                            </ConteneurTitreDesc>
                            <ConteneurIcone>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  marginRight: "10px"
                                }}
                              >
                                <Tooltip
                                  placement="top"
                                  title="Voir les détails"
                                >
                                  <Button
                                    style={{ height: "45px", width: "45px" }}
                                    onMouseDown={() => {
                                      setId(index);
                                      setShowModif(true);
                                    }}
                                  >
                                    <Icon type="eye" />
                                  </Button>
                                </Tooltip>
                                <Tooltip
                                  placement="bottom"
                                  title="Editer le  sujet"
                                >
                                  <Button
                                    style={{ height: "45px", width: "45px" }}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "Cours",
                                        JSON.stringify({
                                          cours: JSON.parse(
                                            state[index].contenu
                                          ),
                                          id: "/" + state[index].id,
                                          titre: state[index].titre,
                                          description: state[index].description,
                                          type: state[index].type
                                        })
                                      );
                                      history.push("/admin/Cours/Creation");
                                    }}
                                  >
                                    <Icon type="edit" />
                                  </Button>
                                </Tooltip>
                              </div>
                              <Popconfirm
                                placement="right"
                                title="Supprimer le sujet"
                                okText="Supprimer"
                                cancelText="Annuler"
                                onConfirm={() => {
                                  if (state[index].id !== 1) {
                                    axios.create({
                                      baseURL: "/api/",
                                      headers: { authorization: cookies.token.substring(7) },
                                      responseType: "json"
                                    }).post(
                                      `/SuppressionCours/${state[index].id}`
                                    ).then(() => {
                                      let item = JSON.parse(
                                        localStorage.getItem("Cours")
                                      );
                                      if (
                                        item &&
                                        `/${state[index].id}` === item.id
                                      ) {
                                        localStorage.removeItem("Cours");
                                      }
                                    });
                                  }
                                }}
                              >
                                <Button
                                  type="danger"
                                  style={{ height: "100px", width: "45px" }}
                                >
                                  <Icon type="delete" />
                                </Button>
                              </Popconfirm>
                            </ConteneurIcone>
                          </ConteneurCours>
                        </div>
                      )}
                    </Draggable>
                  );
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showModif && (
        <Drawer
          width="400"
          visible={showModif}
          onClose={() => setShowModif(false)}
          title="Informations"
        >
          {state.length > 0 && (
            <ConteneurInformations>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>ID:</div>
              <div style={{ marginBottom: "10px" }}>{state[id].id}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                Date de création:
              </div>
              <div style={{ marginBottom: "10px" }}>{state[id].created_at}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                Dernière modification
              </div>
              <div style={{ marginBottom: "30px" }}>{state[id].updated_at}</div>

              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                Titre :
              </div>
              <TextArea
                ref={refTitre}
                style={{ marginBottom: "10px" }}
                defaultValue={state[id].titre}
              ></TextArea>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                Description :
              </div>
              <TextArea
                ref={refDescription}
                style={{ marginBottom: "10px", minHeight: "300px" }}
                defaultValue={state[id].description}
              ></TextArea>
              <Button
                type="primary"
                onMouseDown={() => {
                  axios.create({
                    baseURL: "/api/",
                    headers: { authorization: cookies.token.substring(7) },
                    responseType: "json"
                  }).post(`/Cours/${state[id].id}`, {
                    Titre: refTitre.current.state.value,
                    Description: refDescription.current.state.value
                  }).then(() => {
                    setShowModif(false);
                  });
                }}
              >
                Enregistrer les modifications
              </Button>
            </ConteneurInformations>
          )}
        </Drawer>
      )}

      <Button
        style={{ width: "200px" }}
        type="dashed"
        icon="plus"
        onMouseDown={() => {
          if (props.type === "Cours") ajoutCours();
          if (props.type === "Exercices") ajoutExercice();
        }}
      >
        {props.type === "Cours" && <span>Ajouter un cours</span>}
        {props.type === "Exercices" && <span>Ajouter un exercice</span>}
      </Button>
    </Conteneur>
  );
};
export default ListeCours;
