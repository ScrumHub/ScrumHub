/**
 * @jest-environment jsdom
 */

//import { store } from "../appstate/store"
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from "../components/Main";
//import configureStore from 'redux-mock-store';
import { initTestState } from "../appstate/stateTestValues";
import { reducerFunction } from "../appstate/reducer";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { cleanup, render as renderTest } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { isNull } from "lodash";
import { fireEvent } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
const { act: actTest } = TestRenderer;
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

  it("Rendered list of repos", async () => {
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
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
    expect(container.textContent).toBe("ProjectsLogoutProduct BacklogActive SprintScrumHubLogin with GitHub ScrumHub  © Created in 2021");
    // manually trigger the callback
    expect(
      container?.getElementsByClassName("ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light mainMenu").length
    ).toBeGreaterThanOrEqual(0);
    let button = container.querySelector(".mainMenu");
    const button2 = container.querySelector(".mainMenu");
    act(() => {
      button.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    });
    button = container.querySelector(".mainMenu");
    expect(button2).toBe(button);
    //expect(document.title).toBe('You clicked 1 times');
  });

  it('main component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login/*" element={<Main />} />
          </Routes>
        </Router>
      </Provider>);
    let tree = temp.toJSON();
    expect(tree).toMatchSnapshot();
  });
  /*it('Main changes after click, keydown, mouseenter', async () => {
    let main = await actTest(async () => {renderTest(
      <Provider store={store}>
          <Router>
            <Main />
          </Router>
        </Provider>,
    )}) as any;
    //console.log(main);
    //main = (isNull(main)||typeof(main)=="undefined"?<></>:main )as HTMLDivElement;
    //console.log(main);
    //expect(main.getElementsByClassName(
     // "ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light mainMenu"))
     // .toBe(main!==<></>?[]:"");
    //expect(getByRole("menu")).toBe("");
    //"ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light mainMenu"

    //fireEvent.keyDown(getByLabelText("menu"));
  //let tree = container.toJSON();
  //fireEvent.keyDown(tree);
  // re-rendering
  //tree = container.toJSON();
  //expect(tree).toMatchSnapshot();
});*/
});