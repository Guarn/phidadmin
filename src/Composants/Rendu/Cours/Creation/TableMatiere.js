import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { ListeContext } from "./index";
import Scroll, {
  Link,
  Events,
  scrollSpy,
  animateScroll,
  Element
} from "react-scroll";

const Conteneur = styled.div`
  display: flex;
  flex-direction: column;
`;

const Titre = styled.h2`
  text-align: center;
  cursor: arrow;
`;

const El0 = styled.div`
  margin-left: 0px;
  &:hover {
    font-weight: bold;
  }
`;

const El1 = styled.div`
  margin-left: 15px;
  &:hover {
    font-weight: bold;
  }
`;

const El2 = styled.div`
  margin-left: 30px;
  &:hover {
    font-weight: bold;
  }
`;

const El3 = styled.div`
  margin-left: 45px;
  &:hover {
    font-weight: bold;
  }
`;
const El4 = styled.div`
  margin-left: 60px;
  &:hover {
    font-weight: bold;
  }
`;

const TableMatiere = props => {
  const [state, setState] = useContext(ListeContext);

  useEffect(() => {
    Events.scrollEvent.register("begin", function() {});

    Events.scrollEvent.register("end", function() {});

    scrollSpy.update();
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  });
  return (
    <Conteneur id="TableMatiere">
      {state.Cours.map((element, index) => {
        if (element.TableMatiere.actif) {
          switch (element.TableMatiere.type) {
            case "titre":
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <Titre>{element.TableMatiere.value}</Titre>
                </Link>
              );
            case "1":
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <El1>{element.TableMatiere.value}</El1>
                </Link>
              );
            case "2":
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <El2 key={`TABMAT-${index}`}>
                    {element.TableMatiere.value}
                  </El2>
                </Link>
              );
            case "3":
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <El3 key={`TABMAT-${index}`}>
                    {element.TableMatiere.value}
                  </El3>
                </Link>
              );
            case "4":
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <El4 key={`TABMAT-${index}`}>
                    {element.TableMatiere.value}
                  </El4>
                </Link>
              );

            default:
              return (
                <Link
                  key={`TABMAT-${index}`}
                  activeClass="active"
                  to={`element-${index}`}
                  spy={true}
                  smooth={true}
                  duration={250}
                  containerId="ScrollConteneur"
                >
                  <El0 key={`TABMAT-${index}`}>
                    {element.TableMatiere.value}
                  </El0>
                </Link>
              );
          }
        }
      })}
    </Conteneur>
  );
};
export default TableMatiere;
