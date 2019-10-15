import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Dropdown, Menu, Icon, Badge } from "antd";
import axios from "axios";

const ContenuHeader = styled.div`
    background-color: white;
    box-shadow: 0 1px 1px 1px hsla(0, 0%, 78%, 0.2);
    height: 56px;
    width: 100%;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ConteneurChemin = styled.div`
    margin-left: 30px;
    font-size: 20px;
`;
const PartieD = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    margin-right: 30px;
`;

const ConteneurHeader = (props) => {
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: props.cookies.get("token") },
        responseType: "json"
    });
    const [loading, setLoading] = useState(true);
    const { location } = props;
    const [user, setUser] = useState(props.user);
    const menu = (
        <Menu style={{ marginLeft: "-25px" }}>
            <Menu.Item
                onClick={() => {
                    props.cookies.remove("token");
                }}
            >
                Se déconnecter
            </Menu.Item>
        </Menu>
    );
    useEffect(() => {
        setLoading(true);
        ax.get("/p").then((rep) => {
            setUser(rep.data);
            setLoading(false);
        });

    }, []);
    return (
        <ContenuHeader>
            <ConteneurChemin>
                {location.pathname === "/"
                    ? "/Tableau de bord"
                    : location.pathname}
            </ConteneurChemin>
            <PartieD>
                <Badge count={5} style={{ marginRight: "25px" }}>
                    <Icon
                        type="mail"
                        style={{ fontSize: "20px", marginRight: "25px" }}
                    />
                </Badge>
                <Badge count={5} style={{ marginRight: "25px" }}>
                    <Icon
                        type="bell"
                        style={{ fontSize: "20px", marginRight: "25px" }}
                    />
                </Badge>
                <Icon
                    type="setting"
                    style={{ fontSize: "20px", marginRight: "25px" }}
                />
                {!loading ? (
                    <Dropdown overlay={menu}>
                        <span style={{ color: "orange", fontSize: "20px" }}>
                            {user.prenom + " " + user.nom}
                            <Icon type="down" />
                        </span>
                    </Dropdown>
                ) : (
                    "Se connecter"
                )}
            </PartieD>
        </ContenuHeader>
    );
};

export default withCookies(withRouter(ConteneurHeader));
