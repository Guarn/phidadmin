import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Divider, Icon } from "antd";
import { ReactComponent as Logo } from "../../Assets/Logo.svg";
import { Redirect } from "react-router-dom";

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
`;

const ConteneurBoutons = styled.div``;

const Menu = () => {
    const [page, setPage] = useState("/");

    let changementPage = (UrlPage) => {
        setPage(UrlPage);
    };

    useEffect(() => {}, []);

    return (
        <ConteneurMenu>
            <Redirect push to={page} />
            <ConteneurMenuHeader>
                <Logo style={{ margin: "8px", height: "40px" }} />
                <HeaderTexte>Administration</HeaderTexte>
            </ConteneurMenuHeader>
            <ConteneurMenuLiens>
                <Lien
                    style={{ marginTop: "10px" }}
                    onClick={() => changementPage("/")}
                >
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
                    <Lien
                        onClick={() => changementPage("/Sujets/Consultation")}
                    >
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
                    <Lien>
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
                    <Lien>
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
                    <Lien>
                        <Icon
                            style={{
                                fontSize: "25px",
                                color: "grey",
                                marginLeft: "15px"
                            }}
                            type="file-search"
                        />
                        <TexteLien>Modification</TexteLien>
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
            </ConteneurMenuLiens>
            <ConteneurBoutons></ConteneurBoutons>
        </ConteneurMenu>
    );
};

export default Menu;
