import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Icon, Tooltip, Drawer, Popconfirm } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Conteneur = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
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

const Modification = props => {
  const [showModif, setShowModif] = useState(false);
  const [state, setState] = useState([]);
  const history = useHistory();
  const refTitre = useRef(null);
  const refDescription = useRef(null);
  const [refresh, setrefresh] = useState(1);
  const [cookies] = useCookies();

  useEffect(() => {
    if (state.length === 0)
      axios.create({
        baseURL: "/api/",
        headers: { authorization: cookies.token.substring(7) },
        responseType: "json"
      }).get("/Cours/1").then(rep => setState(rep.data[0]));
  });
  return (
    <Conteneur>
      <ConteneurCours key={`Programme`}>
        <ConteneurTitreDesc
          onMouseDown={() => {
            localStorage.setItem(
              "Cours",
              JSON.stringify({
                Cours: JSON.parse(state.contenu),
                id: "/" + state.id,
                titre: state.titre,
                description: state.description,
                type: "PageUnique"
              })
            );
            history.push("/admin/Cours/Creation");
          }}
        >
          <Titre>{state.titre}</Titre>
          <Description>{state.description}</Description>
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
            <Tooltip placement="top" title="Voir les détails">
              <Button
                style={{ height: "45px", width: "45px" }}
                onMouseDown={() => {
                  setShowModif(true);
                }}
              >
                <Icon type="eye" />
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="Editer le  sujet">
              <Button
                style={{ height: "45px", width: "45px" }}
                onMouseDown={() => {
                  localStorage.setItem(
                    "Cours",
                    JSON.stringify({
                      Cours: JSON.parse(state.contenu)
                    })
                  );
                  history.push("/admin/Cours/Creation");
                }}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
          </div>
        </ConteneurIcone>
      </ConteneurCours>

      <Drawer
        width="400"
        visible={showModif}
        onClose={() => setShowModif(false)}
        title="Informations"
      >
        <ConteneurInformations>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>ID:</div>
          <div style={{ marginBottom: "10px" }}>{state.id}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            Date de création:
          </div>
          <div style={{ marginBottom: "10px" }}>{state.createdAt}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            Dernière modification
          </div>
          <div style={{ marginBottom: "30px" }}>{state.updatedAt}</div>

          <div style={{ fontSize: "16px", fontWeight: "bold" }}>Titre :</div>
          <TextArea
            ref={refTitre}
            style={{ marginBottom: "10px" }}
            defaultValue={state.titre}
          ></TextArea>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            Description :
          </div>
          <TextArea
            ref={refDescription}
            style={{ marginBottom: "10px", minHeight: "300px" }}
            defaultValue={state.description}
          ></TextArea>
          <Button
            type="primary"
            onMouseDown={() => {
              axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
              }).post(`/Cours/${state.id}`, {
                Titre: refTitre.current.state.value,
                Description: refDescription.current.state.value
              }).then(() => {
                setShowModif(false);
                setrefresh(refresh + 1);
              });
            }}
          >
            Enregistrer les modifications
          </Button>
        </ConteneurInformations>
      </Drawer>
    </Conteneur>
  );
};
export default Modification;
