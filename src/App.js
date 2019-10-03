import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import "./App.css";
import { ReactComponent as Logo } from "./Logo.svg";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import {
    Slider,
    Divider,
    Icon,
    Select,
    Radio,
    Card,
    Checkbox,
    Button,
    Popconfirm,
    Drawer,
    Tooltip,
    InputNumber,
    Input,
    notification
} from "antd";

const key = "updatable";

const openNotification = () => {
    notification.open({
        key,
        placement: "bottomRight",
        message: "Mise à jour en cours",
        icon: <Icon type="loading" style={{ color: "#108ee9" }} />
    });
    setTimeout(() => {
        notification.open({
            placement: "bottomRight",
            key,
            message: "Changement effectué !",
            icon: <Icon type="check-circle" style={{ color: "#52c41a" }} />
        });
    }, 1000);
};

const ax = axios.create({
    baseURL: "http://192.168.0.85:4000/",
    responseType: "json"
});

const { Option } = Select;

const ConteneurGlobal = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
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
    background-color: #3a92ff;
`;
const HeaderTexte = styled.div`
    font-family: "Roboto";
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

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
    width: calc(100vw - 250px);
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
`;
const ConteneurResultats = styled.div`
    display: flex;
    max-width: 800px;
`;

const InfosEntete = styled.div`
    display: flex;
    margin-bottom: 20px;
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
        annees: [],
        destinations: [],
        auteurs: [],
        sessions: [],
        recherche: "",
        typeRecherche: "tousLesMots"
    });
    const [state, setState] = useState({
        id: 0,
        Sujet: {}
    });
    let test;
    const SwitchSujet = (val) => {
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
        await ax
            .post("/resultats", { elementsCoches, offset: 0 })
            .then((rep) => {
                console.log(rep);
                let state1 = rep.data.rows;
                state1.sort((a, b) => a["id"] - b["id"]);
                setSujets(state1);
                setState({ ...state, Sujet: sujets[0] });
                setTexte1(state1[0].Sujet1);
                setTexte2(state1[0].Sujet2);
                setTexte3(state1[0].Sujet3);
                console.log(state1[0]);
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
        let state = { ...elementsCoches, [cat]: e };
        setElementsCoches(state);
        console.log(state);
    };

    const modules = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline"],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }]
        ]
    };

    useEffect(() => {
        console.log("USEEFFECT");
        console.log(idSujet);
        if (sujets.length === 0) {
            ax.get("/sujets").then((rep) => {
                setLoading(false);
                let state1 = rep.data;
                state1.sort((a, b) => a["id"] - b["id"]);
                setSujets(state1);
                setNbResultats(rep.data.length);
                setState({ ...state, Sujet: state1[0] });
                setTexte1(state1[0].Sujet1);
                setTexte2(state1[0].Sujet2);
                setTexte3(state1[0].Sujet3);
            });
        } else {
            setState({ ...state, Sujet: sujets[idSujet] });
            setTexte1(sujets[idSujet].Sujet1);
            setTexte2(sujets[idSujet].Sujet2);
            setTexte3(sujets[idSujet].Sujet3);
        }
        if (sujets.length === 0) {
            ax.get("/menu").then((rep) => {
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

    return (
        <ConteneurGlobal>
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
                <ContenuHeader></ContenuHeader>
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
                                    <Option key={el["Notion"]}>
                                        {el["Notion"]}
                                    </Option>
                                );
                            })}
                    </Select>
                    <Checkbox style={{ marginTop: "10px" }}>
                        Inclure les anciennes notions
                    </Checkbox>
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
                            menu.auteurs.map((el, index) => {
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
                        marks={{ 1997: "1997", 2018: "2018" }}
                        max={2018}
                        min={1997}
                        tooltipPlacement="bottom"
                        step={1}
                        defaultValue={[1997, 2018]}
                    />

                    <Divider style={{ marginTop: "60px" }} />
                    <Button size="small" style={{ marginBottom: "10px" }} block>
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
                            placement="right"
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
                    </ConteneurFiltres>
                    <ConteneurResultats>
                        <Card loading={loading}>
                            <InfosEntete>
                                <DoubleLabel>
                                    <NomLabel>ID</NomLabel>
                                    <ContenuLabel>
                                        {state.Sujet.id}
                                    </ContenuLabel>
                                </DoubleLabel>
                                <DoubleLabel>
                                    <NomLabel>NUM</NomLabel>
                                    <ContenuLabel>
                                        {state.Sujet.Num}
                                    </ContenuLabel>
                                </DoubleLabel>
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
                                        color: "black"
                                    }}
                                >{`${idSujet + 1} / ${nbResultats}`}</NomLabel>
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
                            </InfosEntete>
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
                                        ref={RefNotions1}
                                        showArrow
                                        mode="multiple"
                                        value={state.Sujet.Notions1}
                                        onChange={(val) =>
                                            changementTexte(val, 1)
                                        }
                                        style={{ width: "100%" }}
                                        placeholder="Choisir une ou plusieurs notions"
                                    >
                                        {menu.notions &&
                                            menu.notions.map((el, index) => {
                                                return (
                                                    <Option key={el["Notion"]}>
                                                        {el["Notion"]}
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
                                    onChange={(val) => {
                                        setTexte1(val);
                                        setState({
                                            ...state,
                                            Sujet: {
                                                ...state.Sujet,
                                                Sujet1: val
                                            }
                                        });
                                    }}
                                />
                                <Divider orientation="left">Sujet 2</Divider>
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
                                            menu.notions.map((el, index) => {
                                                return (
                                                    <Option key={el["Notion"]}>
                                                        {el["Notion"]}
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
                                <Divider orientation="left">Sujet 3</Divider>
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
                                            menu.notions.map((el, index) => {
                                                return (
                                                    <Option key={el["Notion"]}>
                                                        {el["Notion"]}
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
                                    value={texte3}
                                    modules={modules}
                                    theme="snow"
                                    onChange={(val) => {
                                        changementTexte(val, 3);
                                    }}
                                />
                            </ConteneurTextes>
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
                                        menu.destinations.map((el, index) => {
                                            return (
                                                <Option key={el["Destination"]}>
                                                    {el["Destination"]}
                                                </Option>
                                            );
                                        })}
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
                                                <Option key={el["Serie"]}>
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
                                        menu.auteurs.map((el, index) => {
                                            return (
                                                <Option key={el["Auteur"]}>
                                                    {el["Auteur"]}
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
                                    value={state.Sujet.Session}
                                    onChange={(val) =>
                                        setState({
                                            ...state,
                                            Sujet: {
                                                ...state.Sujet,
                                                Session: val.target.value
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
                                    min={1997}
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
                        </Card>
                    </ConteneurResultats>
                </Contenu>
            </ConteneurContenu>
        </ConteneurGlobal>
    );
}

export default App;
