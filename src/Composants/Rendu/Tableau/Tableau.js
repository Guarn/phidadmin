import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Progress, Icon } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Tableau = (props) => {
    const [countSujets, setCountSujets] = useState(0);
    const [countProb, setCountProb] = useState(0);

    const [cookies] = useCookies();
    const [t, tt] = useState(false);

    useEffect(() => {
        document.title = "PhidAdmin - Tableau de bord ";
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/Tableau").then((rep) => {
            setCountProb(rep.data.countProblemes);
            setCountSujets(rep.data.countSujets);
        });
    }, []);

    return (
        <Conteneur>
            <Card
                style={{ width: 300 }}
                cover={
                    <Progress
                        width={200}
                        style={{ margin: "50px", marginBottom: "0px" }}
                        percent={Math.round(
                            ((countSujets - countProb) / countSujets) * 100
                        )}
                        type="dashboard"
                    />
                }
                actions={[
                    <Icon type="eye" key="view" onClick={() => tt(!t)} />
                ]}
                title="Sujets"
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "baseline",
                        width: "80%",
                        margin: "auto"
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            color: "rgb(16, 142, 233)",
                            width: "30%",
                            textAlign: "right",
                            marginRight: "15px"
                        }}
                    >
                        {countSujets}
                    </div>
                    <span style={{ fontSize: "20px" }}>Sujets</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "baseline",
                        width: "80%",
                        margin: "auto"
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            color: "lightsalmon",
                            textAlign: "right",
                            marginRight: "15px",
                            width: "30%"
                        }}
                    >
                        {countProb}
                    </div>
                    <span style={{ fontSize: "20px" }}>Non vérifiés</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "baseline",
                        width: "80%",
                        margin: "auto"
                    }}
                >
                    <div
                        style={{
                            fontSize: "24px",
                            color: "lightgreen",
                            textAlign: "right",
                            marginRight: "15px",
                            width: "30%"
                        }}
                    >
                        {countSujets - countProb}
                    </div>
                    <span style={{ fontSize: "20px" }}>Vérifiés</span>
                </div>
            </Card>
        </Conteneur>
    );
};

export default Tableau;
