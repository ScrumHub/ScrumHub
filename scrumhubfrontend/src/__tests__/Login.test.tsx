/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { isNull } from "lodash";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import renderer from 'react-test-renderer';
import { initTestState, initTestUseState } from "../appstate/stateTestValues";
import { reducerFunction } from "../appstate/reducer";
import { Login } from "../components/Login";
import React from "react";
import * as Actions from "../appstate/actions";

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('Login component rendered in container', () => {
  let container: any;
  let useEffect: any;
  let store: any;
  let setState: any;
  let useStateMock: any;
  let useStateSpy: any;
  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f());
  };
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    useEffect = jest.spyOn(React, "useEffect");
    setState = jest.fn();
    useStateMock = (initState: any) => [initState, setState];
    useStateSpy = jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    mockUseEffect();
  });

  afterEach(() => {
    // cleanup on exiting
    jest.clearAllMocks();
    if (!isNull(container)) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });
  useStateSpy = jest.spyOn(React, 'useState');
  it("Rendered login", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<></>} />
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
    expect(useStateSpy).toHaveBeenNthCalledWith(1, initTestUseState);
  });
  it('login component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>).toJSON();
    expect(temp).toMatchSnapshot();
  });
});

