export const authReducer = (state: any, action: any ) => {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
      /*TO DO*/ //add token encryption or move it to backend
      localStorage.setItem("token", JSON.stringify(action.payload.token))
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        token: action.payload.token
      };
    }
    case "LOGOUT": {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("token")
      localStorage.removeItem("ownerName");
      localStorage.removeItem("sprintID");
      //localStorage.clear()
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      return {
        ...state,
        isLoggedIn: false,
        token: null
      };
    }
    default:
      return state;
  }
};
