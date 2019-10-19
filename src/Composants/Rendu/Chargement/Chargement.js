import React from "react";
import { Card, Spin } from "antd";
import styled from "styled-components";

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Chargement = () => {
    return (
        <Conteneur>
            <Card
                style={{
                    width: "500px",
                    height: "700px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Spin />
            </Card>
        </Conteneur>
    );
};

export default Chargement;
