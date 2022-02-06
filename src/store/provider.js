import { useReducer } from 'react'
import Context from "./context";
import reducer, { initState, initThemeState } from './reducer';
import logger from './logger';
function Provider({ children }) {
    const [state, dispatch] = useReducer(logger(reducer), initState)
    const [state1, dispatch1] = useReducer(logger(reducer), initThemeState)
    return (
        <Context.Provider value={[state, dispatch], [state1, dispatch1]}>
            {children}
        </Context.Provider>
    )
}

export default Provider