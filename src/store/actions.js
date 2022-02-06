import { SET_TODO_INPUT, ADD_TODO, SET_THEME } from './constants'
export const setTodoInput = payload => ({
    type: SET_TODO_INPUT,
    payload
})

export const addTodo = payload => ({
    type: ADD_TODO,
    payload
})

export const setTheme = payload => ({
    type: SET_THEME,
    payload
})