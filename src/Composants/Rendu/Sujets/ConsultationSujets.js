import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Editor from "../../Fonctionnels/Editor";
import ReactQuill from "react-quill";
import {
    Divider,
    Slider,
    Icon,
    Select,
    Radio,
    Card,
    Button,
    Drawer,
    Tooltip,
    InputNumber,
    Input,
    notification,
    Switch
} from "antd";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import axios from "axios";
import { useCookies } from "react-cookie";

const { Option } = Select;

//SECTION Compo. STYLED

// ANCHOR Squelette

const Contenu = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.03);
    overflow: auto;
`;
const ConteneurFiltres = styled.div`
    margin-bottom: 20px;
    display: flex;
`;

const ConteneurResultats = styled.div`
    display: flex;
    max-width: 800px;
    margin-bottom: 50px;
`;

const ConteneurTextes = styled.div`
    display: flex;
    flex-direction: column;
`;

// ANCHOR Aff. Sujet !EDIT

const Sujet = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.16);
    min-height: 60px;
    justify-content: space-between;
`;
const TitreNotions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Titre = styled.div`
    background-color: rgba(0, 0, 0, 0.15);
    color: black;
    padding: 5px 10px;
    font-family: "Century Gothic";
    font-size: 1em;
    font-style: italic;

    z-index: 1;
`;

const Notions = styled.div`
    color: black;
    font-family: "Century Gothic";
    font-size: 0.8em;
    font-style: italic;
    margin-top: 5px;
    margin-right: 5px;
`;

const CorpsSujet = styled.div`
    color: black;
    font-family: "Century Gothic";
    font-size: 1.2em;
`;
const Details = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 20px;
    align-items: flex-start;
`;
const PartieGauche = styled.div`
    display: flex;
    flex-direction: row;
`;
const Etiquette = styled.div`
    font-family: "Century Gothic";
    text-align: center;
    margin: auto;
    margin-right: 10px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-top: none;
    color: black;
    border-radius: 0 0 5px 5px;
`;

// ANCHOR Aff. Sujet EDIT

const InfosEntete = styled.div`
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
`;

const DoubleLabel = styled.div`
    display: flex;
    border: 1px solid lightgrey;
    overflow: hidden;
    margin-right: 10px;
`;

const NomLabel = styled.div`
    background-color: lightgrey;
    font-family: "Roboto";
    padding: 5px;
    color: white;
`;

const NomChamp = styled.div`
    background-color: lightgrey;
    color: white;
    font-family: "Roboto";
    padding: 5px;
    padding-right: 10px;

    margin-right: -3px;
    border-radius: 5px 0 0 5px;
`;

const ContenuLabel = styled.div`
    font-family: "Roboto";
    padding: 5px;
`;

//!SECTION

const ConsultationSujets = () => {
    //SECTION STATE
    const [cookies] = useCookies();
    const [modeEdition, setModeEdition] = useState(true);
    const [idTemp, setIdtemp] = useState();
    const [loading, setLoading] = useState(true);
    const [sujets, setSujets] = useState([]);
    const [nbResultats, setNbResultats] = useState();
    const [menu, setMenu] = useState([]);
    const [idSujet, setIdSujet] = useState(1);
    const [menuFiltres, setMenuFiltres] = useState(false);
    const [filtres, setFiltres] = useState(false);
    const [texte1, setTexte1] = useState("");
    const [texte2, setTexte2] = useState("");
    const [texte3, setTexte3] = useState("");
    const RefNotions = useRef(null);
    const RefSeries = useRef(null);
    const RefDestinations = useRef(null);
    const RefAuteurs = useRef(null);
    const RefSessions = useRef(null);
    const RefAnnees = useRef(null);
    const [elementsCoches, setElementsCoches] = useState({
        notions: [],
        series: [],
        annees: [
            1996,
            1997,
            1998,
            1999,
            2000,
            2001,
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            9999
        ],
        destinations: [],
        auteurs: [],
        sessions: ["NORMALE", "REMPLACEMENT", "SECOURS", "NONDEFINI"],
        recherche: "",
        typeRecherche: "tousLesMots"
    });
    const [state, setState] = useState({
        id: 0,
        sujet: {}
    });

    //!SECTION

    //SECTION Fonctions

    //NOTE : Gestion des boutons suivants/précédent
    const SwitchSujet = (val) => {
        setLoading(true);

        if (filtres) {
            if (val === "+") {
                setTexte1(sujets[idSujet + 1].sujet1);
                setTexte2(sujets[idSujet + 1].sujet2);
                setTexte3(sujets[idSujet + 1].sujet3);
                setState({ id: 0, sujet: sujets[idSujet + 1] });
                setIdSujet(idSujet + 1);
            }
            if (val === "-") {
                setTexte1(sujets[idSujet - 1].sujet1);
                setTexte2(sujets[idSujet - 1].sujet2);
                setTexte3(sujets[idSujet - 1].sujet3);
                setState({ id: 0, sujet: sujets[idSujet - 1] });
                setIdSujet(idSujet - 1);
            }
        } else {
            if (val === "+") {
                setSujets([]);
                setState();
                setIdSujet(idSujet + 1);
            }
            if (val === "-") {
                setSujets([]);
                setState();
                setIdSujet(idSujet - 1);
            }
        }
        return null;
    };

    //NOTE Recherche par filtres avec récupération données sur base

    const RechercheFiltres = () => {
        setMenuFiltres(false);
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post("/resultatsAdmin", { elementsCoches }).then((rep) => {
            if (rep.data.count > 0) {
                let state1 = rep.data.rows;
                setSujets(state1);
                setNbResultats(rep.data.count);
                setState({ ...state, sujet: state1[0] });
                setTexte1(state1[0].sujet1);
                setTexte2(state1[0].sujet2);
                setTexte3(state1[0].sujet3);
                setIdSujet(0);
                setFiltres(true);
            } else {
                setSujets({});
                setNbResultats(0);
            }
        });
    };

    //NOTE Enregistrement des modifs de sujet en ligne

    const ConfirmModif = () => {
        setState({
            ...state,
            sujet: { ...state.sujet, problemes: false }
        });
        const key = "updatable";

        notification.open({
            key,
            placement: "bottomRight",
            message: "Mise à jour en cours",
            icon: <Icon type="loading" style={{ color: "#108ee9" }} />
        });
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post(`/sujets/${state.sujet.id}`, {
            ...state.sujet,
            problemes: false
        })
            .then((rep) => {
                notification.open({
                    placement: "bottomRight",
                    key,
                    message: "Changement effectué !",
                    icon: (
                        <Icon
                            type="check-circle"
                            style={{ color: "#52c41a" }}
                        />
                    )
                });
            })
            .catch((err) => {
                notification.open({
                    placement: "bottomRight",
                    key,
                    message: "Echec de l'opération",
                    icon: <Icon type="stop" style={{ color: "red" }} />
                });
            });
    };

    //NOTE Gestion cas particuuliers dans certains filtres

    const changeFiltres = (e, cat) => {
        if (cat === "annees") {
            let tabAnnees = [];
            for (let i = e[0]; i <= e[1]; i++) {
                tabAnnees.push(i);
            }
            let state = { ...elementsCoches, [cat]: tabAnnees };
            setElementsCoches(state);
        } else if (cat === "sessions") {
            let state = { ...elementsCoches, [cat]: [e] };
            setElementsCoches(state);
        } else {
            let state = { ...elementsCoches, [cat]: e };
            setElementsCoches(state);
        }
    };

    //NOTE QUILL Modules

    const modules = {
        toolbar: [
            ["bold", "italic"],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ script: "super" }],
            [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" }
            ],
            [{ color: [] }, { background: [] }]
        ]
    };

    //NOTE MAJ du state sur le contenu des sujets
    // Impossible d'utiliser directement l'objet Sujet

    const changementTexte = (val, texte) => {
        if (texte === 1) {
            setTexte1(val);
            setState({
                ...state,
                sujet: {
                    ...state.sujet,
                    sujet1: val
                }
            });
        } else if (texte === 2) {
            setTexte2(val);
            setState({
                ...state,
                sujet: {
                    ...state.sujet,
                    sujet2: val
                }
            });
        } else if (texte === 3) {
            setTexte3(val);
            setState({
                ...state,
                sujet: {
                    ...state.sujet,
                    sujet3: val
                }
            });
        }
    };

    //NOTE Premier Problemes : Logique d'affichage pour Problemes

    const PremierProbleme = () => {
        setLoading(true);
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/problemesAdmin").then((rep) => {

            setState({ ...state, sujet: rep.data.sujets[0] });
            setNbResultats(rep.data.count);
            setSujets(rep.data.sujets);

            if (filtres) {
                RefNotions.current.rcSelect.state.value = [];
                RefAuteurs.current.rcSelect.state.value = [];
                RefSeries.current.rcSelect.state.value = [];
                RefDestinations.current.rcSelect.state.value = [];
                RefSessions.current.state.value = "TOUTES";
                RefAnnees.current.rcSlider.state.bounds = [1996, 2019];

                setElementsCoches({
                    notions: [],
                    series: [],
                    annees: [
                        1996,
                        1997,
                        1998,
                        1999,
                        2000,
                        2001,
                        2002,
                        2003,
                        2004,
                        2005,
                        2006,
                        2007,
                        2008,
                        2009,
                        2010,
                        2011,
                        2012,
                        2013,
                        2014,
                        2015,
                        2016,
                        2017,
                        2018,
                        2019,
                        9999
                    ],
                    destinations: [],
                    auteurs: [],
                    sessions: [
                        "NORMALE",
                        "REMPLACEMENT",
                        "SECOURS",
                        "NONDEFINI"
                    ],
                    recherche: "",
                    typeRecherche: "tousLesMots"
                });
                setFiltres(false);
            }

            setIdSujet(rep.data.sujets[0].id);
        });
        setLoading(false);

        return null;
    };

    //!SECTION

    //SECTION  USEEFFECT

    useEffect(() => {
        window.title = "PhidAdmin - Sujets / Consultation ";
        // ANCHOR Premier affichage ou filtres0
        if (sujets.length === 0) {
            axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
            }).get(`/sujets/${idSujet}`).then((rep) => {
                if (
                    rep.data.count > 0 &&
                    idSujet <= rep.data.count &&
                    idSujet >= 1
                ) {
                    let state1 = rep.data.sujet;
                    setSujets(state1);
                    setNbResultats(rep.data.count);
                    setState({ ...state, sujet: rep.data.sujet });
                    let regex1 = /É/g;
                    let regex1b = /é/g;
                    let regex2 = /ù/g;
                    let regex3 = /è/g;
                    let regex4 = /à/g;
                    let regex5 = /î/g;
                    let regex6 = /’/g;
                    let regex7 = /ô/g;
                    let regex8 = /û/g;
                    let regex9 = /â/g;
                    let regex10 = /È/g;
                    // eslint-disable-next-line no-control-regex
                    let regex11 = /	/g;
                    let regex12 = /À/g;
                    let regex13 = /ê/g;
                    let textesT = [
                        rep.data.sujet.sujet1,
                        rep.data.sujet.sujet2,
                        rep.data.sujet.sujet3
                    ];
                    let texte = [];
                    textesT.map((el, index) => {
                        texte[index] = el.replace(regex1, "É");
                        texte[index] = texte[index].replace(regex1b, "é");
                        texte[index] = texte[index].replace(regex2, "ù");
                        texte[index] = texte[index].replace(regex3, "è");
                        texte[index] = texte[index].replace(regex4, "à");
                        texte[index] = texte[index].replace(regex5, "î");
                        texte[index] = texte[index].replace(regex6, "'");
                        texte[index] = texte[index].replace(regex7, "ô");
                        texte[index] = texte[index].replace(regex8, "û");
                        texte[index] = texte[index].replace(regex9, "â");
                        texte[index] = texte[index].replace(regex10, "È");
                        texte[index] = texte[index].replace(regex11, "<BR />");
                        texte[index] = texte[index].replace(regex12, "À");
                        texte[index] = texte[index].replace(regex13, "ê");

                        return null;
                    });
                    setTexte1(texte[0]);
                    setTexte2(texte[1]);
                    setTexte3(texte[2]);
                    setLoading(false);
                } else {
                    setNbResultats(0);
                }
            });
        } else {
            // ANCHOR Si Resultats > 0
            if (nbResultats > 0) {
                let regex1 = /É/g;
                let regex1b = /é/g;
                let regex2 = /ù/g;
                let regex3 = /è/g;
                let regex4 = /à/g;
                let regex5 = /î/g;
                let regex6 = /’/g;
                let regex7 = /ô/g;
                let regex8 = /û/g;
                let regex9 = /â/g;
                let regex10 = /È/g;
                // eslint-disable-next-line no-control-regex
                let regex11 = /	/g;
                let regex12 = /À/g;
                let regex13 = /ê/g;
                let textesT;
                if (filtres) {
                    setState({ ...state, sujet: sujets[idSujet] });

                    textesT = [
                        sujets[idSujet].sujet1,
                        sujets[idSujet].sujet2,
                        sujets[idSujet].sujet3
                    ];
                } else {
                    setState({ ...state, sujet: sujets[0] });
                    textesT = [
                        sujets[0].sujet1,
                        sujets[0].sujet2,
                        sujets[0].sujet3
                    ];
                }
                let texte = [];

                textesT.map((el, index) => {
                    texte[index] = el.replace(regex1, "É");
                    texte[index] = texte[index].replace(regex1b, "é");
                    texte[index] = texte[index].replace(regex2, "ù");
                    texte[index] = texte[index].replace(regex3, "è");
                    texte[index] = texte[index].replace(regex4, "à");
                    texte[index] = texte[index].replace(regex5, "î");
                    texte[index] = texte[index].replace(regex6, "'");
                    texte[index] = texte[index].replace(regex7, "ô");
                    texte[index] = texte[index].replace(regex8, "û");
                    texte[index] = texte[index].replace(regex9, "â");
                    texte[index] = texte[index].replace(regex10, "È");
                    texte[index] = texte[index].replace(regex11, "<BR />");
                    texte[index] = texte[index].replace(regex12, "À");
                    texte[index] = texte[index].replace(regex13, "ê");
                    return null;
                });
                setTexte1(texte[0]);
                setTexte2(texte[1]);
                setTexte3(texte[2]);
                setLoading(false);
            }
        }
        if (!menu.annees) {
            axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
            }).get("/menuAdmin").then((rep) => {
                let state = rep.data;
                state.annees.sort((a, b) => a["annee"] - b["annee"]);
                state.auteurs.sort((a, b) =>
                    a["auteur"].localeCompare(b["auteur"])
                );
                state.destinations.sort((a, b) =>
                    a["destination"].localeCompare(b["destination"])
                );
                state.notions.sort((a, b) =>
                    a["notion"].localeCompare(b["notion"])
                );
                setMenu(state);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idSujet, filtres]);
    //!SECTION

    return (
        <Contenu>
            {
                //SECTION Menu Filtres
            }

            <Drawer
                title="Filtres"
                width="350px"
                placement="right"
                closable={true}
                onClose={() => setMenuFiltres(false)}
                visible={menuFiltres}
            >
                <Divider>Notions</Divider>
                <Select
                    ref={RefNotions}
                    mode="multiple"
                    style={{ width: "100%" }}
                    defaultValue={elementsCoches.notions1}
                    placeholder="Toutes les notions"
                    onChange={(e) => changeFiltres(e, "notions")}
                >
                    {menu.notions &&
                        menu.notions.map((el, index) => {
                            return (
                                <Option
                                    key={el["notion"]}
                                    style={{
                                        color: el["au_programme"]
                                            ? "green"
                                            : "red"
                                    }}
                                >
                                    {el["notion"]}
                                </Option>
                            );
                        })}
                </Select>

                <Divider>Séries</Divider>
                <Select
                    ref={RefSeries}
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Toutes les séries"
                    onChange={(e) => changeFiltres(e, "series")}
                >
                    {menu.series &&
                        menu.series.map((el, index) => {
                            return (
                                <Option key={el["serie"]}>{el["serie"]}</Option>
                            );
                        })}
                </Select>
                <Divider>Destinations</Divider>
                <Select
                    ref={RefDestinations}
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Toutes les destinations"
                    onChange={(e) => changeFiltres(e, "destinations")}
                >
                    {menu.destinations &&
                        menu.destinations.map((el, index) => {
                            return (
                                <Option key={el["destination"]}>
                                    {el["destination"]}
                                </Option>
                            );
                        })}
                </Select>
                <Divider>Auteurs</Divider>
                <Select
                    ref={RefAuteurs}
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Tous les auteurs"
                    onChange={(e) => changeFiltres(e, "auteurs")}
                >
                    {menu.auteurs &&
                        menu.auteurs.map((el) => {
                            return (
                                <Option key={el["auteur"]}>
                                    {el["auteur"] + " (" + el["NbSujets"] + ")"}
                                </Option>
                            );
                        })}
                </Select>
                <Divider>Sessions</Divider>
                <Radio.Group
                    ref={RefSessions}
                    style={{ width: "100%" }}
                    size="small"
                    defaultValue="TOUTES"
                    onChange={(e) => changeFiltres(e.target.value, "sessions")}
                >
                    <Radio.Button value="TOUTES">Toutes</Radio.Button>
                    <Radio.Button value="NORMALE">Norm.</Radio.Button>
                    <Radio.Button value="REMPLACEMENT">Rempl.</Radio.Button>
                    <Radio.Button value="SECOURS">Secours</Radio.Button>
                </Radio.Group>
                <Divider>Années</Divider>
                <Slider
                    ref={RefAnnees}
                    range
                    marks={{ 1996: "1996", 2019: "2019" }}
                    max={2019}
                    min={1996}
                    tooltipPlacement="bottom"
                    step={1}
                    defaultValue={[1996, 2019]}
                    onChange={(val) => changeFiltres(val, "annees")}
                />

                <Divider style={{ marginTop: "60px" }} />
                <Button
                    onClick={() => {
                        RefNotions.current.rcSelect.state.value = [];
                        RefAuteurs.current.rcSelect.state.value = [];
                        RefSeries.current.rcSelect.state.value = [];
                        RefDestinations.current.rcSelect.state.value = [];
                        RefSessions.current.state.value = "TOUTES";
                        RefAnnees.current.rcSlider.state.bounds = [1996, 2019];
                        setFiltres(false);
                        setIdSujet(1);
                        setSujets([]);

                        setElementsCoches({
                            notions: [],
                            series: [],
                            annees: [
                                1996,
                                1997,
                                1998,
                                1999,
                                2000,
                                2001,
                                2002,
                                2003,
                                2004,
                                2005,
                                2006,
                                2007,
                                2008,
                                2009,
                                2010,
                                2011,
                                2012,
                                2013,
                                2014,
                                2015,
                                2016,
                                2017,
                                2018,
                                2019,
                                9999
                            ],
                            destinations: [],
                            auteurs: [],
                            sessions: [
                                "NORMALE",
                                "REMPLACEMENT",
                                "SECOURS",
                                "NONDEFINI"
                            ],
                            recherche: "",
                            typeRecherche: "tousLesMots"
                        });
                    }}
                    size="small"
                    style={{ marginBottom: "10px" }}
                    block
                >
                    Réinitialiser les filtres
                    <Icon type="reload" />
                </Button>
                <Button
                    size="large"
                    type="primary"
                    block
                    onClick={() => RechercheFiltres()}
                >
                    <Icon type="search" />
                    Recherche
                </Button>
            </Drawer>
            {
                //!SECTION
            }
            <ConteneurFiltres>
                <Tooltip
                    placement="bottomLeft"
                    title="Modifier les filtres de recherche"
                >
                    <Button size="large" onClick={() => setMenuFiltres(true)}>
                        <Icon type="filter" />
                        Filtres
                    </Button>
                </Tooltip>
                {filtres && (
                    <Button
                        onClick={() => {
                            RefNotions.current.rcSelect.state.value = [];
                            RefAuteurs.current.rcSelect.state.value = [];
                            RefSeries.current.rcSelect.state.value = [];
                            RefDestinations.current.rcSelect.state.value = [];
                            RefSessions.current.state.value = "TOUTES";
                            RefAnnees.current.rcSlider.state.bounds = [
                                1996,
                                2019
                            ];
                            setFiltres(false);
                            setSujets([]);
                            setIdSujet(1);

                            setElementsCoches({
                                notions: [],
                                series: [],
                                annees: [
                                    1996,
                                    1997,
                                    1998,
                                    1999,
                                    2000,
                                    2001,
                                    2002,
                                    2003,
                                    2004,
                                    2005,
                                    2006,
                                    2007,
                                    2008,
                                    2009,
                                    2010,
                                    2011,
                                    2012,
                                    2013,
                                    2014,
                                    2015,
                                    2016,
                                    2017,
                                    2018,
                                    2019,
                                    9999
                                ],
                                destinations: [],
                                auteurs: [],
                                sessions: [
                                    "NORMALE",
                                    "REMPLACEMENT",
                                    "SECOURS",
                                    "NONDEFINI"
                                ],
                                recherche: "",
                                typeRecherche: "tousLesMots"
                            });
                        }}
                        size="large"
                        icon="reload"
                        style={{ marginLeft: 5 }}
                    />
                )}

                <Input.Search
                    key="test"
                    placeholder="ID"
                    onSearch={() => {
                        if (filtres) {
                            if (RefNotions.current)
                                RefNotions.current.rcSelect.state.value = [];
                            if (RefAuteurs.current)
                                RefAuteurs.current.rcSelect.state.value = [];
                            if (RefSeries.current)
                                RefSeries.current.rcSelect.state.value = [];
                            if (RefDestinations.current)
                                RefDestinations.current.rcSelect.state.value = [];
                            if (RefSessions.current)
                                RefSessions.current.state.value = "TOUTES";
                            if (RefAnnees.current)
                                RefAnnees.current.rcSlider.state.bounds = [
                                    1996,
                                    2019
                                ];

                            setElementsCoches({
                                notions: [],
                                series: [],
                                annees: [
                                    1996,
                                    1997,
                                    1998,
                                    1999,
                                    2000,
                                    2001,
                                    2002,
                                    2003,
                                    2004,
                                    2005,
                                    2006,
                                    2007,
                                    2008,
                                    2009,
                                    2010,
                                    2011,
                                    2012,
                                    2013,
                                    2014,
                                    2015,
                                    2016,
                                    2017,
                                    2018,
                                    2019,
                                    9999
                                ],
                                destinations: [],
                                auteurs: [],
                                sessions: [
                                    "NORMALE",
                                    "REMPLACEMENT",
                                    "SECOURS",
                                    "NONDEFINI"
                                ],
                                recherche: "",
                                typeRecherche: "tousLesMots"
                            });
                            setFiltres(false);
                        }

                        setLoading(true);
                        setIdSujet(parseInt(idTemp));
                        setSujets([]);
                    }}
                    onChange={(val) => setIdtemp(val.target.value)}
                    style={{ width: 100, marginLeft: 20, zIndex: 1 }}
                />
            </ConteneurFiltres>
            <ConteneurResultats>
                {nbResultats > 0 && !loading && (
                    // SECTION RESULTATS
                    <Card loading={loading} style={{ width: "798px" }}>
                        <InfosEntete>
                            <div style={{ display: "flex" }}>
                                <DoubleLabel
                                    style={{
                                        marginRight: 5,
                                        width: 70,
                                        borderRadius: 5
                                    }}
                                >
                                    <NomLabel>ID</NomLabel>
                                    <ContenuLabel>
                                        {state.sujet.id}
                                    </ContenuLabel>
                                </DoubleLabel>
                                <Button
                                    icon={
                                        state.sujet.problemes ? "stop" : "check"
                                    }
                                    style={
                                        state.sujet.problemes
                                            ? {
                                                color: "red",
                                                borderColor: "red"
                                            }
                                            : {
                                                color: "green",
                                                borderColor: "green"
                                            }
                                    }
                                    onClick={() => PremierProbleme()}
                                />
                            </div>
                            <div style={{ display: "flex" }}>
                                <Button
                                    disabled={
                                        !filtres
                                            ? idSujet === 1
                                                ? true
                                                : false
                                            : idSujet === 0
                                                ? true
                                                : false
                                    }
                                    onClick={() => {
                                        SwitchSujet("-");
                                    }}
                                >
                                    <Icon type="left" />
                                    Sujet précédent
                                </Button>
                                <NomLabel
                                    style={{
                                        marginLeft: "5px",
                                        marginRight: "5px",
                                        color: "black",
                                        width: 100,
                                        justifyContent: "center",
                                        display: "flex"
                                    }}
                                >{`${filtres ? idSujet + 1 : idSujet
                                    } / ${nbResultats}`}</NomLabel>
                                <Button
                                    disabled={
                                        filtres
                                            ? idSujet + 1 < nbResultats
                                                ? false
                                                : true
                                            : idSujet < nbResultats
                                                ? false
                                                : true
                                    }
                                    onClick={() => SwitchSujet("+")}
                                >
                                    Sujet suivant
                                    <Icon type="right" />
                                </Button>
                            </div>

                            <Switch
                                checkedChildren={
                                    <Icon type="edit" size="large" />
                                }
                                unCheckedChildren={
                                    <Icon type="edit" size="large" />
                                }
                                checked={modeEdition}
                                onClick={(checked, e) =>
                                    setModeEdition(checked)
                                }
                                defaultChecked
                            />
                        </InfosEntete>
                        {//NOTE Sujet1
                            modeEdition && (
                                <ConteneurTextes>
                                    <Divider orientation="left">Sujet 1</Divider>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <NomChamp>Notions</NomChamp>
                                        <Select
                                            showArrow
                                            mode="multiple"
                                            value={state.sujet.notions1}
                                            style={{ width: "100%" }}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        notions1: val
                                                    }
                                                })
                                            }
                                            placeholder="Choisir une ou plusieurs notions"
                                        >
                                            {menu.notions &&
                                                menu.notions.map((el, index) => {
                                                    return (
                                                        <Option
                                                            key={el["notion"]}
                                                            style={{
                                                                color: el[
                                                                    "au_programme"
                                                                ]
                                                                    ? "green"
                                                                    : "red"
                                                            }}
                                                        >
                                                            {el["notion"]}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter une nouvelle notion"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <ReactQuill
                                        value={texte1}
                                        modules={modules}
                                        theme="bubble"
                                        onChange={(val) => changementTexte(val, 1)}
                                    />
                                    <Divider orientation="left">
                                        {
                                            //NOTE Sujet2
                                        }
                                    Sujet 2
                                </Divider>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <NomChamp>Notions</NomChamp>
                                        <Select
                                            showArrow
                                            value={state.sujet.notions2}
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                            placeholder="Choisir une ou plusieurs notions"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        notions2: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.notions &&
                                                menu.notions.map((el, index) => {
                                                    return (
                                                        <Option
                                                            key={el["notion"]}
                                                            style={{
                                                                color: el[
                                                                    "au_programme"
                                                                ]
                                                                    ? "green"
                                                                    : "red"
                                                            }}
                                                        >
                                                            {el["notion"]}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter une nouvelle notion"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <ReactQuill
                                        value={texte2}
                                        modules={modules}
                                        theme="bubble"
                                        onChange={(val) => {
                                            changementTexte(val, 2);
                                        }}
                                    />
                                    <Divider orientation="left">
                                        {
                                            //NOTE Sujet3
                                        }
                                    Sujet 3
                                </Divider>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <NomChamp>Notions</NomChamp>
                                        <Select
                                            showArrow
                                            value={state.sujet.notions3}
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                            placeholder="Choisir une ou plusieurs notions"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        notions3: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.notions &&
                                                menu.notions.map((el, index) => {
                                                    return (
                                                        <Option
                                                            key={el["notion"]}
                                                            style={{
                                                                color: el[
                                                                    "au_programme"
                                                                ]
                                                                    ? "green"
                                                                    : "red"
                                                            }}
                                                        >
                                                            {el["notion"]}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter une nouvelle notion"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>

                                    <Editor
                                        value={texte3}
                                        changement={(val) => {
                                            let t = val.replace(
                                                "&amp;nbsp;",
                                                "&nbsp;"
                                            );
                                            changementTexte(t, 3);
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "30px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Code
                                    </NomChamp>
                                        <Input
                                            value={state.sujet.code}
                                            placeholder="Rentrez le code"
                                            onChange={(val) => {
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        code: val.target.value
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "5px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Destinations
                                    </NomChamp>
                                        <Select
                                            showArrow
                                            mode="multiple"
                                            value={state.sujet.destination}
                                            style={{ width: "100%" }}
                                            placeholder="Toutes les destinations"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        destination: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.destinations &&
                                                menu.destinations.map(
                                                    (el, index) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    el[
                                                                    "destination"
                                                                    ] + `-${index}`
                                                                }
                                                            >
                                                                {el["destination"]}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter une nouvelle destination"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "5px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Séries
                                    </NomChamp>
                                        <Select
                                            style={{ width: "100%" }}
                                            value={state.sujet.serie}
                                            placeholder="Toutes les séries"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        serie: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.series &&
                                                menu.series.map((el, index) => {
                                                    return (
                                                        <Option key={el["serie"]}>
                                                            {el["serie"]}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter une nouvelle série"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "5px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Auteur
                                    </NomChamp>
                                        <Select
                                            showArrow
                                            style={{ width: "100%" }}
                                            value={state.sujet.auteur}
                                            placeholder="Choisir un auteur"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        auteur: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.auteurs &&
                                                menu.auteurs.map((el, index) => {
                                                    return (
                                                        <Option key={el["auteur"]}>
                                                            {el["auteur"]}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Tooltip
                                            placement="topRight"
                                            title="Ajouter un nouvel auteur"
                                        >
                                            <Button
                                                icon="plus"
                                                style={{
                                                    marginLeft: "5px",
                                                    width: "45px"
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "5px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Session
                                    </NomChamp>
                                        <Radio.Group
                                            size="medium"
                                            value={state.sujet.session}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        session: val.target.value
                                                    }
                                                })
                                            }
                                        >
                                            <Radio.Button value="TOUTES">
                                                Toutes
                                        </Radio.Button>
                                            <Radio.Button value="NORMALE">
                                                Norm.
                                        </Radio.Button>
                                            <Radio.Button value="REMPLACEMENT">
                                                Rempl.
                                        </Radio.Button>
                                            <Radio.Button value="SECOURS">
                                                Secours
                                        </Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginTop: "5px"
                                        }}
                                    >
                                        <NomChamp
                                            style={{
                                                width: "130px"
                                            }}
                                        >
                                            Année
                                    </NomChamp>
                                        <InputNumber
                                            key="RechercheID"
                                            min={1996}
                                            max={2019}
                                            value={state.sujet.annee}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    sujet: {
                                                        ...state.sujet,
                                                        annee: val
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                    {
                                        //NOTE Bouton confirm
                                    }
                                    <Button
                                        size="large"
                                        style={{ marginTop: "30px" }}
                                        type="primary"
                                        onClick={() => ConfirmModif()}
                                        block
                                    >
                                        Confirmer les changements
                                </Button>
                                </ConteneurTextes>
                            )}
                        {//NOTE Mode Vue
                            !modeEdition && (
                                <ConteneurTextes>
                                    <Sujet>
                                        <TitreNotions>
                                            <Titre>1</Titre>
                                            <Notions>
                                                {state.sujet.notions1.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.sujet.sujet1}
                                                modules={modules}
                                                readOnly
                                                theme="bubble"
                                            />
                                        </CorpsSujet>
                                    </Sujet>
                                    <Sujet>
                                        <TitreNotions>
                                            <Titre>2</Titre>
                                            <Notions>
                                                {state.sujet.notions2.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.sujet.sujet2}
                                                modules={modules}
                                                readOnly
                                                theme="bubble"
                                            />
                                        </CorpsSujet>
                                    </Sujet>
                                    <Sujet>
                                        <TitreNotions>
                                            <Titre>3</Titre>
                                            <Notions>
                                                {state.sujet.notions3.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.sujet.sujet3}
                                                modules={modules}
                                                readOnly
                                                theme="bubble"
                                            />
                                        </CorpsSujet>
                                    </Sujet>
                                    <Details>
                                        <PartieGauche>
                                            <Etiquette>{state.sujet.id}</Etiquette>
                                            <Etiquette>
                                                {state.sujet.annee}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.sujet.serie}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.sujet.destination.join(
                                                    " / "
                                                )}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.sujet.session}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.sujet.code}
                                            </Etiquette>
                                        </PartieGauche>
                                    </Details>
                                </ConteneurTextes>
                            )}
                    </Card>
                )}
                {nbResultats === 0 && (
                    <Card style={{ width: 798 }}>
                        Aucun sujet ne correspond à ces critères.
                    </Card>
                    //!SECTION
                )}
            </ConteneurResultats>
        </Contenu>
    );
};

export default ConsultationSujets;
