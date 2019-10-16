import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withCookies } from "react-cookie";
import {
    Table,
    Card,
    Tag,
    Button,
    Icon,
    Popconfirm,
    Tooltip,
    Modal,
    Input
} from "antd";
import axios from "axios";

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const Gestion = (props) => {
    const [modif, setModif] = useState(false);
    const [pass, setPass] = useState();
    const [idSel, setIdSel] = useState();
    const [showPass, setShowPass] = useState(false);
    const [data, setData] = useState();
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: props.cookies.get("token") },
        responseType: "json"
    });

    const suppressionUtilisateur = (id) => {
        ax.post("/DestroyUser", { id }).then((rep) => {
            console.log(rep);
            setModif(!modif);
        });
    };

    const bloquerUtilisateur = (util) => {
        ax.post("/updateuser", { id: util.id, actif: !util.actif }).then(
            (rep) => {
                console.log(rep);
                setModif(!modif);
            }
        );
    };
    const changePass = () => {
        ax.post("/ChangePass", { id: idSel, password: pass }).then((rep) => {
            console.log(rep);
            setShowPass(false);
            setModif(!modif);
        });
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "80px",
            sorter: (a, b) => a.id - b.id,
            sortDirections: ["descend", "ascend"]
        },
        {
            title: "Prenom",
            dataIndex: "prenom",
            key: "prenom"
        },
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom"
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Grade",
            dataIndex: "grade",
            key: "grade"
        },

        {
            title: "Actif",
            dataIndex: "actif",
            key: "actif",
            width: "80px",
            render: (actif) => (
                <Tag color={actif ? "green" : "red"}>
                    {actif ? "Actif" : "Inactif"}
                </Tag>
            )
        },

        {
            title: "Action",
            key: "action",
            width: "150px",
            dataIndex: "id",
            render: (id, util) => (
                <>
                    <Tooltip title="Modifier le mot de passe">
                        <Button
                            icon="sync"
                            style={{ marginRight: "8px" }}
                            onClick={() => {
                                setIdSel(util.id);
                                setShowPass(!showPass);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Bloquer cet utilisateur">
                        <Button
                            icon="stop"
                            style={{ marginRight: "8px" }}
                            onClick={() => bloquerUtilisateur(util)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Souhaitez-vous supprimer cet utilisateur ?"
                        cancelText="Annuler"
                        okText="Supprimer"
                        placement="topRight"
                        onConfirm={() => suppressionUtilisateur(id)}
                    >
                        <Tooltip title="Supprimer cet utilisateur">
                            <Button icon="delete" />
                        </Tooltip>
                    </Popconfirm>
                </>
            )
        }
    ];

    useEffect(() => {
        ax.get("/Listeusers")
            .then((rep) => {
                console.log(rep);
                let state = [];
                rep.data.listeUsers.map((el, index) => {
                    state.push(el);
                });
                setData(state);
            })
            .catch((err) => console.log(err));
    }, [modif]);
    return (
        <Conteneur>
            <Modal
                title="Modification du mot de passe"
                okText="Modifier"
                cancelText="Annuler"
                visible={showPass}
                onCancel={() => setShowPass(false)}
                onOk={() => changePass()}
            >
                <Input
                    placeholder="Tapez le nouveau mot de passe"
                    onChange={(e) => setPass(e.target.value)}
                ></Input>
            </Modal>
            <Card>
                <Table
                    sortable
                    dataSource={data}
                    bordered
                    columns={columns}
                    expandedRowRender={(record) => <div>{record.email}</div>}
                />
            </Card>
        </Conteneur>
    );
};

export default withCookies(Gestion);
