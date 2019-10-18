import React, { useEffect, useState, Suspense } from "react";
import styled from "styled-components";
import "./App.css";
import Menu from "./Composants/Rendu/Menu/Menu";
import ConteneurHeader from "./Composants/Rendu/ConteneurHeader/ConteneurHeader";
import { Card, Input } from "antd";
import axios from "axios";
import { withCookies } from "react-cookie";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const ConsultationSujets = React.lazy(() =>
    import("./Composants/Rendu/Sujets/ConsultationSujets")
);
const Tableau = React.lazy(() => import("./Composants/Rendu/Tableau/Tableau"));
const CreationSujets = React.lazy(() =>
    import("./Composants/Rendu/Sujets/CreationSujets")
);
const ParametresSujets = React.lazy(() =>
    import("./Composants/Rendu/Sujets/Parametres")
);
const GestionUtilisateurs = React.lazy(() =>
    import("./Composants/Rendu/Utilisateurs/Gestion")
);
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
                        path: "/",
                        domain: "phidbac.fr"
                    });
                    setUser(rep);
                    formIdent = "";
                    formPass = "";
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        console.log(props.cookies.get("token"));
        if (props.cookies.get("token"))
            ax.get("/p")
                .then((rep) => {
                    setUser(rep.data);
                })
                .catch((err) =>
                    setUser({
                        Nom: "",
                        Prenom: "",
                        Mail: "",
                        Grade: ""
                    })
                );
    }, [user.Nom]);
    return (
        <Router>
            {props.cookies.get("token") && (
                <ConteneurGlobal>
                    <Menu />
                    <ConteneurContenu>
                        <ConteneurHeader />
                        <Switch>
                            <Suspense fallback={<div>Chargement...</div>}>
                                <Route exact path="/">
                                    <Tableau />
                                </Route>
                                <Route
                                    path="/Sujets/Consultation"
                                    component={ConsultationSujets}
                                />
                                <Route path="/Sujets/Parametres">
                                    <ParametresSujets />
                                </Route>
                                <Route path="/Sujets/Creation">
                                    <CreationSujets />
                                </Route>
                                <Route path="/Utilisateurs/Gestion">
                                    <GestionUtilisateurs />
                                </Route>
                            </Suspense>
                        </Switch>
                    </ConteneurContenu>
                </ConteneurGlobal>
            )}
            {!props.cookies.get("token") && (
                <Login1>
                    <Card>
                        <Input
                            key="1"
                            placeholder="Identifiant"
                            onChange={(e) => (formIdent = e.target.value)}
                        />
                        <Input.Password
                            key="2"
                            placeholder="Mot de passe"
                            onChange={(e) => (formPass = e.target.value)}
                            onPressEnter={() => identification()}
                        />
                    </Card>
                </Login1>
            )}
        </Router>
    );
}

export default withCookies(App);
