import React, { useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import {
  Card,
  Icon,
  Popover,
  Input,
  Button,
  Drawer,
  Popconfirm,
  Select
} from "antd";
import Axios from "../../Fonctionnels/Axios";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { initialValueIndexes } from "../Cours/Creation/reducer";

const Conteneur = styled.div`
  background-color: rgba(0, 0, 0, 0.03);
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px;
`;

const CardListe = styled(Card)`
  flex: 1;
  transition: all 0.2s;
  min-height: 600px;
  min-width: 200px;
  overflow: auto;
  max-height: 90%;
`;

const ConteneurDrawer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nom = styled.div`
  margin-bottom: 5px;
  padding: 4px;
  transition: all 0.2s;
  border: 1px dashed rgba(00, 0, 0, 0);

  &:hover {
    border: 1px dashed rgba(00, 0, 0, 0.2);
  }
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

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 1;

const Index = () => {
  const [state, setState] = useState({
    notions: [],
    termes: [],
    auteurs: []
  });
  const refChamp = useRef(null);

  const [refresh, setRefresh] = useState(0);
  const [menuIndex, setMenuIndex] = useState(false);
  const [idParam, setIdParam] = useState(null);
  const [popCreation, setPopCreation] = useState(false);
  const history = useHistory();

  const getList = cat => state[cat];

  const onDragEnd = result => {
    let id = parseInt(result.draggableId);
    let type;

    switch (result.destination.droppableId) {
      case "notions":
        type = "notion";
        break;
      case "termes":
        type = "terme";
        break;
      case "auteurs":
        type = "auteur";
        break;
      default:
        break;
    }

    const { source, destination } = result;
    let newState = { ...state };
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      newState[source.droppableId] = items;

      setState(newState);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      newState[source.droppableId] = result[source.droppableId];
      newState[destination.droppableId] = result[destination.droppableId];
      Axios.post("IndexesUpdate", {
        id: id,
        type: type
      });
      setState(newState);
    }
  };

  useEffect(() => {
    Axios.get("/Indexes").then(rep => {
      let newState = { notions: [], termes: [], auteurs: [] };
      rep.data.map(el => {
        switch (el.type) {
          case "notion":
            newState.notions.push(el);
            break;
          case "terme":
            newState.termes.push(el);
            break;
          case "auteur":
            newState.auteurs.push(el);
            break;

          default:
            break;
        }
        return null;
      });

      setState(newState);
    });
  }, [refresh]);

  return (
    <Conteneur>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notions">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <CardListe
                title="Notions"
                bodyStyle={{ padding: "0px" }}
                extra={
                  <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                      <div>
                        <Input
                          ref={refChamp}
                          style={{ marginBottom: "10px" }}
                          placeholder="Titre de l'index..."
                        />

                        <Button
                          block
                          type="primary"
                          size="small"
                          onMouseDown={() => {
                            setPopCreation(false);

                            Axios.post("/Indexes", {
                              nom: refChamp.current.state.value,
                              type: "notion",
                              lettre: refChamp.current.state.value
                                .charAt(0)
                                .toUpperCase()
                            }).then(() => setRefresh(refresh + 1));
                          }}
                        >
                          Créer
                        </Button>
                      </div>
                    }
                  >
                    <Icon
                      onMouseDown={() => setPopCreation(true)}
                      type="plus-circle"
                      style={{
                        color: "#3a92ff",
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                    />
                  </Popover>
                }
              >
                {state.notions.map((item, index) => (
                  <Draggable
                    key={item.id.toString()}
                    draggableId={item.id.toString()}
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
                        <Nom
                          onMouseDown={() => {
                            setIdParam(item);
                            setMenuIndex(true);
                          }}
                        >
                          {item.nom}
                        </Nom>
                      </div>
                    )}
                  </Draggable>
                ))}
              </CardListe>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="termes">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <CardListe
                title="Termes"
                bodyStyle={{ padding: "0px" }}
                extra={
                  <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                      <div>
                        <Input
                          ref={refChamp}
                          style={{ marginBottom: "10px" }}
                          placeholder="Titre de l'index..."
                        />

                        <Button
                          block
                          type="primary"
                          size="small"
                          onMouseDown={() => {

                            Axios.post("/Indexes", {
                              nom: refChamp.current.state.value,
                              type: "terme",
                              lettre: refChamp.current.state.value
                                .charAt(0)
                                .toUpperCase()
                            }).then(() => setRefresh(refresh + 1));
                          }}
                        >
                          Créer
                        </Button>
                      </div>
                    }
                  >
                    <Icon
                      type="plus-circle"
                      style={{
                        color: "#3a92ff",
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                    />
                  </Popover>
                }
              >
                {state.termes.map((item, index) => (
                  <Draggable
                    key={item.id.toString()}
                    draggableId={item.id.toString()}
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
                        <Nom
                          onMouseDown={() => {
                            setIdParam(item);
                            setMenuIndex(true);
                          }}
                        >
                          {item.nom}
                        </Nom>
                      </div>
                    )}
                  </Draggable>
                ))}
              </CardListe>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="auteurs">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <CardListe
                title="Auteurs"
                bodyStyle={{ padding: "0px" }}
                extra={
                  <Popover
                    placement="bottom"
                    trigger="click"
                    butt
                    content={
                      <div>
                        <Input
                          ref={refChamp}
                          style={{ marginBottom: "10px" }}
                          placeholder="Titre de l'index..."
                        />

                        <Button
                          block
                          type="primary"
                          size="small"
                          onMouseDown={() => {

                            Axios.post("/Indexes", {
                              nom: refChamp.current.state.value,
                              type: "auteur",
                              lettre: refChamp.current.state.value
                                .charAt(0)
                                .toUpperCase()
                            }).then(() => setRefresh(refresh + 1));
                          }}
                        >
                          Créer
                        </Button>
                      </div>
                    }
                  >
                    <Icon
                      type="plus-circle"
                      style={{
                        color: "#3a92ff",
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                    />
                  </Popover>
                }
              >
                {state.auteurs.map((item, index) => (
                  <Draggable
                    key={item.id.toString()}
                    draggableId={item.id.toString()}
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
                        <Nom
                          onMouseDown={() => {

                            setIdParam(item);
                            setMenuIndex(true);
                          }}
                        >
                          {item.nom}
                        </Nom>
                      </div>
                    )}
                  </Draggable>
                ))}
              </CardListe>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {menuIndex && (
        <Drawer
          title="Propriétés de l'index"
          visible={menuIndex}
          onClose={() => {
            setMenuIndex(false);
            Axios.post(`/IndexesUpdate`, {
              id: idParam.id,
              nom: idParam.nom,
              type: idParam.type,
              lettre: idParam.lettre
            }).then(() => setRefresh(refresh + 1));
          }}
        >
          <ConteneurDrawer>
            <div style={{ fontWeight: "bold" }}>Id :</div>
            <div style={{ marginBottom: "10px" }}>{idParam.id}</div>
            <div style={{ fontWeight: "bold" }}>Nom :</div>
            <Input
              defaultValue={idParam.nom}
              style={{ marginBottom: "10px" }}
              onChange={e => setIdParam({ ...idParam, nom: e.target.value })}
            />
            <div style={{ fontWeight: "bold" }}>Catégorie :</div>
            <Select
              defaultValue={idParam.type}
              style={{ marginBottom: "10px" }}
              onChange={e => setIdParam({ ...idParam, type: e })}
            >
              <Select.Option value="notion">Notion</Select.Option>
              <Select.Option value="terme">Terme</Select.Option>
              <Select.Option value="auteur">Auteur</Select.Option>
            </Select>
            <div style={{ fontWeight: "bold" }}>Lettre correspondante :</div>
            <Select
              defaultValue={idParam.lettre}
              onChange={e => setIdParam({ ...idParam, lettre: e })}
              style={{ marginBottom: "20px" }}
            >
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="C">C</Select.Option>
              <Select.Option value="D">D</Select.Option>
              <Select.Option value="E">E</Select.Option>
              <Select.Option value="F">F</Select.Option>
              <Select.Option value="G">G</Select.Option>
              <Select.Option value="H">H</Select.Option>
              <Select.Option value="I">I</Select.Option>
              <Select.Option value="J">J</Select.Option>
              <Select.Option value="K">K</Select.Option>
              <Select.Option value="L">L</Select.Option>
              <Select.Option value="M">M</Select.Option>
              <Select.Option value="N">N</Select.Option>
              <Select.Option value="O">O</Select.Option>
              <Select.Option value="P">P</Select.Option>
              <Select.Option value="Q">Q</Select.Option>
              <Select.Option value="R">R</Select.Option>
              <Select.Option value="S">S</Select.Option>
              <Select.Option value="T">T</Select.Option>
              <Select.Option value="U">U</Select.Option>
              <Select.Option value="V">V</Select.Option>
              <Select.Option value="W">W</Select.Option>
              <Select.Option value="X">X</Select.Option>
              <Select.Option value="Y">Y</Select.Option>
              <Select.Option value="Z">Z</Select.Option>
            </Select>
            <Button
              onMouseDown={() => {
                Axios.post(`/IndexesUpdate`, {
                  id: idParam.id,
                  nom: idParam.nom,
                  type: idParam.type,
                  lettre: idParam.lettre
                });
                Axios.get("/Indexes/" + idParam.id).then(rep => {
                  localStorage.setItem(
                    "Cours",
                    JSON.stringify({
                      Cours:
                        rep.data.description === null
                          ? initialValueIndexes.Cours
                          : rep.data.description,
                      id: rep.data.id,
                      type: "indexes"
                    })
                  );
                  history.push("/Cours/Creation");
                });
              }}
            >
              Modifier le contenu
            </Button>
            <Popconfirm
              placement="bottom"
              title="Supprimer l'index ?"
              cancelText="Annuler"
              okText="Supprimer"
              onConfirm={() => {
                setMenuIndex(false);
                Axios.post("/IndexesDestroy", { id: idParam.id }).then(() =>
                  setRefresh(refresh + 1)
                );
              }}
            >
              <Button style={{ marginTop: "80px" }} type="danger">
                Supprimer l'index
              </Button>
            </Popconfirm>
          </ConteneurDrawer>
        </Drawer>
      )}
    </Conteneur>
  );
};
export default Index;
