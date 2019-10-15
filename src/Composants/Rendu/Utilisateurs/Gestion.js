import React from "react";
import styled from "styled-components";
import { withCookies } from "react-cookie";
import { Table } from "antd";

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Gestion = (props) => {
    return <Conteneur></Conteneur>;
};

export default withCookies(Gestion);
