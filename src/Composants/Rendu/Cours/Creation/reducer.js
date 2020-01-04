import { v4 as uuid } from "uuid";

const titreType = uuid => [
  {
    type: "h1",
    id: uuid,
    align: "center",
    children: [
      {
        text: "Nouveau Titre",
        couleurTexte: "#FFFFFF",
        couleurTexteActive: true
      }
    ]
  }
];

const encartType = uuid => [
  {
    type: "paragraph",
    id: uuid,
    align: "justify",
    children: [
      {
        text: "Nouvel encart"
      }
    ]
  }
];

const sousChapitreType = uuid => [
  {
    type: "h3",
    id: uuid,
    align: "left",
    children: [
      {
        text: "1.1 SOUS CHAPITRE",
        couleurTexte: "#FFFFFF",
        couleurTexteActive: true
      }
    ]
  }
];

const sousSousChapitreType = uuid => [
  {
    type: "h3",
    id: uuid,
    align: "left",
    children: [
      {
        text: "1.1.1 SOUS SOUS CHAPITRE",
        couleurTexte: "#FFFFFF",
        couleurTexteActive: true
      }
    ]
  }
];

const chapitreType = uuid => [
  {
    type: "h2",
    id: uuid,
    align: "left",
    children: [
      {
        text: "1. CHAPITRE",
        couleurTexte: "#FFFFFF",
        couleurTexteActive: true
      }
    ]
  }
];
const citationType = uuid => [
  {
    type: "citation",
    id: uuid,
    align: "left",
    children: [{ text: "Nouvelle citation" }]
  }
];

const paragrapheType = uuid => [
  {
    type: "paragraph",
    id: uuid,
    align: "justify",
    children: [{ text: "Nouveau paragraphe" }]
  }
];

export const reducerCreationCours = (state, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "TableMatiereVisible":
      newState.Cours[action.index].TableMatiere = {
        ...state.Cours[action.index].TableMatiere,
        actif: action.value
      };
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );
      return newState;
    case "ImageVisible":
      newState.Cours[action.index] = {
        ...state.Cours[action.index],
        image: !newState.Cours[action.index].image
      };

      if (
        newState.Cours[action.index].imageOptions === undefined ||
        newState.Cours[action.index].imageOptions.lienType === undefined
      ) {
        newState.Cours[action.index].imageOptions = {
          align: "left",
          height: "40px",
          width: "40px",
          legende: "Description",
          ratioActif: false,
          ratio: 1,
          lienActif: false,
          lienType: "WEB",
          lien: "",
          src:
            "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
        };
      }
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );
      return newState;
    case "ImageOptions":
      newState.Cours[action.index] = {
        ...state.Cours[action.index],
        imageOptions: {
          ...newState.Cours[action.index].imageOptions,
          [action.option]: action.value
        }
      };
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );
      return newState;
    case "TableMatiere":
      newState.Cours[action.index].TableMatiere = {
        ...state.Cours[action.index].TableMatiere,
        value: action.value
      };
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );
      return newState;
    case "TableMatiereType":
      if (action.index !== 0) {
        newState.Cours[action.index].TableMatiere = {
          ...state.Cours[action.index].TableMatiere,
          type: action.value
        };
        localStorage.setItem(
          "Cours",
          JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
        );
      }
      return newState;
    case "UpdateValue":
      newState.Cours[action.index] = {
        ...state.Cours[action.index],
        value: action.value
      };
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );
      return newState;
    case "Suppression":
      let Cours = newState.Cours;

      if (action.index !== 0) {
        Cours.splice(action.index, 1);
      }
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: Cours, ReadOnly: null })
      );

      return { ...newState, Cours: Cours };
    case "ReadOnly":
      newState.ReadOnly = action.index;

      return newState;

    case "Ajout":
      let value;
      switch (action.value) {
        case "titre":
          value = titreType(uuid());
          break;
        case "chapitre":
          value = chapitreType(uuid());
          break;
        case "sousChapitre":
          value = sousChapitreType(uuid());
          break;
        case "sousSousChapitre":
          value = sousSousChapitreType(uuid());
          break;
        case "citation":
          value = citationType(uuid());
          break;
        case "paragraphe":
          value = paragrapheType(uuid());
          break;
        case "encart":
          value = encartType(uuid());
          break;
      }
      newState.Cours.splice(action.index, 0, {
        value,
        type: action.value,
        TableMatiere: {
          actif: false,
          value: "",
          titre: false,
          position: 0
        },
        options: {
          marginTop: 20,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          backgroundColor:
            action.value === "titre" ||
            action.value === "chapitre" ||
            action.value === "sousChapitre" ||
            action.value === "sousSousChapitre"
              ? "#BE5454"
              : action.value === "encart"
              ? "#DBD9D1"
              : "",
          paddingTop:
            action.value === "titre" ||
            action.value === "chapitre" ||
            action.value === "sousChapitre"
              ? 7
              : action.value === "encart"
              ? 10
              : action.value === "sousChapitre"
              ? 3
              : "",
          paddingLeft:
            action.value === "titre" ||
            action.value === "chapitre" ||
            action.value === "sousChapitre" ||
            action.value === "sousSousChapitre"
              ? 7
              : action.value === "encart"
              ? 20
              : "",
          paddingRight:
            action.value === "titre" ||
            action.value === "chapitre" ||
            action.value === "sousChapitre" ||
            action.value === "sousSousChapitre"
              ? 7
              : action.value === "encart"
              ? 20
              : "",
          paddingBottom:
            action.value === "titre" ||
            action.value === "chapitre" ||
            action.value === "sousChapitre"
              ? 7
              : action.value === "encart"
              ? 10
              : action.value === "sousChapitre"
              ? 3
              : ""
        },
        image: false,
        imageOptions: {
          align: "left",
          height: "40px",
          width: "40px",
          legende: "Description",
          ratioActif: false,
          ratio: 1,
          lienType: "WEB",
          lienActif: false,
          lien: "",
          src:
            "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
        }
      });

      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );

      return newState;
    case "Parametres":
      newState.Cours[state.ReadOnly].options[action.param] = action.value;
      localStorage.setItem(
        "Cours",
        JSON.stringify({ ...newState, Cours: newState.Cours, ReadOnly: null })
      );

      return newState;
    default:
      return state;
  }
};

export const initialValueCours = {
  Cours: [
    {
      value: [
        {
          type: "h1",
          id: 1,
          align: "center",
          children: [{ text: "COURS" }]
        }
      ],
      type: "h1",
      TableMatiere: {
        actif: true,
        value: "TITRE",
        type: "titre",
        position: 0
      },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      },
      image: false,
      imageOptions: {
        align: "left",
        height: "40px",
        width: "40px",
        legende: "Description",
        ratioActif: false,
        ratio: 1,
        lienType: "WEB",
        lienActif: false,
        lien: "",
        src:
          "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
      }
    }
  ],
  ReadOnly: null,
  Titre: "Nouveau Cours",
  Description: "Description manquante",
  id: "",
  type: "Cours"
};

export const initialValueExercice = {
  Cours: [
    {
      value: [
        {
          type: "h1",
          id: 1,
          align: "center",
          children: [{ text: "EXERCICE" }]
        }
      ],
      type: "h1",
      TableMatiere: {
        actif: true,
        value: "TITRE",
        type: "titre",
        position: 0
      },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      },
      image: false,
      imageOptions: {
        align: "left",
        height: "40px",
        width: "40px",
        legende: "Description",
        ratioActif: false,
        ratio: 1,
        lienType: "WEB",
        lienActif: false,
        lien: "",
        src:
          "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
      }
    }
  ],
  ReadOnly: null,
  Titre: "Nouvel Exercice",
  Description: "Description manquante",
  id: "",
  type: "Exercice"
};

export const initialValueIndexes = {
  Cours: [
    {
      value: [
        {
          type: "h1",
          id: 1,
          align: "center",
          children: [{ text: "Index" }]
        }
      ],
      type: "h1",
      TableMatiere: {
        actif: false,
        value: "TITRE",
        type: "titre",
        position: 0
      },
      options: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      },
      image: false,
      imageOptions: {
        align: "left",
        height: "40px",
        width: "40px",
        legende: "Description",
        ratioActif: false,
        ratio: 1,
        lienType: "WEB",
        lienActif: false,
        lien: "",
        src:
          "https://www.mydiscprofile.com/fr-fr/_images/homepage-free-personality-test.png"
      }
    }
  ],
  ReadOnly: null,
  Titre: "Nouvel Exercice",
  Description: "Description manquante",
  type: "indexes"
};
