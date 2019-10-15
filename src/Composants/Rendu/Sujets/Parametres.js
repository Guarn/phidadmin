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
import axios from "axios";
import "./Parametres.css";

const { Option } = Select;

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Parametres = (props) => {
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: props.cookies.get("token") },
        responseType: "json"
    });
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

    const change = (targetKeys, direction, moveKeys) => {
        ax.post("/NotionProgramme", {
            notion: moveKeys,
            prog: direction === "left" ? false : true
        })
            .then(() => {
                setCoc(targetKeys);
            })
            .catch((err, ed) => console.log(err.response, ed));
    };

    const nouvelleNotion = () => {
        ax.post("/NotionAjout", { notion: notion, prog: notCheck }).then(
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
            ax.post("/NotionSuppression", {
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
        ax.post("/AuteurAjout", { auteur: auteur }).then((rep) => {
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
            ax.post("/AuteurSuppression", { auteur: selAuteur }).then((rep) => {
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
            });
        }
    };
    const nouvelleDestination = () => {
        ax.post("/DestinationAjout", { destination: destination }).then(
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
            ax.post("/DestinationSuppression", {
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
        let tab = [];
        let prog = [];
        ax.get("/notionsAdmin").then((rep) => {
            rep.data.map((el, id) => {
                tab.push({
                    title: el.Notion,
                    key: el.Notion,
                    prog: el.Au_Programme
                });
                if (el.Au_Programme) {
                    prog.push(el.Notion);
                }
                return null;
            });
            setDataSource(tab);
            setCoc(prog);
        });
        ax.get("/auteurs").then((rep) => {
            setAuteurs(rep.data);
        });
        ax.get("/destinations").then((rep) => {
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
                                <Option key={index} value={el.Auteur}>
                                    {el.Auteur}
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
                                <Option key={index} value={el.Destination}>
                                    {el.Destination}
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
