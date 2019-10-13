import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import Consultation from "./Composants/Rendu/Sujets/Consultation";
import Menu from "./Composants/Rendu/Menu/Menu";
import ConteneurHeader from "./Composants/Rendu/ConteneurHeader/ConteneurHeader";
import { Card, Input } from "antd";
import axios from "axios";
import { withCookies } from "react-cookie";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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

const Login1 = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function App(props) {
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: props.cookies.get("token") },
        responseType: "json"
    });
    const [user, setUser] = useState({
        Nom: "",
        Prenom: "",
        Mail: "",
        Grade: ""
    });
    let formIdent = "";

    let formPass = "";

    const identification = () => {
        if (formIdent !== "" && formPass !== "") {
            ax.post("/login", { email: formIdent, password: formPass })
                .then((rep) => {
                    props.cookies.set("token", "Bearer " + rep.data.token, {
                        path: "/"
                    });
                    setUser(rep.data.prenom);
                    formIdent = "";
                    formPass = "";
                })
                .catch((err) => console.log(err));
        }
    };

    const RouteProtected = ({ children, ...rest }) => {
        return (
            <Route
                {...rest}
                render={() =>
                    user.Prenom !== "" ? (
                        children
                    ) : (
                        <Login1>
                            <Card>
                                <Input
                                    key="1"
                                    placeholder="Identifiant"
                                    onChange={(e) =>
                                        (formIdent = e.target.value)
                                    }
                                />
                                <Input.Password
                                    key="2"
                                    placeholder="Mot de passe"
                                    onChange={(e) =>
                                        (formPass = e.target.value)
                                    }
                                    onPressEnter={() => identification()}
                                />
                            </Card>
                        </Login1>
                    )
                }
            />
        );
    };

    useEffect(() => {
        ax.get("/p").then((rep) => {
            setUser({ ...user, Prenom: rep.data.req });
            console.log(rep);
        });
    }, []);
    return (
        <Router>
            <Switch>
                <RouteProtected path="/">
                    <ConteneurGlobal>
                        <Menu />
                        <ConteneurContenu>
                            <ConteneurHeader />
                            <Consultation />
                        </ConteneurContenu>
                    </ConteneurGlobal>
                </RouteProtected>
            </Switch>
        </Router>
    );
}

export default withCookies(App);
