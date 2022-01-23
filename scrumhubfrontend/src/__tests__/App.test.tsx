/**
 * @jest-environment jsdom
 */
import { Provider } from "react-redux";
import { initTestState } from "../appstate/stateTestValues";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import renderer from 'react-test-renderer';
import { isNull } from "lodash";
import { App } from "../App";
import { reducerFunction } from "../appstate/reducer";
describe('App component in container', () => {
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

  it("Rendered the app component", async () => {
    await act(async () => {
      render(

        <Provider store={store}>
            <App />
        </Provider>,
        container
      );
    });
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
  });

  it('main component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <Provider store={store}>
          <App/>
      </Provider>);
    let tree = temp.toJSON();
    expect(tree).toMatchSnapshot();
  });
});