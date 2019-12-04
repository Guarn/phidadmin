import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "antd";
import { ReactComponent as Plus } from "../../Assets/plus.svg";
import "./Choix.css";

const BtnAdd = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConteneurTitre = styled.div``;
const Titre = styled.div`
  color: #2196f3;
  border: 1px solid #2196f3;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  user-select: none;
`;

const ConteneurBtn = styled.div`
  display: flex;
  flex-direction: row;
`;

const ConteneurContenu = styled.div``;

const Choix = props => {
  const [showTitre, setShowTitre] = useState(false);
  const [showChapitre, setShowChapitre] = useState(false);
  const [showContenu, setShowContenu] = useState(false);
  return (
    <BtnAdd>
      <Plus id="PP" onClick={() => setShowTitre(!showTitre)} />
      {showTitre && (
        <ConteneurBtn>
          <Titre onClick={() => setShowChapitre(true)}>Chapitre</Titre>

          <Titre
            onClick={() => {
              setShowTitre(false);
              setShowChapitre(false);
              props.ajout("titre");
            }}
          >
            Contenu
          </Titre>
        </ConteneurBtn>
      )}
      {showChapitre && (
        <ConteneurBtn>
          <Titre
            onClick={() => {
              setShowTitre(false);
              setShowChapitre(false);
              props.ajout("chapitre");
            }}
          >
            Chapitre
          </Titre>
          <Titre
            onClick={() => {
              setShowTitre(false);
              setShowChapitre(false);
              props.ajout("sousChapitre");
            }}
          >
            Sous Chapitre
          </Titre>
        </ConteneurBtn>
      )}
    </BtnAdd>
  );
};
export default Choix;
