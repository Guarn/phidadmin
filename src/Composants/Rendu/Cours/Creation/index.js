import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import Creation from "./Creation";

const Conteneur = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 100px;
  overflow: auto;
`;

const index = () => {
  return (
    <Conteneur>
      <Card
        style={{
          width: "781px",
          backgroundColor: "#e2e0d8"
        }}
      >
        <Creation />
      </Card>
    </Conteneur>
  );
};
export default index;
