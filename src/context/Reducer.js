import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  LOAD_USER,
  LOCAL_STORAGE_TOKEN_NAME,
  LOGIN,
  apiUrl,
  ADD_ROOM_STYLE,
  LOAD_ROOM_STYLE,
  LOGOUT,
  DELETE_ROOM_STYLE,
  FIND_ROOM,
  UPDATE_ROOM,
} from "./constant";
const initState = {
  user: null,
  isAuthenticated: false,
  loginStatus: false,
  loginMessage: "",
  addMessage: "",
  roomStyles: [],
  roomStyle: {},
};

const roomStyleState = {
  roomStyles: [],
  roomStyle: {},
};

function Reducer(state, action) {
  switch (action.type) {
    case UPDATE_ROOM:
      return {
        ...state,
        roomStyles: [...state.roomStyles],
      };
    case FIND_ROOM:
      return {
        ...state,
        roomStyle: action.payload,
      };
    case DELETE_ROOM_STYLE:
      return {
        ...state,
        roomStyles: state.roomStyles.filter(
          (room) => room._id !== action.payload
        ),
      };

    case LOAD_ROOM_STYLE:
      return {
        ...state,
        roomStyles: action.payload,
      };

    case ADD_ROOM_STYLE:
      return {
        ...state,
        addMessage: action.payload.message,
      };

    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        loginMessage: action.payload.message,
        loginStatus: action.payload.success,
      };
    case LOGOUT:
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      break;
  }
}

const loadUser = async () => {
  if (localStorage[LOCAL_STORAGE_TOKEN_NAME])
    setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
  try {
    const response = await axios.get(`${apiUrl}/auth`);
    if (response.data.success) {
      return {
        ...initState,
        isAuthenticated: true,
        user: response.data.user,
      };
    }
  } catch (error) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    setAuthToken(null);
    return {
      ...initState,
      isAuthenticated: false,
      user: null,
    };
  }
};

export { initState, roomStyleState, loadUser };
export default Reducer;
