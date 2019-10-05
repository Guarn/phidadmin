import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import "./App.css";
import { ReactComponent as Logo } from "./Logo.svg";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import {
    Slider,
    Divider,
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

const ax = axios.create({
    baseURL: "http://phidbac.fr:4000/",
    responseType: "json"
});

const { Option } = Select;

const ConteneurGlobal = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;

    .ant-select-selection__choice {
        visibility: ${(props) => (props.chargement ? "hidden" : "")};
    }
`;

const ConteneurMenu = styled.div`
    display: flex;
    width: 250px;
    flex-direction: column;
    position: fixed;
    z-index: 2;
    height: 100vh;
`;
const ConteneurMenuHeader = styled.div`
    display: flex;
    height: 56px;
    z-index: 1;
    width: 250px;
    background-color: #3a92ff;
`;
const HeaderTexte = styled.div`
    font-family: "Roboto";
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    font-size: 1.3em;
    margin: 9px;
`;
//#region test
const Categorie = styled.div`
    display: flex;
    flex-direction: column;
`;

const Lien = styled.div`
    display: flex;
    height: 40px;
    user-select: none;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    transition: all 0.3s;
`;

const TexteLien = styled.div`
    user-select: none;
    font-family: "Roboto";
    margin-left: 20px;
`;
//#endregion
const ConteneurMenuLiens = styled.div`
    box-shadow: 1px 0 1px 1px hsla(0, 0%, 78%, 0.2);
    background-color: white;
    height: 100%;
`;

const ContenuHeader = styled.div`
    background-color: white;
    box-shadow: 0 1px 1px 1px hsla(0, 0%, 78%, 0.2);
    height: 56px;
    width: calc(100% - 250px);
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
`;
const Contenu = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: rgba(0, 0, 0, 0.03);
    padding: 20px;
    top: 56px;
    left: 250px;
    height: calc(100vh - 56px);
`;
const ConteneurFiltres = styled.div`
    margin-bottom: 20px;
    display: flex;
`;
const ConteneurResultats = styled.div`
    display: flex;
    max-width: 800px;
`;

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

const ConteneurTextes = styled.div`
    display: flex;
    flex-direction: column;
`;

const ContenuLabel = styled.div`
    font-family: "Roboto";
    padding: 5px;
`;

const ConteneurBoutons = styled.div``;

const ConteneurContenu = styled.div`
    width: calc(100% - 250px);
`;

function App() {
    const [modeEdition, setModeEdition] = useState(true);
    const [idTemp, setIdtemp] = useState();
    const [loading, setLoading] = useState(true);
    const [sujets, setSujets] = useState([]);
    const [nbResultats, setNbResultats] = useState();
    const [menu, setMenu] = useState([]);
    const [idSujet, setIdSujet] = useState(0);
    const [menuFiltres, setMenuFiltres] = useState(false);
    const [texte1, setTexte1] = useState("");
    const [texte2, setTexte2] = useState("");
    const [texte3, setTexte3] = useState("");
    const RefNotions1 = useRef(null);
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
        Sujet: {}
    });

    const SwitchSujet = (val) => {
        setLoading(true);

        if (val === "+") {
            setTexte1(sujets[idSujet + 1].Sujet1);
            setTexte2(sujets[idSujet + 1].Sujet2);
            setTexte3(sujets[idSujet + 1].Sujet3);
            setState({ id: 0, Sujet: sujets[idSujet + 1] });
            setIdSujet(idSujet + 1);
        }
        if (val === "-") {
            setTexte1(sujets[idSujet - 1].Sujet1);
            setTexte2(sujets[idSujet - 1].Sujet2);
            setTexte3(sujets[idSujet - 1].Sujet3);
            setState({ id: 0, Sujet: sujets[idSujet - 1] });
            setIdSujet(idSujet - 1);
        }
        return null;
    };

    const RechercheFiltres = async () => {
        setMenuFiltres(false);
        await ax.post("/resultatsAdmin", { elementsCoches }).then((rep) => {
            setIdSujet(0);
            let state1 = rep.data.rows;
            state1.sort((a, b) => a["id"] - b["id"]);
            setSujets(state1);
            setNbResultats(rep.data.count);
            setState({ ...state, Sujet: state1[0] });
            setTexte1(state1[0].Sujet1);
            setTexte2(state1[0].Sujet2);
            setTexte3(state1[0].Sujet3);
        });
    };

    const ConfirmModif = () => {
        const key = "updatable";

        notification.open({
            key,
            placement: "bottomRight",
            message: "Mise à jour en cours",
            icon: <Icon type="loading" style={{ color: "#108ee9" }} />
        });

        ax.post(`/sujets/${state.Sujet.id}`, state.Sujet)
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

    const changeFiltres = (e, cat) => {
        if (cat === "annees") {
            let tabAnnees = [];
            for (let i = e[0]; i <= e[1]; i++) {
                tabAnnees.push(i);
            }
            let state = { ...elementsCoches, [cat]: tabAnnees };
            setElementsCoches(state);
            console.log(state);
        } else if (cat === "sessions") {
            let state = { ...elementsCoches, [cat]: [e] };
            setElementsCoches(state);
            console.log(state);
        } else {
            let state = { ...elementsCoches, [cat]: e };
            setElementsCoches(state);
            console.log(state);
        }
    };

    const modules = {
        toolbar: [
            ["bold", "italic"],
            [{ indent: "-1" }, { indent: "+1" }],
            [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" }
            ],
            [{ color: [] }, { background: [] }]
        ]
    };

    useEffect(() => {
        console.log("USEEFFECT");
        if (sujets.length === 0) {
            ax.get("/sujets").then((rep) => {
                setLoading(false);
                let state1 = rep.data;
                state1.sort((a, b) => a["id"] - b["id"]);
                setSujets(state1);
                setNbResultats(rep.data.length);
                setState({ ...state, Sujet: state1[0] });
                console.log(state1[0]);
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
                let regex11 = /	/g;
                let textesT = [
                    state1[0].Sujet1,
                    state1[0].Sujet2,
                    state1[0].Sujet3
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

                    return null;
                });
                setTexte1(texte[0]);
                setTexte2(texte[1]);
                setTexte3(texte[2]);
            });
        } else {
            setState({ ...state, Sujet: sujets[idSujet] });
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
            let regex11 = /	/g;
            let textesT = [
                sujets[idSujet].Sujet1,
                sujets[idSujet].Sujet2,
                sujets[idSujet].Sujet3
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
                return null;
            });
            setTexte1(texte[0]);
            setTexte2(texte[1]);
            setTexte3(texte[2]);
            setLoading(false);
        }
        if (sujets.length === 0) {
            ax.get("/menuAdmin").then((rep) => {
                let state = rep.data;
                state.annees.sort((a, b) => a["Annee"] - b["Annee"]);
                state.auteurs.sort((a, b) =>
                    a["Auteur"].localeCompare(b["Auteur"])
                );
                state.destinations.sort((a, b) =>
                    a["Destination"].localeCompare(b["Destination"])
                );
                state.notions.sort((a, b) =>
                    a["Notion"].localeCompare(b["Notion"])
                );
                setMenu(state);
            });
        }
    }, [idSujet]);

    const changementTexte = (val, texte) => {
        if (texte === 1) {
            setTexte1(val);
            setState({
                ...state,
                Sujet: {
                    ...state.Sujet,
                    Sujet1: val
                }
            });
        } else if (texte === 2) {
            setTexte2(val);
            setState({
                ...state,
                Sujet: {
                    ...state.Sujet,
                    Sujet2: val
                }
            });
        } else if (texte === 3) {
            setTexte3(val);
            setState({
                ...state,
                Sujet: {
                    ...state.Sujet,
                    Sujet3: val
                }
            });
        }
    };

    /*
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "80px",
            sorter: (a, b) => a.id - b.id
        },
        {
            title: "Num",
            dataIndex: "Num",
            width: "90px",
            key: "Num",
            sorter: (a, b) => a.Num - b.Num
        },
        {
            title: "Série",
            dataIndex: "Serie",
            width: "150px",

            key: "2",
            sorter: (a, b) => a.Serie.localeCompare(b.Serie)
        },
        {
            title: "Destination",
            dataIndex: "Destination",
            width: "150px",

            key: "3",
            render: (a, b) => {
                return a.map((el, index) => {
                    if (index + 1 < a.length)
                        return (
                            <span key={b.id + "-" + index}>{el + ", "}</span>
                        );
                    if (index + 1 === a.length)
                        return <span key={b.id + "-" + index}>{el}</span>;
                    return null;
                });
            }
        },

        { title: "Code", dataIndex: "Code", width: "140px", key: "4" },
        { title: "Auteur", dataIndex: "Auteur", width: "150px", key: "5" },

        {
            title: "",
            key: "operation",
            fixed: "right",
            render: () => (
                <Button.Group>
                    <Button type="primary" icon="edit" />
                    <Popconfirm
                        title="Confirmer la suppression ?"
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button type="danger" icon="delete" />
                    </Popconfirm>
                </Button.Group>
            )
        }
    ];
*/

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

    const FleG = () => <span>{"«"}</span>;
    const FleD = () => <span>{"»"}</span>;
    const Ag = () => <span>{"À"}</span>;
    const Eg = () => <span>{"È"}</span>;
    const Ea = () => <span>{"É"}</span>;
    const Oe = () => <span>{"œ"}</span>;
    const OE = () => <span>{"Œ"}</span>;
    const Ae = () => <span>{"æ"}</span>;
    const AE = () => <span>{"Æ"}</span>;
    const CC = () => <span>{"Ç"}</span>;
    const Insecable = () => (
        <span style={{ backgroundColor: "grey", color: "grey" }}>ii</span>
    );

    const FineInsecable = () => (
        <span style={{ backgroundColor: "grey" }}>{" "}</span>
    );

    const CustomToolbar = () => (
        <div id="toolbar">
            <span className="ql-formats">
                <button className="ql-bold" />
                <button className="ql-italic" />
            </span>
            <span className="ql-formats">
                <button className="ql-indent" value="-1" />
                <button className="ql-indent" value="+1" />
            </span>
            <span className="ql-formats">
                <button className="ql-align" defaultValue />
                <button className="ql-align" value="center" />
                <button className="ql-align" value="right" />
                <button className="ql-align" value="justify" />
            </span>

            <span className="ql-formats">
                <button className="ql-script" value="super" />
                <select className="ql-color" />
                <select className="ql-background" />
            </span>
            <span className="ql-formats">
                <button
                    className="ql-FleG"
                    style={{
                        position: "relative",
                        bottom: "10px",
                        fontSize: "1.6em",
                        fontWeight: "bold",
                        fontFamily: "Roboto"
                    }}
                >
                    <FleG />
                </button>
                <button
                    className="ql-FleD"
                    style={{
                        position: "relative",
                        bottom: "10px",
                        fontSize: "1.6em",
                        fontWeight: "bold",
                        fontFamily: "Roboto"
                    }}
                >
                    <FleD />
                </button>

                <button
                    className="ql-Ag"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <Ag />
                </button>
                <button
                    className="ql-Eg"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <Eg />
                </button>
                <button
                    className="ql-Ea"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <Ea />
                </button>
                <button
                    className="ql-Oe"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <Oe />
                </button>
                <button
                    className="ql-OE"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <OE />
                </button>
                <button
                    className="ql-Ae"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <Ae />
                </button>
                <button
                    className="ql-AE"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <AE />
                </button>
                <button
                    className="ql-CC"
                    style={{ fontFamily: "Roboto", fontWeight: "bold" }}
                >
                    <CC />
                </button>
                <button className="ql-Insecable">
                    <Insecable />
                </button>
                <button className="ql-FineInsecable">
                    <FineInsecable />
                </button>
            </span>
        </div>
    );
    function insertFleG() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "« ");
    }
    function insertFleD() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, " »");
    }
    function insertAg() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "À");
    }
    function insertEg() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "È");
    }
    function insertEa() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "É");
    }
    function insertoe() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "œ");
    }
    function insertOE() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "Œ");
    }
    function insertae() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "æ");
    }
    function insertAE() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "Æ");
    }
    function insertCC() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, "Ç");
    }
    function insertInsecable() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, " ");
    }
    function insertFineInsecable() {
        let cursorPosition = this.quill.getSelection().index;
        this.quill.insertText(cursorPosition, " ");
    }
    let modules2 = {
        toolbar: {
            container: "#toolbar",
            handlers: {
                FleG: insertFleG,
                FleD: insertFleD,
                Ag: insertAg,
                Eg: insertEg,
                Ea: insertEa,
                Oe: insertoe,
                OE: insertOE,
                Ae: insertae,
                AE: insertAE,
                CC: insertCC,
                Insecable: insertInsecable,
                FineInsecable: insertFineInsecable
            }
        }
    };
    return (
        <ConteneurGlobal chargement={loading}>
            <ConteneurMenu>
                <ConteneurMenuHeader>
                    <Logo height="40px" style={{ margin: "8px" }} />
                    <HeaderTexte>Administration</HeaderTexte>
                </ConteneurMenuHeader>
                <ConteneurMenuLiens>
                    <Categorie>
                        <Divider orientation="left">SUJETS</Divider>
                        <Lien>
                            <Icon
                                style={{
                                    fontSize: "25px",
                                    color: "grey",
                                    marginLeft: "15px"
                                }}
                                type="file-add"
                            />
                            <TexteLien>Création</TexteLien>
                        </Lien>
                        <Lien>
                            <Icon
                                style={{
                                    fontSize: "25px",
                                    color: "grey",
                                    marginLeft: "15px"
                                }}
                                type="file-search"
                            />
                            <TexteLien>Consultation</TexteLien>
                        </Lien>
                        <Lien>
                            <Icon
                                style={{
                                    fontSize: "25px",
                                    color: "grey",
                                    marginLeft: "15px"
                                }}
                                type="setting"
                            />
                            <TexteLien>Paramètres</TexteLien>
                        </Lien>
                    </Categorie>
                </ConteneurMenuLiens>
                <ConteneurBoutons></ConteneurBoutons>
            </ConteneurMenu>
            <ConteneurContenu>
                <ContenuHeader style={{ zIndex: "100" }}></ContenuHeader>
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
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Toutes les notions"
                        onChange={(e) => changeFiltres(e, "notions")}
                    >
                        {menu.notions &&
                            menu.notions.map((el, index) => {
                                return (
                                    <Option
                                        key={el["Notion"]}
                                        style={{
                                            color: el["Au_Programme"]
                                                ? "green"
                                                : "red"
                                        }}
                                    >
                                        {el["Notion"]}
                                    </Option>
                                );
                            })}
                    </Select>

                    <Divider>Séries</Divider>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Toutes les séries"
                        onChange={(e) => changeFiltres(e, "series")}
                    >
                        {menu.series &&
                            menu.series.map((el, index) => {
                                return (
                                    <Option key={el["Serie"]}>
                                        {el["Serie"]}
                                    </Option>
                                );
                            })}
                    </Select>
                    <Divider>Destinations</Divider>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Toutes les destinations"
                        onChange={(e) => changeFiltres(e, "destinations")}
                    >
                        {menu.destinations &&
                            menu.destinations.map((el, index) => {
                                return (
                                    <Option key={el["Destination"]}>
                                        {el["Destination"]}
                                    </Option>
                                );
                            })}
                    </Select>
                    <Divider>Auteurs</Divider>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Tous les auteurs"
                        onChange={(e) => changeFiltres(e, "auteurs")}
                    >
                        {menu.auteurs &&
                            menu.auteurs.map((el) => {
                                return (
                                    <Option key={el["Auteur"]}>
                                        {el["Auteur"] +
                                            " (" +
                                            el["NbSujets"] +
                                            ")"}
                                    </Option>
                                );
                            })}
                    </Select>
                    <Divider>Sessions</Divider>
                    <Radio.Group
                        style={{ width: "100%" }}
                        size="small"
                        defaultValue="TOUTES"
                        onChange={(e) =>
                            changeFiltres(e.target.value, "sessions")
                        }
                    >
                        <Radio.Button value="TOUTES">Toutes</Radio.Button>
                        <Radio.Button value="NORMALE">Norm.</Radio.Button>
                        <Radio.Button value="REMPLACEMENT">Rempl.</Radio.Button>
                        <Radio.Button value="SECOURS">Secours</Radio.Button>
                    </Radio.Group>
                    <Divider>Années</Divider>
                    <Slider
                        range
                        marks={{ 1996: "1996", 2018: "2018" }}
                        max={2018}
                        min={1996}
                        tooltipPlacement="bottom"
                        step={1}
                        defaultValue={[1996, 2018]}
                        onChange={(val) => changeFiltres(val, "annees")}
                    />

                    <Divider style={{ marginTop: "60px" }} />
                    <Button
                        onClick={() =>
                            setElementsCoches({
                                notions: [],
                                series: [],
                                annees: [],
                                destinations: [],
                                auteurs: [],
                                sessions: "TOUTES",
                                recherche: "",
                                typeRecherche: "tousLesMots"
                            })
                        }
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
                <Contenu>
                    <ConteneurFiltres>
                        <Tooltip
                            placement="bottomLeft"
                            title="Modifier les filtres de recherche"
                        >
                            <Button
                                size="large"
                                onClick={() => setMenuFiltres(true)}
                            >
                                <Icon type="filter" />
                                Filtres
                            </Button>
                        </Tooltip>
                        <Input.Search
                            placeholder="ID"
                            onSearch={() => {
                                setLoading(true);
                                setIdSujet(parseInt(idTemp) - 1);
                            }}
                            onChange={(val) => setIdtemp(val.target.value)}
                            style={{ width: 100, marginLeft: 20, zIndex: 1 }}
                        />
                    </ConteneurFiltres>
                    <ConteneurResultats>
                        <Card loading={loading} style={{ width: 798 }}>
                            <InfosEntete>
                                <DoubleLabel
                                    style={{
                                        marginRight: 20,
                                        width: 70,
                                        borderRadius: 5
                                    }}
                                >
                                    <NomLabel>ID</NomLabel>
                                    <ContenuLabel>
                                        {state.Sujet.id}
                                    </ContenuLabel>
                                </DoubleLabel>
                                <div style={{ display: "flex" }}>
                                    <Button
                                        disabled={idSujet === 0 ? true : false}
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
                                    >{`${idSujet +
                                        1} / ${nbResultats}`}</NomLabel>
                                    <Button
                                        disabled={
                                            idSujet < sujets.length - 1
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
                                    checkedChildren={<Icon type="edit" />}
                                    unCheckedChildren={<Icon type="edit" />}
                                    checked={modeEdition}
                                    onClick={(checked, e) =>
                                        setModeEdition(checked)
                                    }
                                    defaultChecked
                                />
                            </InfosEntete>
                            {modeEdition && (
                                <ConteneurTextes>
                                    <Divider orientation="left">
                                        Sujet 1
                                    </Divider>
                                    <div
                                        style={{
                                            display: "flex",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <NomChamp>Notions</NomChamp>
                                        <Select
                                            ref={RefNotions1}
                                            showArrow
                                            mode="multiple"
                                            value={state.Sujet.Notions1}
                                            style={{ width: "100%" }}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Notions1: val
                                                    }
                                                })
                                            }
                                            placeholder="Choisir une ou plusieurs notions"
                                        >
                                            {menu.notions &&
                                                menu.notions.map(
                                                    (el, index) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    el["Notion"]
                                                                }
                                                                style={{
                                                                    color: el[
                                                                        "Au_Programme"
                                                                    ]
                                                                        ? "green"
                                                                        : "red"
                                                                }}
                                                            >
                                                                {el["Notion"]}
                                                            </Option>
                                                        );
                                                    }
                                                )}
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
                                        onChange={(val) =>
                                            changementTexte(val, 1)
                                        }
                                    />
                                    <Divider orientation="left">
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
                                            value={state.Sujet.Notions2}
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                            placeholder="Choisir une ou plusieurs notions"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Notions2: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.notions &&
                                                menu.notions.map(
                                                    (el, index) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    el["Notion"]
                                                                }
                                                                style={{
                                                                    color: el[
                                                                        "Au_Programme"
                                                                    ]
                                                                        ? "green"
                                                                        : "red"
                                                                }}
                                                            >
                                                                {el["Notion"]}
                                                            </Option>
                                                        );
                                                    }
                                                )}
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
                                            value={state.Sujet.Notions3}
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                            placeholder="Choisir une ou plusieurs notions"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Notions3: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.notions &&
                                                menu.notions.map(
                                                    (el, index) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    el["Notion"]
                                                                }
                                                                style={{
                                                                    color: el[
                                                                        "Au_Programme"
                                                                    ]
                                                                        ? "green"
                                                                        : "red"
                                                                }}
                                                            >
                                                                {el["Notion"]}
                                                            </Option>
                                                        );
                                                    }
                                                )}
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

                                    <div className="text-editor">
                                        <CustomToolbar />
                                        <ReactQuill
                                            value={texte3}
                                            onChange={(val) => {
                                                changementTexte(val, 3);
                                            }}
                                            modules={modules2}
                                        />
                                    </div>

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
                                            value={state.Sujet.Code}
                                            placeholder="Rentrez le code"
                                            onChange={(val) => {
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Code: val.target.value
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
                                            value={state.Sujet.Destination}
                                            style={{ width: "100%" }}
                                            placeholder="Toutes les destinations"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Destination: val
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
                                                                        "Destination"
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    el[
                                                                        "Destination"
                                                                    ]
                                                                }
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
                                            value={state.Sujet.Serie}
                                            placeholder="Toutes les séries"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Serie: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.series &&
                                                menu.series.map((el, index) => {
                                                    return (
                                                        <Option
                                                            key={el["Serie"]}
                                                        >
                                                            {el["Serie"]}
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
                                            value={state.Sujet.Auteur}
                                            placeholder="Choisir un auteur"
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Auteur: val
                                                    }
                                                })
                                            }
                                        >
                                            {menu.auteurs &&
                                                menu.auteurs.map(
                                                    (el, index) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    el["Auteur"]
                                                                }
                                                            >
                                                                {el["Auteur"]}
                                                            </Option>
                                                        );
                                                    }
                                                )}
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
                                            value={state.Sujet.Session}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Session:
                                                            val.target.value
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
                                            min={1996}
                                            max={2018}
                                            value={state.Sujet.Annee}
                                            onChange={(val) =>
                                                setState({
                                                    ...state,
                                                    Sujet: {
                                                        ...state.Sujet,
                                                        Annee: val
                                                    }
                                                })
                                            }
                                        />
                                    </div>
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
                            {!modeEdition && (
                                <ConteneurTextes>
                                    <Sujet>
                                        <TitreNotions>
                                            <Titre>1</Titre>
                                            <Notions>
                                                {state.Sujet.Notions1.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.Sujet.Sujet1}
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
                                                {state.Sujet.Notions2.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.Sujet.Sujet2}
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
                                                {state.Sujet.Notions3.join(" ")}
                                            </Notions>
                                        </TitreNotions>
                                        <CorpsSujet>
                                            <ReactQuill
                                                value={state.Sujet.Sujet3}
                                                modules={modules}
                                                readOnly
                                                theme="bubble"
                                            />
                                        </CorpsSujet>
                                    </Sujet>
                                    <Details>
                                        <PartieGauche>
                                            <Etiquette>
                                                {state.Sujet.id}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.Sujet.Annee}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.Sujet.Serie}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.Sujet.Destination.join(
                                                    " / "
                                                )}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.Sujet.Session}
                                            </Etiquette>
                                            <Etiquette>
                                                {state.Sujet.Code}
                                            </Etiquette>
                                        </PartieGauche>
                                    </Details>
                                </ConteneurTextes>
                            )}
                        </Card>
                    </ConteneurResultats>
                </Contenu>
            </ConteneurContenu>
        </ConteneurGlobal>
    );
}

export default App;
