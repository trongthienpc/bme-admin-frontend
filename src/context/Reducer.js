import setAuthToken from "../utils/setAuthToken";
import { LOAD_USER, LOCAL_STORAGE_TOKEN_NAME, LOGIN, apiUrl } from "./constant";
import axios from "axios";
const initState = {
  user: null,
  isAuthenticated: false,
  loginStatus: false,
  loginMessage: ''
};

function Reducer(state, action) {
  switch (action.type) {
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
        loginStatus: action.payload.status
      };

    default:
      break;
  }
}

export { initState };
export default Reducer;
