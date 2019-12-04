import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useRef
} from "react";
import styled from "styled-components";
import { reducerCreationCours, initialValue } from "./reducer";
import { Button } from "antd";

import Slate from "../../../Fonctionnels/Slate";

const ConteneurGlobal = styled.div`
  height: ${props => props.height + "px"};
  width: ${props => props.width + "px"};
`;

const ConteneurSlate = styled.div`
  background-color: rgba(255, 255, 255, 0);
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Creation = props => {
  const [state, setState] = useReducer(reducerCreationCours, initialValue);
  const refConteneur = useRef(null);

  function changeState(val, index) {
    setState({ type: "UpdateValue", value: val, index: index });
  }
  function clickOutside(event) {

    if (!refConteneur.current.contains(event.target)) {
      setState({ type: "ReadOnly", index: null });
    }
  }

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  });

  return (
    <ConteneurGlobal
      ref={refConteneur}
      height={props.height}
      width={props.width}
    >
      {state.Cours.map((element, index) => {
        return (
          <ConteneurSlate
            onMouseDown={() => setState({ type: "ReadOnly", index: index })}
            key={index}
          >
            <Slate
              onChange={val => {
                changeState(val, index);
              }}
              index={index}
              readOnly={state.ReadOnly}
              initialValue={element.value}
            />
          </ConteneurSlate>
        );
      })}
      <Button
        onMouseDown={() => {
          setState({ type: "Ajout", value: "titre" });
        }}
      >
        Titre
      </Button>
      <Button
        onMouseDown={() => {
          setState({ type: "Ajout", value: "chapitre" });
        }}
      >
        Chapitre
      </Button>
      <Button
        onMouseDown={() => {
          setState({ type: "Ajout", value: "sousChapitre" });
        }}
      >
        Sous-chapitre
      </Button>
      <Button
        onMouseDown={() => {
          setState({ type: "Ajout", value: "paragraphe" });
        }}
      >
        Paragraphe
      </Button>
    </ConteneurGlobal>
  );
};
export default Creation;
