import React, { useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import styled from "styled-components";
import {
    Divider,
    Select,
    Tooltip,
    Button,
    Input,
    InputNumber,
    Radio,
    Card,
    notification,
    Icon
} from "antd";
import ReactQuill from "react-quill";
import Editor from "../../Fonctionnels/Editor";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { useCookies } from "react-cookie";
import axios from "axios";

const { Option } = Select;

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

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
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

const Creation = (props) => {
    const [state, setState] = useState({ Sujet: { Annee: 2019 } });
    const [menu, setMenu] = useState();
    const [texte1, setTexte1] = useState("");
    const [texte2, setTexte2] = useState("");
    const [texte3, setTexte3] = useState("");
    const [cookies] = useCookies();

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
    const nouveauSujet = () => {
        setState({
            ...state,
            Sujet: { ...state.Sujet, Problemes: false }
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
        }).post(`/SujetAjout`, {
            ...state.Sujet,
            Problemes: false
        })
            .then((rep) => {
                if (rep.status === 202) {
                    notification.open({
                        placement: "bottomRight",
                        duration: 10,
                        key,
                        message: `Création impossible : \n${rep.data.msg}`,
                        icon: (
                            <Icon type="exclamation" style={{ color: "red" }} />
                        )
                    });
                }
                if (rep.status === 201) {
                    notification.open({
                        placement: "bottomRight",
                        key,
                        message: "Création effectuée !",
                        icon: (
                            <Icon
                                type="check-circle"
                                style={{ color: "#52c41a" }}
                            />
                        )
                    });
                }
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

    useEffect(() => {
        document.title = "PhidAdmin - Sujets / Création ";
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/menuAdmin").then((rep) => {
            let state1 = rep.data;
            state1.annees.sort((a, b) => a["annee"] - b["annee"]);
            state1.auteurs.sort((a, b) =>
                a["auteur"].localeCompare(b["auteur"])
            );
            state1.destinations.sort((a, b) =>
                a["destination"].localeCompare(b["destination"])
            );
            state1.notions.sort((a, b) =>
                a["notion"].localeCompare(b["notion"])
            );
            setMenu(state1);
        });
    }, []);
    return (
        <Conteneur>
            {menu && (
                <Card style={{ width: 800, marginBottom: "50px" }}>
                    <ConteneurTextes>
                        <Divider
                            orientation="left"
                            style={{ marginTop: "0px" }}
                        >
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
                                showArrow
                                mode="multiple"
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
                            v
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
                                let t = val.replace("&amp;nbsp;", "&nbsp;");
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
                                            <Option key={el["destination"]}>
                                                {el["destination"]}
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
                                key="RechercheID"
                                defaultValue={2019}
                                min={1996}
                                max={9999}
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
                        {
                            //NOTE Bouton confirm
                        }
                        <Button
                            size="large"
                            style={{ marginTop: "30px" }}
                            type="primary"
                            onClick={() => nouveauSujet()}
                            block
                        >
                            Confirmer les changements
                        </Button>
                    </ConteneurTextes>
                </Card>
            )}
        </Conteneur>
    );
};

export default withCookies(Creation);
