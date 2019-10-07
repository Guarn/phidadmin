import React from "react";
import styled from "styled-components";
import Divider from "antd/es/divider";
import Icon from "antd/es/icon";
import { ReactComponent as Logo } from "../../Assets/Logo.svg";

const ConteneurMenu = styled.div`
    display: flex;
    width: 250px;
    flex-direction: column;
    position: fixed;
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
    return (
        <ConteneurMenu>
            <ConteneurMenuHeader>
                <Logo style={{ margin: "8px", height: "40px" }} />
                <HeaderTexte>Administration</HeaderTexte>
            </ConteneurMenuHeader>
            <ConteneurMenuLiens>
                <Categorie>
                    <Divider orientation="left">SUJETS</Divider>
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
                        <TexteLien>Consultation</TexteLien>
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
