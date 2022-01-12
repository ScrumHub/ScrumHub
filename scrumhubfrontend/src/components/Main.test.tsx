/**
 * @jest-environment jsdom
 */

//import { store } from "../appstate/store"
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Main } from "./Main";
import { testAuthorizationState } from "../authstate/auth";
import { authReducer } from "../authstate/authreducer";
import { AuthContext } from "../App";
//import configureStore from 'redux-mock-store';
import { initTestState } from "../appstate/stateTestValues";
import { reducerFunction } from "../appstate/reducer";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { isNull } from "lodash";
describe('Main component in container', () => {
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
          <Main/>
          </Router>
          </AuthContext.Provider>
        </Provider>,
        container
      );
    });
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
    expect(container.textContent).toBe("ProjectsLogoutProduct BacklogActive Sprint ScrumHub  © Created in 2021");
  });
});