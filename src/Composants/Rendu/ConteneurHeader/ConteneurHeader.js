import React from "react";
import styled from "styled-components";

const ContenuHeader = styled.div`
    background-color: white;
    box-shadow: 0 1px 1px 1px hsla(0, 0%, 78%, 0.2);
    height: 56px;
    width: calc(100% - 250px);
    position: fixed;
    z-index: 1;
    top: 0;
    left: 250px;
    overflow: hidden;
`;

const ConteneurHeader = () => {
    return <ContenuHeader style={{ zIndex: "100" }} />;
};

export default ConteneurHeader;
