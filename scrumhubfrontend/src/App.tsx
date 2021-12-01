import { BrowserRouter as Router } from 'react-router-dom';
import { useReducer } from 'react';
//import  Redirect from "react-router-dom";
import 'antd/dist/antd.css';
import React from 'react';
import { authReducer } from './authstate/authreducer';
import { initialAuthorizationState } from './authstate/auth';
import Main from './components/Main';
//import { store } from './appstate/store';
export const AuthContext = React.createContext<any>({} as any);



function App() {
  const [state, dispatch] = useReducer(authReducer, initialAuthorizationState);
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
        <Router>
          <Main></Main>
        </Router>
    </AuthContext.Provider>
  );
}

export default App;