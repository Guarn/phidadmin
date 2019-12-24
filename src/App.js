import React, { useEffect, Suspense, useReducer, createContext } from "react";
import styled from "styled-components";
import "./App.css";
import Menu from "./Composants/Rendu/Menu/Menu";
import ConteneurHeader from "./Composants/Rendu/ConteneurHeader/ConteneurHeader";
import { Card, Input } from "antd";
import Axios from "./Composants/Fonctionnels/Axios";
import { useCookies } from "react-cookie";
import Chargement from "./Composants/Rendu/Chargement/Chargement";
import { RDuser } from "./Composants/reducers";
import Creation from "./Composants/Rendu/Cours/Creation";
import ModificationCours from "./Composants/Rendu/Cours/Modification/Modification";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import ListeCours from "./Composants/Rendu/Cours/ListeCours/ListeCours";
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

const Cours = React.lazy(() => import("./Composants/Rendu/Cours/Cours"));
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

function App(props) {
  const [user, DPuser] = useReducer(RDuser, initialUser);
  const [cookies, setCookie, removeCookie] = useCookies();

  let formIdent = "";

  let formPass = "";

  const identification = () => {
    if (formIdent !== "" && formPass !== "") {
      Axios.post("/login", { email: formIdent, password: formPass })
        .then(rep => {
          setCookie("token", "Bearer " + rep.data.token, {
            path: "/",
            domain:".phidbac.fr"
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
      Axios.get("/p")
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
          removeCookie("token");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <userPD.Provider value={[user, DPuser]}>
      <Router>
        {user.connecte && (
          <ConteneurGlobal>
            <Menu />
            <ConteneurContenu>
              <ConteneurHeader />
              <Switch>
                <Suspense fallback={<Chargement />}>
                  <Route exact path="/">
                    <Tableau />
                  </Route>
                  <Route
                    path="/Sujets/Consultation"
                    component={ConsultationSujets}
                    title="Test"
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
                  <Route path="/Cours/Creation">
                    <Creation />
                  </Route>
                  <Route path="/Cours/Modification">
                    <ModificationCours />
                  </Route>
                  <Route path="/Cours/ListeCours">
                    <ListeCours type="Cours" />
                  </Route>
                  <Route path="/Cours/ListeExercices">
                    <ListeCours type="Exercices" />
                  </Route>
                  <Route path="/Index/Gestion">
                    <Index />
                  </Route>
                </Suspense>
              </Switch>
            </ConteneurContenu>
          </ConteneurGlobal>
        )}
        {!user.connecte && (
          <>
            <Redirect to="/" />
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
      </Router>
    </userPD.Provider>
  );
}

export default App;
