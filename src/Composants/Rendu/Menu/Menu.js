import React, { useEffect } from "react";
import styled from "styled-components";
import { Divider, Icon } from "antd";
import { ReactComponent as Logo } from "../../Assets/Logo.svg";
import { withRouter } from "react-router-dom";

const ConteneurMenu = styled.div`
  display: flex;
  width: 250px;
  flex-direction: column;
  z-index: 2;
  height: 100vh;
`;
const ConteneurMenuHeader = styled.div`
  display: flex;
  height: 56px;
  z-index: 1;
  width: 250px;
  background-color: #3a92ff;
`;
const HeaderTexte = styled.div`
  font-family: "Roboto";
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3em;
  margin: 9px;
`;

const Categorie = styled.div`
  display: flex;
  flex-direction: column;
`;

const Lien = styled.div`
  display: flex;
  height: 40px;
  user-select: none;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  transition: all 0.3s;
`;

const TexteLien = styled.div`
  user-select: none;
  font-family: "Roboto";
  margin-left: 20px;
`;

const ConteneurMenuLiens = styled.div`
  box-shadow: 1px 0 1px 1px hsla(0, 0%, 78%, 0.2);
  background-color: white;
  height: 100%;
  overflow: auto;
  padding-bottom: 20px;
`;

const ConteneurBoutons = styled.div``;

const Menu = props => {
  let changementPage = UrlPage => {
    props.history.push(UrlPage);
  };

  useEffect(() => {}, []);

  return (
    <ConteneurMenu>
      <ConteneurMenuHeader>
        <Logo style={{ margin: "8px", height: "40px" }} />
        <HeaderTexte>Administration</HeaderTexte>
      </ConteneurMenuHeader>
      <ConteneurMenuLiens>
        <Lien style={{ marginTop: "10px" }} onClick={() => changementPage("/")}>
          <Icon
            style={{
              fontSize: "25px",
              color: "grey",
              marginLeft: "15px"
            }}
            type="dashboard"
          />
          <TexteLien>Tableau de bord</TexteLien>
        </Lien>
        <Categorie>
          <Divider orientation="left">Sujets</Divider>
          <Lien onClick={() => changementPage("/Sujets/Creation")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-add"
            />
            <TexteLien>Création</TexteLien>
          </Lien>
          <Lien onClick={() => changementPage("/Sujets/Consultation")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-search"
            />
            <TexteLien>Consultation</TexteLien>
          </Lien>
          <Lien onClick={() => changementPage("/Sujets/Parametres")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="setting"
            />
            <TexteLien>Paramètres</TexteLien>
          </Lien>
        </Categorie>
        <Categorie>
          <Divider orientation="left">Utilisateurs</Divider>
          <Lien onClick={() => changementPage("/Utilisateurs/Gestion")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-add"
            />
            <TexteLien>Gestion</TexteLien>
          </Lien>
          <Lien>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-search"
            />
            <TexteLien>Groupes</TexteLien>
          </Lien>
          <Lien>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="setting"
            />
            <TexteLien>Paramètres</TexteLien>
          </Lien>
        </Categorie>
        <Categorie>
          <Divider orientation="left">Cours</Divider>
          <Lien
            onClick={() => {
              if (JSON.parse(localStorage.getItem("Cours"))) {
                changementPage("/Cours/Creation");
              }
            }}
          >
            <Icon
              style={{
                fontSize: "25px",
                color: JSON.parse(localStorage.getItem("Cours"))
                  ? "grey"
                  : "rgba(0,0,0,0.2)",
                marginLeft: "15px"
              }}
              type="file-add"
            />
            <TexteLien
              style={{
                color: JSON.parse(localStorage.getItem("Cours"))
                  ? "grey"
                  : "rgba(0,0,0,0.2)"
              }}
            >
              Création
            </TexteLien>
          </Lien>
          <Lien onClick={() => changementPage("/Cours/Modification")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-search"
            />
            <TexteLien>Pages uniques</TexteLien>
          </Lien>
          <Lien onClick={() => changementPage("/Cours/ListeCours")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-search"
            />
            <TexteLien>Cours</TexteLien>
          </Lien>
          <Lien onClick={() => changementPage("/Cours/ListeExercices")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-search"
            />
            <TexteLien>Exercices</TexteLien>
          </Lien>
        </Categorie>
        <Categorie>
          <Divider orientation="left">Index</Divider>
          <Lien onClick={() => changementPage("/Index/Gestion")}>
            <Icon
              style={{
                fontSize: "25px",
                color: "grey",
                marginLeft: "15px"
              }}
              type="file-add"
            />
            <TexteLien>Gestion</TexteLien>
          </Lien>
        </Categorie>
      </ConteneurMenuLiens>
      <ConteneurBoutons></ConteneurBoutons>
    </ConteneurMenu>
  );
};

export default withRouter(Menu);
