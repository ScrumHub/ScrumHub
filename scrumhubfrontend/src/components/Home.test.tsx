/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { isNull } from "lodash";
import { store } from "../appstate/store"
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import { AuthContext } from "../App";
import { testAuthorizationState } from "../authstate/auth";
import { authReducer } from "../authstate/authreducer";

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (!isNull(container)) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
});

it("Rendered list of repos", () => {
  act(() => {
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
              <Route path="/" element={<Home />} />
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
});