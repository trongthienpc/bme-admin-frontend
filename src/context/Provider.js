import { useReducer } from "react";
import context from "./context";
import Reducer, { initState } from "./Reducer";

function Provider({ children }) {
  const [state, dispatch] = useReducer(Reducer, initState);
  return (
    <context.Provider value={[state, dispatch]}>{children}</context.Provider>
  );
}

export default Provider;
