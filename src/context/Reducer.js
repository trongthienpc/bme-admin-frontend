import setAuthToken from "../utils/setAuthToken";
import {
  LOAD_USER,
  LOCAL_STORAGE_TOKEN_NAME,
  LOGIN,
  apiUrl,
  ADD_ROOM_STYLE,
} from "./constant";
import axios from "axios";
const initState = {
  user: null,
  isAuthenticated: false,
  loginStatus: false,
  loginMessage: "",
  roomStyles: [],
  roomStyle: {},
};

const roomStyleState = {
  roomStyles: [],
  roomStyle: {},
};

function Reducer(state, action) {
  switch (action.type) {
    case ADD_ROOM_STYLE:
      return {
        ...state,
        roomStyles: [...state.roomStyles, action.payload],
      };
      break;

    case LOAD_USER:
      const loadUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME])
          setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        try {
          const response = await axios.get(`${apiUrl}/auth`);
          if (response.data.success) {
            return {
              ...state,
              isAuthenticated: true,
              user: response.data.user,
            };
          }
        } catch (error) {
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
          setAuthToken(null);
          return {
            ...state,
            isAuthenticated: false,
            user: null,
          };
        }
      };
      loadUser();
      break;
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        loginMessage: action.payload.message,
        loginStatus: action.payload.status,
      };

    default:
      break;
  }
}

export { initState, roomStyleState };
export default Reducer;
