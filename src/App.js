import React from "react";
import styled from "styled-components";
import "./App.css";
import Consultation from "./Composants/Rendu/Sujets/Consultation";
import Menu from "./Composants/Rendu/Menu/Menu";
import ConteneurHeader from "./Composants/Rendu/ConteneurHeader/ConteneurHeader";

const ConteneurGlobal = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const ConteneurContenu = styled.div`
    height: 100%;
    width: calc(100vw - 250px);
    .ant-select-selection__choice {
        visibility: ${(props) => (props.chargement ? "hidden" : "")};
    }
`;

function App() {
    return (
        <ConteneurGlobal>
            <Menu />
            <ConteneurContenu>
                <ConteneurHeader />
                <Consultation />
            </ConteneurContenu>
        </ConteneurGlobal>
    );
}

export default App;
