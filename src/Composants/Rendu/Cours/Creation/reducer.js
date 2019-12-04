const titreType = [
  {
    type: "h1",
    margin: 0,
    align: "center",
    children: [{ text: "Nouveau Titre", marks: [] }]
  }
];

const sousChapitreType = [
  {
    type: "sousChapitre",
    margin: 0,
    align: "center",
    children: [{ text: "Nouveau sous chapitre", marks: [] }]
  }
];

const chapitreType = [
  {
    type: "chapitre",
    margin: 0,
    align: "left",
    children: [{ text: "Nouveau chapitre", marks: [] }]
  }
];

const paragrapheType = [
  {
    type: "paragraph",
    margin: 0,
    align: "left",
    children: [{ text: "Nouveau paragraphe", marks: [] }]
  }
];

const citationType = [
  {
    type: "citation",
    margin: 0,
    align: "left",
    children: [{ text: "Nouveau chapitre", marks: [] }]
  }
];

export const reducerCreationCours = (state, action) => {
  console.log(action);
  let newState = { ...state };

  switch (action.type) {
    case "UpdateValue":
      newState.Cours[action.index] = {
        ...state.Cours[action.index],
        value: action.value
      };
      return newState;
    case "ReadOnly":
      newState.ReadOnly = action.index;
      return newState;
    case "Ajout":
      let value;
      switch (action.value) {
        case "titre":
          value = titreType;
          break;
        case "chapitre":
          value = chapitreType;
          break;
        case "sousChapitre":
          value = sousChapitreType;
          break;
        case "paragraphe":
          value = paragrapheType;
          break;
      }
      newState.Cours = [
        ...state.Cours,
        {
          value,
          type: action.value,
          options: { marginTop: 0, marginBottom: 0 }
        }
      ];

      return newState;

    default:
      return state;
  }
};

export const initialValue = {
  Cours: [
    {
      value: titreType,
      type: "titre",
      options: { marginTop: 0, marginBottom: 0 }
    },
    {
      value: chapitreType,
      type: "chapitre",
      options: { marginTop: 0, marginBottom: 0 }
    },
    {
      value: sousChapitreType,
      type: "sc",
      options: { marginTop: 0, marginBottom: 0 }
    }
  ],
  ReadOnly: null
};
