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
import { initTestState } from "./stateTestValues";
import renderer, {create} from 'react-test-renderer';
import { Project } from "../components/Project";
import { Home } from "../components/Home";
import { getByText } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
const { act: actTest } = TestRenderer;


describe('Project component in container', () => {
  let container: any;
  let store: any;
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
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
              <Route path={`/:owner/:name`} element={<Project />} />
              <Route path={`/`} element={<Home />} />
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

  it('project component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <Provider store={store}>
        <Router>
          <Project />
        </Router>
      </Provider>).toJSON();
    expect(temp).toMatchSnapshot();
  });

  it("Submitting a name via the input field changes the name state value", () => {
    let createdComp;
    actTest(() => {createdComp = create(<Provider store={store}>
      <Router>
        <Routes>
          <Route path={`/:owner/:name`} element={<Project />} />
          <Route path={`/`} element={<Home />} />
        </Routes>
      </Router>
    </Provider>)});
    const instance = (createdComp as any).root;
    /*const button = instance?.findByProps();
    button.props.onClick();
    expect(button.props.children).toBe("PROCEED TO CHECKOUT");*/
    //expect(instance?).toBe("");
    //expect(window.localStorage.getItem("name")).toBe(newName);
  });
});
