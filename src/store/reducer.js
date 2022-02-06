import { SET_TODO_INPUT, ADD_TODO, SET_THEME } from './constants'

const initState = {
    todos: [],
    todoInput: ''
}

const initThemeState = {
    theme: 'dark'
}

function reducer(state, action) {
    switch (action.type) {
        case SET_TODO_INPUT:

            return {
                ...state,
                todoInput: action.payload
            }

        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            }

        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        default:
            throw new Error('sai lam roi');
    }
}
export { initState }
export { initThemeState }
export default reducer