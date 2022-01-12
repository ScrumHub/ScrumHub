/**
 * @jest-environment jsdom
 */
 import { render, unmountComponentAtNode } from "react-dom";
 import { act } from "react-dom/test-utils";
 import { isNull } from "lodash";
 import { Provider } from "react-redux";
 import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
 import {Login} from "./Login";
import { AuthContext } from "../App";
import { testAuthorizationState } from "../authstate/auth";
import { authReducer } from "../authstate/authreducer";
import { configureStore } from "@reduxjs/toolkit";
import { reducerFunction } from "../appstate/reducer";
import { initTestState } from "../appstate/stateTestValues";
import { Home } from "./Home";
 
describe('Login component rendered in container', () => {
  let container : any;
  let store:any;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    store = configureStore({
      reducer: reducerFunction(initTestState),
    });
  });
  
    afterEach(() => {
      // cleanup on exiting
      if (!isNull(container)) {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
      }
    });
  
    it("Rendered list of repos", async () => {
      await act( async () =>  {
        render(
          
         <Provider store={store}>
         <AuthContext.Provider
           value={{
             state: testAuthorizationState,
             dispatch: authReducer
           }}
         >
            <Router>
         <Routes>
         <Route path="/login" element={<Login/>} />
         <Route path="/" element={<Home/>} />
           </Routes>
         </Router>
         </AuthContext.Provider>
       </Provider>,
          container
        );
      });
      expect(
        container?.getElementsByClassName("container").length
      ).toBeGreaterThanOrEqual(0);
      expect(container.textContent).toBe("");
    });
  });

 