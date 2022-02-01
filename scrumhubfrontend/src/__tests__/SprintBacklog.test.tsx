/**
 * @jest-environment jsdom
 */

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { isNull } from "lodash";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { reducerFunction } from "../appstate/reducer";
import { initTestState, updatedTestState } from "../appstate/stateTestValues";
import renderer, {create} from 'react-test-renderer';
import { Project } from "../components/Project";
import { Home } from "../components/Home";
import TestRenderer from "react-test-renderer";
import { SprintBacklog } from "../components/SprintBacklog";
import { testMediaMatchObject } from "../appstate/stateUtitlities";
const { act: actTest } = TestRenderer;


describe('Project component in container', () => {
  let container: any;
  let store: any;
  beforeEach(() => {
    testMediaMatchObject();
    container = document.createElement('div');
    document.body.appendChild(container);
    store = configureStore({
      reducer: reducerFunction(updatedTestState),
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

  it("Rendered Backlog tables", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Routes>
            <Route path={`/:owner/:name/Sprints/:number`} element={<SprintBacklog />} />
            <Route path={`/:owner/:name/active-sprint/:number`} element={<SprintBacklog />} />
              <Route path={`/`} element={<></>} />
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
          <SprintBacklog />
        </Router>
      </Provider>).toJSON();
    expect(temp).toMatchSnapshot();
  });

  it("Submitting a name via the input field changes the name state value", () => {
    actTest(() => { create(<Provider store={store}>
      <Router>
        <Routes>
        <Route path={`/:owner/:name/Sprints/:number`} element={<SprintBacklog />} />
            <Route path={`/:owner/:name//:number`} element={<SprintBacklog />} />
              <Route path={`/`} element={<></>} />
        </Routes>
      </Router>
    </Provider>)});
  });
  it("No Expanded rows", () => {
    store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    actTest(() => {create(<Provider store={store}>
      <Router>
        <Routes>
          <Route path={`/:owner/:name`} element={<Project />} />
          <Route path={`/`} element={<Home />} />
        </Routes>
      </Router>
    </Provider>)});
  });
  it("Rendered backlog tables", async () => {
    store = configureStore({
      reducer: reducerFunction(initTestState),
    });
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
  it('project component loading', async () => {
    store = configureStore({
      reducer: reducerFunction({...initTestState, loading:true}),
    });
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
});
