import { withCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
    Transfer,
    Card,
    Button,
    Popover,
    Input,
    Checkbox,
    notification,
    Select,
    Popconfirm,
    Icon
} from "antd";
import "./Parametres.css";
import { useCookies } from "react-cookie";
import axios from "axios";

const { Option } = Select;

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Parametres = (props) => {
    const [auteur, setAuteur] = useState();
    const [auteurs, setAuteurs] = useState();
    const [selAuteur, setSelAuteur] = useState();

    const [destination, setDestination] = useState();
    const [destinations, setDestinations] = useState();
    const [selDestination, setSelDestination] = useState();

    const [sk, setSk] = useState();
    const [coc, setCoc] = useState();
    const [dataSource, setDataSource] = useState();
    const [notion, setNotion] = useState();

    const [notCheck, setNotCheck] = useState(false);
    const [selNot, setSelNot] = useState();
    const [cookies] = useCookies();

    const change = (targetKeys, direction, moveKeys) => {
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post("/NotionProgramme", {
            notion: moveKeys,
            prog: direction === "left" ? false : true
        })
            .then(() => {
                setCoc(targetKeys);
            })
            .catch((err, ed) => console.log(err.response, ed));
    };

    const nouvelleNotion = () => {
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post("/NotionAjout", { notion: notion, prog: notCheck }).then(
            (rep) => {
                if (rep.status === 201) {
                    notification["success"]({
                        message: "Nouvelle notion ajoutée"
                    });
                }
                if (rep.status === 200) {
                    notification["error"]({
                        message: "Erreur",
                        description: rep.data.msg
                    });
                }
            }
        );
    };
    const suppressionNotion = () => {
        if (selNot !== "") {
            axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
            }).post("/NotionSuppression", {
                notion: selNot
            }).then((rep) => {
                if (rep.status === 201) {
                    notification["success"]({
                        message: "Notion supprimée"
                    });
                }
                if (rep.status === 200) {
                    notification["error"]({
                        message: "Erreur",
                        description: rep.data.msg
                    });
                }
            });
        }
    };

    const nouvelAuteur = () => {
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post("/AuteurAjout", { auteur: auteur }).then((rep) => {
            if (rep.status === 201) {
                notification["success"]({
                    message: "Nouvel Auteur ajouté"
                });
            }
            if (rep.status === 200) {
                notification["error"]({
                    message: "Erreur",
                    description: rep.data.msg
                });
            }
        });
    };

    const suppressionAuteur = () => {
        if (selAuteur !== "") {
            axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
            }).post("/AuteurSuppression", { auteur: selAuteur }).then(
                (rep) => {
                    if (rep.status === 201) {
                        notification["success"]({
                            message: "Auteur supprimé"
                        });
                    }
                    if (rep.status === 200) {
                        notification["error"]({
                            message: "Erreur",
                            description: rep.data.msg
                        });
                    }
                }
            );
        }
    };
    const nouvelleDestination = () => {
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).post("/DestinationAjout", { destination: destination }).then(
            (rep) => {
                if (rep.status === 201) {
                    notification["success"]({
                        message: "Nouvelle Destination ajoutée"
                    });
                }
                if (rep.status === 200) {
                    notification["error"]({
                        message: "Erreur",
                        description: rep.data.msg
                    });
                }
            }
        );
    };

    const suppressionDestination = () => {
        if (selAuteur !== "") {
            axios.create({
                baseURL: "/api/",
                headers: { authorization: cookies.token.substring(7) },
                responseType: "json"
            }).post("/DestinationSuppression", {
                destination: selDestination
            })
                .then((rep) => {
                    if (rep.status === 201) {
                        notification["success"]({
                            message: "Destination supprimée"
                        });
                    }
                    if (rep.status === 200) {
                        notification["error"]({
                            message: "Erreur",
                            description: rep.data.msg
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const popNotion = (
        <div>
            <Input
                placeholder="Notion en minuscule"
                onChange={(e) => setNotion(e.target.value.toLocaleUpperCase())}
            ></Input>
            <Checkbox
                style={{ marginTop: "5px", marginBottom: "5px" }}
                block
                onChange={(e) => setNotCheck(e.target.checked)}
            >
                Notion au programme
            </Checkbox>
            <Button
                block
                type="primary"
                size="small"
                onClick={() => nouvelleNotion()}
            >
                Créer
            </Button>
        </div>
    );
    const popAuteur = (
        <div>
            <Input
                placeholder="Auteur en minuscule"
                onChange={(e) => setAuteur(e.target.value.toLocaleUpperCase())}
            ></Input>

            <Button
                block
                type="primary"
                size="small"
                style={{ marginTop: "10px" }}
                onClick={() => nouvelAuteur()}
            >
                Créer
            </Button>
        </div>
    );
    const popDestination = (
        <div>
            <Input
                placeholder="Destination en minuscule"
                onChange={(e) =>
                    setDestination(e.target.value.toLocaleUpperCase())
                }
            ></Input>

            <Button
                block
                type="primary"
                size="small"
                style={{ marginTop: "10px" }}
                onClick={() => nouvelleDestination()}
            >
                Créer
            </Button>
        </div>
    );

    useEffect(() => {
        document.title = "PhidAdmin - Sujets / Paramètres ";
        let tab = [];
        let prog = [];
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/notionsAdmin").then((rep) => {
            rep.data.map((el, id) => {
                tab.push({
                    title: el.notion,
                    key: el.notion,
                    prog: el.au_programme
                });
                if (el.au_programme) {
                    prog.push(el.notion);
                }
                return null;
            });
            setDataSource(tab);
            setCoc(prog);
        });
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/auteurs").then((rep) => {
            setAuteurs(rep.data);
        });
        axios.create({
            baseURL: "/api/",
            headers: { authorization: cookies.token.substring(7) },
            responseType: "json"
        }).get("/destinations").then((rep) => {
            setDestinations(rep.data);
        });
    }, []);

    return (
        <Conteneur>
            <Card
                style={{ width: "700px", marginBottom: "10px" }}
                title="Notions"
                extra={
                    <Popover
                        placement="rightTop"
                        title="Ajouter une notion"
                        content={popNotion}
                        trigger="click"
                    >
                        <Button
                            style={{ marginTop: "10px" }}
                            type="primary"
                            icon="plus"
                        />
                    </Popover>
                }
            >
                <Transfer
                    dataSource={dataSource}
                    locale={{
                        itemUnit: "",
                        itemsUnit: "",
                        notFoundContent: "Cette liste est vide"
                    }}
                    render={(item) => item.title}
                    titles={["Notions", "Au programme"]}
                    targetKeys={coc}
                    selectedKeys={sk}
                    onSelectChange={(a, b) => {
                        setSk([...a, ...b]);
                    }}
                    onChange={(targetKeys, direction, moveKeys) =>
                        change(targetKeys, direction, moveKeys)
                    }
                />
                <Select
                    style={{
                        width: 250,
                        marginTop: "10px",
                        marginRight: "10px"
                    }}
                    onChange={(e) => setSelNot(e)}
                    showSearch
                    placeholder="Choisir une notion à supprimer"
                >
                    {dataSource &&
                        dataSource.map((el, index) => {
                            return (
                                <Option key={index} value={el.title}>
                                    {el.title}
                                </Option>
                            );
                        })}
                </Select>
                <Popconfirm
                    okText="Supprimer"
                    cancelText="Annuler"
                    title="Confirmer la suppression ?"
                    placement="rightTop"
                    onConfirm={() => suppressionNotion()}
                    icon={
                        <Icon
                            type="question-circle-o"
                            style={{ color: "red" }}
                        />
                    }
                >
                    <Button icon="delete" type="danger" />
                </Popconfirm>
            </Card>
            <Card
                style={{ width: "700px", marginBottom: "10px" }}
                title="Auteurs"
                extra={
                    <Popover
                        placement="rightTop"
                        title="Ajouter un auteur"
                        content={popAuteur}
                        trigger="click"
                    >
                        <Button
                            style={{ marginTop: "10px" }}
                            type="primary"
                            icon="plus"
                        />
                    </Popover>
                }
            >
                <Select
                    style={{
                        width: 250,
                        marginTop: "10px",
                        marginRight: "10px"
                    }}
                    onChange={(e) => setSelAuteur(e)}
                    showSearch
                    placeholder="Choisir un auteur à supprimer"
                >
                    {auteurs &&
                        auteurs.map((el, index) => {
                            return (
                                <Option key={index} value={el.auteur}>
                                    {el.auteur}
                                </Option>
                            );
                        })}
                </Select>
                <Popconfirm
                    okText="Supprimer"
                    cancelText="Annuler"
                    title="Confirmer la suppression ?"
                    placement="rightTop"
                    onConfirm={() => suppressionAuteur()}
                    icon={
                        <Icon
                            type="question-circle-o"
                            style={{ color: "red" }}
                        />
                    }
                >
                    <Button icon="delete" type="danger" />
                </Popconfirm>
            </Card>
            <Card
                style={{ width: "700px", marginBottom: "50px" }}
                title="Destinations"
                extra={
                    <Popover
                        placement="rightTop"
                        title="Ajouter une destination"
                        content={popDestination}
                        trigger="click"
                    >
                        <Button
                            style={{ marginTop: "10px" }}
                            type="primary"
                            icon="plus"
                        />
                    </Popover>
                }
            >
                <Select
                    style={{
                        width: 250,
                        marginTop: "10px",
                        marginRight: "10px"
                    }}
                    onChange={(e) => setSelDestination(e)}
                    showSearch
                    placeholder="Choisir une destination à supprimer"
                >
                    {destinations &&
                        destinations.map((el, index) => {
                            return (
                                <Option key={index} value={el.destination}>
                                    {el.destination}
                                </Option>
                            );
                        })}
                </Select>
                <Popconfirm
                    okText="Supprimer"
                    cancelText="Annuler"
                    title="Confirmer la suppression ?"
                    placement="rightTop"
                    onConfirm={() => suppressionDestination()}
                    icon={
                        <Icon
                            type="question-circle-o"
                            style={{ color: "red" }}
                        />
                    }
                >
                    <Button icon="delete" type="danger" />
                </Popconfirm>
            </Card>
        </Conteneur>
    );
};

export default withCookies(Parametres);
