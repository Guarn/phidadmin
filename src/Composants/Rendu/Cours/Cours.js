import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CustomEditor from "../../Fonctionnels/CustomEditor";
import Editor from "../../Fonctionnels/Editor";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import Choix from "./Choix";
import { Card, Collapse, Icon, Popover, Button } from "antd";
import uuidv4 from "uuid/v4";
import "./Cours.css";

const Conteneur = styled.div`
  background-color: rgba(0, 0, 0, 0.03);
  height: 100%;
  width: 100%;
  padding: 20px;
  overflow: auto;
`;

const ConteneurTitre = styled.div``;

const TitreChapitre = styled.div`
  display: flex;
`;

const CarreNumero = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(133, 133, 133, 1);
  font-weight: bold;
  display: flex;
  min-width: 41px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const ConteneurEditor = styled.div`
  width: 700px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.1s;

  &:hover {
    background-color: ${props =>
      props.readOnly ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0)"};
  }
`;

const NumeroChapitre = styled.div`
  width: 33px;
  height: 33px;
  line-height: 21px;
  background-color: grey;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
`;

const NumeroSousChapitre = styled.div`
  height: 26px;
  width: 26px;
  margin-left: 10px;
  background-color: grey;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
`;

const ChoixCouleur = styled.div`
  margin: 5px;
  height: 24px;
  width: 24px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background-color: ${props => props.couleur};
`;

const ConteneurChoixMultiple = styled.div`
  display: flex;
  flex-direction: column;
`;
const ConteneurCouleur = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Couleurs = ({ cgtCouleur }) => {
  return (
    <ConteneurCouleur>
      <ChoixCouleur
        onClick={() => cgtCouleur("lightsalmon")}
        couleur="lightsalmon"
      />
      <ChoixCouleur
        onClick={() => cgtCouleur("lightyellow")}
        couleur="lightyellow"
      />
      <ChoixCouleur
        onClick={() => cgtCouleur("lightblue")}
        couleur="lightblue"
      />
      <ChoixCouleur
        onClick={() => cgtCouleur("lightgreen")}
        couleur="lightgreen"
      />
    </ConteneurCouleur>
  );
};

const GenCouleur = ({ cgtCouleur }) => {
  return (
    <Popover content={<Couleurs cgtCouleur={val => cgtCouleur(val)} />}>
      <div
        style={{
          width: "40px",
          backgroundColor: "lightgrey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Icon type="setting" style={{ padding: "10px", fontSize: "20px" }} />
      </div>
    </Popover>
  );
};

const GenListe = props => {
  let countChapitre = 0;
  let countSousChapitre = 0;
  let largeur;

  return props.state.map((el, index) => {
    switch (el.type) {
      case "chapitre":
        largeur = 700 - 33;
        break;
      case "sousChapitre":
        largeur = 700 - 36;
        break;
      case "collapse":
        largeur = 650;
      default:
        largeur = 700;
        break;
    }
    return (
      <ConteneurEditor key={`ConteneurEditor-${index}`} readOnly={el.readOnly}>
        {el.type === "chapitre" && <NumeroChapitre>1</NumeroChapitre>}

        {el.type === "sousChapitre" && (
          <NumeroSousChapitre>1.1</NumeroSousChapitre>
        )}
        {el.type === "collapse" && (
          <div
            style={{
              display: "flex",
              width: "500px",
              height: el.readOnly ? null : "100px"
            }}
          >
            <Collapse
              className="collapse"
              bordered={false}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
            >
              <Collapse.Panel
                header={
                  <CustomEditor
                    key={`Editor-${index}`}
                    readOnly={el.readOnly}
                    width={largeur}
                    value={el.titre}
                    id={index}
                    theme="bubble"
                  />
                }
                style={{ backgroundColor: el.couleur, width: largeur + "px" }}
              >
                <CustomEditor
                  key={`Editor-${index}`}
                  readOnly={el.readOnly}
                  width={largeur}
                  value={el.texte}
                  id={index}
                />
              </Collapse.Panel>
            </Collapse>
            <GenCouleur cgtCouleur={val => props.cgtCouleur(val, index)} />
          </div>
        )}
        {el.type !== "collapse" && (
          <CustomEditor
            key={`Editor-${index}`}
            readOnly={el.readOnly}
            value={el.texte}
            width={largeur}
            id={index}
          />
        )}
      </ConteneurEditor>
    );
  });
};

const ResizeG = styled.div`
  border: 2px dashed lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ResizeD = styled.div`
  border: 2px dashed lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddQQ = styled.div`
  opacity: 1;
  transition: all 0.2s;
  height: 90%;
  width: 90%;
  display: flex;
  justify-content: flex-end;
`;

const Cours = () => {
  useEffect(() => {});
  const [t, tt] = useState({ width: 200, height: 200 });
  const [state, setState] = useState([
    { texte: "TEST 1", readOnly: true, type: "titre" },
    { texte: "TEST 2", readOnly: true, type: "chapitre" },
    { texte: "TEST 3", readOnly: true, type: "sousChapitre" },
    { texte: "TEST 4", readOnly: true, type: "titre" },
    {
      texte: "TEST 6",
      readOnly: true,
      type: "collapse",
      couleur: "lightsalmon",
      titre: "TEST 5"
    }
  ]);

  function cgtCouleur(val, index) {
    let newState = [...state];
    newState[index] = { ...state[index], couleur: val };
    setState(newState);
  }

  function onResize1({ size }) {
    tt({ width: size.width, height: size.height });
  }

  function CalculHauteur(ratio) {
    let hauteurContainer = t.height * 0.9;
    let largeurContainer = 750 - t.width - (750 - t.width) * 0.1;
    if (largeurContainer >= hauteurContainer * 2) {
      return { height: hauteurContainer, width: hauteurContainer * 2 };
    } else {
      return { height: largeurContainer / 2, width: largeurContainer };
    }
  }

  return <Conteneur></Conteneur>;
};
export default Cours;
