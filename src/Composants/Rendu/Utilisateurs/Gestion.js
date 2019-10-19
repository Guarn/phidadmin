import React, { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import "./Gestion.css";
import { userPD } from "../../../App";
import uuid from "uuid/v4";
import { CSSTransition } from "react-transition-group";
import {
    Table,
    Card,
    Tag,
    Button,
    Icon,
    Popconfirm,
    Tooltip,
    Modal,
    Input,
    Form,
    Select
} from "antd";
import axios from "axios";

const Conteneur = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: auto;
`;

const { Item } = Form;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
const formItemLayout = {
    labelCol: {
        span: 6,
        offset: 2
    },
    wrapperCol: {
        span: 15
    }
};
const Formulaire = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: cookies["token"] },
        responseType: "json"
    });
    const [etape, setEtape] = useState("init");
    const valueButton = {
        init: "Créer l'utilisateur",
        update: "En cours de création",
        finOk: "Utilisateur créé",
        finPasOk: "Problème à la création."
    };
    const [attValid, setAttValid] = useState(false);

    const {
        getFieldDecorator,
        getFieldsError,
        getFieldError,
        isFieldTouched,
        validateFields,
        setFieldsValue
    } = props.form;

    const usernameError =
        isFieldTouched("username") && getFieldError("username");
    const passwordError =
        isFieldTouched("password") && getFieldError("password");

    function subForm(e) {
        e.preventDefault();
        validateFields((err, values) => {
            if (!err) {
                setAttValid(true);
                setEtape("update");
                ax.post("/UtilisateurAjout", {
                    email: values.email,
                    nom: values.nom,
                    prenom: values.prenom,
                    grade: values.grade,
                    localisation: values.ville,
                    password: values.password,
                    actif: true
                })
                    .then((rep) => {
                        setAttValid(false);
                        setEtape("finOk");
                        setTimeout(() => {
                            props.ouvert(false);
                        }, 2000);
                    })
                    .catch((err) => setEtape("finPasOk"));
            }
        });
    }
    useEffect(() => {
        if (props.user) {
            let dateCreation = props.user.createdAt
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/");
            let heureCreation = props.user.createdAt
                .split("T")[1]
                .split(":", 2)
                .join(":");
            let dateMaj = props.user.updatedAt
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/");
            let heureMaj = props.user.updatedAt
                .split("T")[1]
                .split(":", 2)
                .join(":");
            setFieldsValue({
                createdAt: dateCreation + " " + heureCreation,
                updatedAt: dateMaj + " " + heureMaj,
                prenom: props.user.prenom,
                nom: props.user.nom,
                ville: props.user.localisation,
                grade: props.user.grade,
                email: props.user.email
            });
        }
    }, []);
    return (
        <Form
            {...formItemLayout}
            title="Nouvel utilisateur"
            onSubmit={(e) => subForm(e)}
        >
            {props.user && (
                <Item label="Créé le :" hasFeedback>
                    {getFieldDecorator("createdAt", {})(
                        <Input
                            disabled
                            prefix={
                                <Icon
                                    type="calendar"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                        />
                    )}
                </Item>
            )}
            {props.user && (
                <Item label="Dernière MAJ :" hasFeedback>
                    {getFieldDecorator("updatedAt", {})(
                        <Input
                            disabled
                            prefix={
                                <Icon
                                    type="calendar"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                        />
                    )}
                </Item>
            )}
            <Item label="Prénom :" hasFeedback>
                {getFieldDecorator("prenom", {
                    rules: [
                        {
                            required: true,
                            message: "Ce champ est requis."
                        }
                    ]
                })(
                    <Input
                        prefix={
                            <Icon
                                type="user"
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        placeholder="Prénom"
                    />
                )}
            </Item>
            <Item label="Nom :" hasFeedback>
                {getFieldDecorator("nom", {
                    rules: [
                        {
                            required: true,
                            message: "Ce champ est requis."
                        }
                    ]
                })(
                    <Input
                        prefix={
                            <Icon
                                type="user"
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        placeholder="Nom"
                    />
                )}
            </Item>
            <Item label="Ville :" hasFeedback>
                {getFieldDecorator("ville", {})(
                    <Input
                        prefix={
                            <Icon
                                type="environment"
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        placeholder="Ville"
                    />
                )}
            </Item>
            <Item label="Grade :" hasFeedback>
                {getFieldDecorator("grade", {
                    rules: [
                        {
                            required: true,
                            message: "Ce champ est requis."
                        }
                    ]
                })(
                    <Select placeholder="Droits de l'utilisateur">
                        <Select.Option value="Administrateur">
                            Administrateur
                        </Select.Option>
                        <Select.Option value="Visiteur">Visiteur</Select.Option>
                        <Select.Option value="Eleve">Eleve</Select.Option>
                    </Select>
                )}
            </Item>
            <Item label="Email :" hasFeedback>
                {getFieldDecorator("email", {
                    rules: [
                        {
                            required: true,
                            message: "Ce champ est requis."
                        },
                        {
                            message: "Ce n'est pas un email.",
                            pattern: new RegExp(
                                "^[a-zA-Z0-9.!#$%&*+/=?^_]+@[a-zA-Z]+.[a-zA-Z]{2,10}$"
                            )
                        }
                    ]
                })(
                    <Input
                        prefix={
                            <Icon
                                type="mail"
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        placeholder="Adresse mél"
                    />
                )}
            </Item>
            {!props.user && (
                <Item
                    label="Mot de passe :"
                    hasFeedback
                    help={passwordError || "6 caractères minimum"}
                >
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "Ce champ est requis."
                            },
                            {
                                pattern: new RegExp("^.{6,}$"),
                                message: "Moins de 6 caractères !"
                            }
                        ]
                    })(
                        <Input.Password
                            prefix={
                                <Icon
                                    type="lock"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            type="password"
                            placeholder="Mot de passe"
                        />
                    )}
                </Item>
            )}
            <Item style={{ marginBottom: "0px" }}>
                <Button
                    loading={attValid}
                    icon={etape === "finOk" ? "check" : null}
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                    block
                    style={{
                        marginTop: "10px",
                        backgroundColor:
                            !attValid && etape !== "init"
                                ? etape === "finOk"
                                    ? "#52c41a"
                                    : "lightsalmon"
                                : null
                    }}
                >
                    {valueButton[etape]}
                </Button>
            </Item>
        </Form>
    );
};

const Gestion = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const ax = axios.create({
        baseURL: "http://phidbac.fr:4000/",
        headers: { Authorization: cookies["token"] },
        responseType: "json"
    });
    const [user, userDP] = useContext(userPD);
    const [nouvelUtilisateur, setNouvelUtilisateur] = useState(false);
    const [modif, setModif] = useState(false);
    const [pass, setPass] = useState();
    const [idSel, setIdSel] = useState();
    const [showPass, setShowPass] = useState(false);
    const [data, setData] = useState();

    const suppressionUtilisateur = (id) => {
        ax.post("/DestroyUser", { id }).then((rep) => {
            setModif(!modif);
        });
    };

    const bloquerUtilisateur = (util) => {
        ax.post("/updateuser", { id: util.id, actif: !util.actif }).then(
            (rep) => {
                setModif(!modif);
            }
        );
    };
    const changePass = () => {
        ax.post("/ChangePass", { id: idSel, password: pass }).then((rep) => {
            setShowPass(false);
            setModif(!modif);
        });
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: uuid(),
            width: "80px",
            sorter: (a, b) => a.id - b.id,
            sortDirections: ["descend"]
        },
        {
            title: "Prenom",
            dataIndex: "prenom",
            key: uuid()
        },
        {
            title: "Nom",
            dataIndex: "nom",
            key: uuid()
        },

        {
            title: "Email",
            dataIndex: "email",
            key: uuid()
        },
        {
            title: "Grade",
            dataIndex: "grade",
            key: uuid()
        },

        {
            title: "Actif",
            dataIndex: "actif",
            key: uuid(),
            width: "80px",
            render: (actif) => (
                <Tag color={actif ? "green" : "red"}>
                    {actif ? "Actif" : "Inactif"}
                </Tag>
            )
        },

        {
            title: "Action",
            key: uuid(),
            width: "150px",
            dataIndex: "id",
            render: (id, util) => (
                <div key={uuid()}>
                    <Tooltip title="Modifier le mot de passe">
                        <Button
                            icon="key"
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
                        placement="bottomRight"
                        onConfirm={() => suppressionUtilisateur(id)}
                    >
                        <Tooltip title="Supprimer cet utilisateur">
                            <Button icon="delete" />
                        </Tooltip>
                    </Popconfirm>
                </div>
            )
        }
    ];

    useEffect(() => {
        document.title = "PhidAdmin - Utilisateurs / Gestion ";
        ax.get("/Listeusers")
            .then((rep) => {
                let state = [];
                rep.data.listeUsers.map((el, index) => {
                    state.push(el);
                });
                setData(state);
            })
            .catch((err) => {
                removeCookie("token");
                userDP({ type: "CONNEXION" });
            });
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
            <Button
                icon="plus"
                style={{ marginBottom: "10px" }}
                type="primary"
                onClick={() => setNouvelUtilisateur(!nouvelUtilisateur)}
            >
                Ajouter un utilisateur
            </Button>
            <CSSTransition
                unmountOnExit
                in={nouvelUtilisateur}
                classNames="utili"
                timeout={300}
            >
                <Card className="test" title="Nouvel utilisateur">
                    <TestLogin
                        cookies={props.cookies}
                        ouvert={(val) => {
                            setNouvelUtilisateur(val);
                            setModif(!modif);
                        }}
                    />
                </Card>
            </CSSTransition>
            <Card>
                <Table
                    rowKey={() => uuid()}
                    sortable
                    dataSource={data}
                    bordered
                    columns={columns}
                    expandedRowRender={(record) => (
                        <div style={{ width: 500 }}>
                            <TestLogin
                                cookies={props.cookies}
                                user={record}
                                ouvert={(val) => {
                                    setNouvelUtilisateur(val);
                                    setModif(!modif);
                                }}
                            />
                        </div>
                    )}
                />
            </Card>
        </Conteneur>
    );
};

const TestLogin = Form.create({ name: "FormTest" })(Formulaire);

export default Gestion;
