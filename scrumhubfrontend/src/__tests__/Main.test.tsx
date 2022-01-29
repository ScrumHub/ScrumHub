/**
 * @jest-environment jsdom
 */
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { initTestState } from "../appstate/stateTestValues";
import * as Actions from "../appstate/actions";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import renderer from 'react-test-renderer';
import { isNull } from "lodash";
import TestRenderer from "react-test-renderer";
import { reducerFunction } from "../appstate/reducer";
import { Main } from "../components/Main";
const {act:actTester} = TestRenderer;
describe('Main component in container', () => {
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
  it('main component rendered is the same as snapshot', async () => {
    let temp;
    actTester(() => {
      temp = renderer.create(
      <Provider store={store}>
        <Router>
        <Main />
        </Router>
      </Provider>)});
    expect((temp as any).toJSON()).toMatchSnapshot();
  });
  it("Rendered list of repos successfully", async () => {
    await act(async () => {
      render(

        <Provider store={store}>
          <Router>
            <Main />
          </Router>
        </Provider>,
        container
      );
    });
    //console.log(container);
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
  });

});
describe('Main component when user is logged in', () => {
  let secondContainer: any;
  let store: any;
  beforeEach(() => {
    secondContainer = document.createElement('div');
    document.body.appendChild(secondContainer);
    store = configureStore({
      reducer: reducerFunction(initTestState),
    });
  });

  afterEach(() => {
    // cleanup on exiting
    if (!isNull(secondContainer)) {
      unmountComponentAtNode(secondContainer);
      secondContainer.remove();
      secondContainer = null;
    }
  });
  it("Rendered list of repos", async () => {
    const onChange = jest.fn();
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Main onChange={onChange}/>
          </Router>
        </Provider>,
        secondContainer
      );
    });
    
    await store.dispatch(Actions.login({token:"token", isLoggedIn:true}));
    //console.log(container);
    expect(
      secondContainer?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
    expect(secondContainer.textContent).not.toEqual("ScrumHubLogin       ScrumHub  © Created in 2021  Logo  © Created by BomSymbols");
    // manually trigger the callback
    expect(
      secondContainer?.getElementsByClassName("ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light mainMenu").length
    ).toBeGreaterThanOrEqual(0);
  });

});
