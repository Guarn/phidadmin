import React, { useEffect, Suspense, useReducer, createContext } from "react";
import styled from "styled-components";
import "./App.css";
import Menu from "./Composants/Rendu/Menu/Menu";
import ConteneurHeader from "./Composants/Rendu/ConteneurHeader/ConteneurHeader";
import { Card, Input } from "antd";
import { useCookies } from "react-cookie";
import Chargement from "./Composants/Rendu/Chargement/Chargement";
import { RDuser } from "./Composants/reducers";
import Creation from "./Composants/Rendu/Cours/Creation";
import ModificationCours from "./Composants/Rendu/Cours/Modification/Modification";
import { Switch, Route, } from "react-router-dom";
import ListeCours from "./Composants/Rendu/Cours/ListeCours/ListeCours";
import axios from "axios";
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
const Index = React.lazy(() => import("./Composants/Rendu/Index/Index"));

const ConteneurGlobal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ConteneurContenu = styled.div`
  height: 100%;
  width: calc(100vw - 250px);
  padding-top: 56px;
  .ant-select-selection__choice {
    visibility: ${props => (props.chargement ? "hidden" : "")};
  }
  overflow: hidden;
`;

const Login1 = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const initialUser = { connecte: false };
export const userPD = createContext(null);

function App() {
  const [user, DPuser] = useReducer(RDuser, initialUser);
  const [cookies, setCookie, removeCookie] = useCookies();

  let formIdent = "";

  let formPass = "";

  const identification = () => {

    if (formIdent !== "" && formPass !== "") {
      axios.create({
        baseURL: "/api/",
        responseType: "json"
      }).post("/login", { login: formIdent, pass: formPass })
        .then(rep => {
          let dateExp = new Date(Date.now());
          dateExp.setDate(365);

          setCookie("token", "Bearer " + rep.data.token, {
            path: "/",
            domain: ".phidbac.fr"
          });
          DPuser({
            type: "UPDATE",
            user: {
              nom: rep.data.nom,
              prenom: rep.data.prenom,
              email: rep.data.email,
              grade: rep.data.grade,
              connecte: true
            }
          });
          formIdent = "";
          formPass = "";
        })
        .catch(err => console.log(err.response));
    }
  };

  useEffect(() => {
    if (cookies.token && cookies.token !== "") {
      axios.create({
        baseURL: "/api/",
        headers: { authorization: cookies.token.substring(7) },
        responseType: "json"
      }).get("/authentication")
        .then(rep => {
          DPuser({
            type: "UPDATE",
            user: {
              nom: rep.data.nom,
              prenom: rep.data.prenom,
              email: rep.data.email,
              grade: rep.data.grade,
              connecte: true
            }
          });
        })
        .catch(err => {
          removeCookie("token", { domain: ".phidbac.fr", path: "/" });
        });
    }
  }, [cookies, removeCookie]);
  return (
    <userPD.Provider value={[user, DPuser]}>
      {user.connecte &&
        (user.grade === "Administrateur" || user.grade === "Visiteur") && (
          <ConteneurGlobal>
            <Menu />
            <ConteneurContenu>
              <ConteneurHeader />
              <Switch>
                <Suspense fallback={<Chargement />}>
                  <Route exact path="/admin">
                    <Tableau />
                  </Route>
                  <Route
                    path="/admin/Sujets/Consultation"
                    component={ConsultationSujets}
                  />
                  <Route path="/admin/Sujets/Parametres">
                    <ParametresSujets />
                  </Route>
                  <Route path="/admin/Sujets/Creation">
                    <CreationSujets />
                  </Route>
                  <Route path="/admin/Utilisateurs/Gestion">
                    <GestionUtilisateurs />
                  </Route>
                  <Route path="/admin/Cours/Creation">
                    <Creation />
                  </Route>
                  <Route path="/admin/Cours/Modification">
                    <ModificationCours />
                  </Route>
                  <Route path="/admin/Cours/ListeCours">
                    <ListeCours type="Cours" />
                  </Route>
                  <Route path="/admin/Cours/ListeExercices">
                    <ListeCours type="Exercices" />
                  </Route>
                  <Route path="/admin/Index/Gestion">
                    <Index />
                  </Route>
                </Suspense>
              </Switch>
            </ConteneurContenu>
          </ConteneurGlobal>
        )}
      {!user.connecte && (
        <>
          <Login1>
            <Card>
              <Input
                key="1"
                placeholder="Identifiant"
                onChange={e => (formIdent = e.target.value)}
              />
              <Input.Password
                key="2"
                placeholder="Mot de passe"
                onChange={e => (formPass = e.target.value)}
                onPressEnter={() => identification()}
              />
            </Card>
          </Login1>
        </>
      )}
      {user.connecte && user.grade === "Eleve" && (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          vous n'avez pas la permission de voir cette page
        </div>
      )}
    </userPD.Provider>
  );
}

export default App;
