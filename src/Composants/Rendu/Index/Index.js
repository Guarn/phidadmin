import React, { useEffect } from "react";
import styled from "styled-components";
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
import { useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { initialValueIndexes } from "../Cours/Creation/reducer";
import axios from "axios";
import { useCookies } from "react-cookie";

const Conteneur = styled.div`
  background-color: rgba(0, 0, 0, 0.03);
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px;
`;

const CardListe = styled(Card)`
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
  cursor: pointer;
  &:hover {
    border: 1px dashed rgba(00, 0, 0, 0.2);
  }
`;

const Index = props => {
  let location = useLocation();
  const [cookies] = useCookies();

  if (location.hash !== "" && location.hash.charAt(0) === "#") {
    let iD = location.hash.substring(1);
    axios.create({
      baseURL: "/api/",
      headers: { authorization: cookies.token.substring(7) },
      responseType: "json"
    }).get("/Indexes/" + iD).then(rep => {
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
      history.push("/admin/Cours/Creation");
    });
  }
  const [state, setState] = useState({
    notions: [],
    termes: [],
    auteurs: []
  });
  const refChamp = useRef(null);

  const [refresh, setRefresh] = useState(0);
  const [menuIndex, setMenuIndex] = useState(false);
  const [idParam, setIdParam] = useState(null);
  const [, setPopCreation] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios.create({
      baseURL: "/api/",
      headers: { authorization: cookies.token.substring(7) },
      responseType: "json"
    }).get("/Indexes").then(rep => {
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
  }, [refresh, cookies.token]);

  return (
    <Conteneur>
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

                    axios.create({
                      baseURL: "/api/",
                      headers: { authorization: cookies.token.substring(7) },
                      responseType: "json"
                    }).post("/Indexes", {
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
          <Nom
            key={`notion-${index}`}
            onMouseDown={() => {
              setIdParam(item);
              setMenuIndex(true);
            }}
          >
            {item.nom}
          </Nom>
        ))}
      </CardListe>

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
                    axios.create({
                      baseURL: "/api/",
                      headers: { authorization: cookies.token.substring(7) },
                      responseType: "json"
                    }).post("/Indexes", {
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
          <Nom
            key={`termes-${index}`}
            onMouseDown={() => {
              setIdParam(item);
              setMenuIndex(true);
            }}
          >
            {item.nom}
          </Nom>
        ))}
      </CardListe>

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
                    axios.create({
                      baseURL: "/api/",
                      headers: { authorization: cookies.token.substring(7) },
                      responseType: "json"
                    }).post("/Indexes", {
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
          <Nom
            key={`auteurs-${index}`}
            onMouseDown={() => {
              setIdParam(item);
              setMenuIndex(true);
            }}
          >
            {item.nom}
          </Nom>
        ))}
      </CardListe>

      {menuIndex && (
        <Drawer
          title="Propriétés de l'index"
          visible={menuIndex}
          onClose={() => {
            setMenuIndex(false);
            axios.create({
              baseURL: "/api/",
              headers: { authorization: cookies.token.substring(7) },
              responseType: "json"
            }).post(`/IndexesUpdate`, {
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
            <div style={{ fontWeight: "bold" }}>
              Référence classement alphabétique :
            </div>
            <Input
              defaultValue={idParam.lettre}
              style={{ marginBottom: "10px" }}
              onChange={e => setIdParam({ ...idParam, lettre: e.target.value })}
            />
            <Button
              onMouseDown={() => {
                axios.create({
                  baseURL: "/api/",
                  headers: { authorization: cookies.token.substring(7) },
                  responseType: "json"
                }).post(`/IndexesUpdate`, {
                  id: idParam.id,
                  nom: idParam.nom,
                  type: idParam.type,
                  lettre: idParam.lettre
                });
                axios.create({
                  baseURL: "/api/",
                  headers: { authorization: cookies.token.substring(7) },
                  responseType: "json"
                }).get("/Indexes/" + idParam.id).then(rep => {
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
                  history.push("/admin/Cours/Creation");
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
                axios.create({
                  baseURL: "/api/",
                  headers: { authorization: cookies.token.substring(7) },
                  responseType: "json"
                }).post("/IndexesDestroy", { id: idParam.id }).then(() =>
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
