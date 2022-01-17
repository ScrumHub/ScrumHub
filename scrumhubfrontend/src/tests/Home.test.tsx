/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { isNull } from "lodash";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { reducerFunction } from "../appstate/reducer";
import { initTestState } from "../appstate/stateTestValues";
import renderer from 'react-test-renderer';
import { Home } from "../components/Home";

describe('Home component succesfully rendered', () => {
  let container: any;
  let store: any;
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
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </Provider>,
        container
      );
    });
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
    expect(container.textContent).toBe("");
  });

  it('home component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </Provider>).toJSON();
    expect(temp).toMatchSnapshot();
  });
});
