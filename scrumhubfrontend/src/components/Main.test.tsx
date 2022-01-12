/**
 * @jest-environment jsdom
 */

  import { render, unmountComponentAtNode } from "react-dom";
 import { act } from "react-dom/test-utils";
 import { isNull } from "lodash";
 import { store } from "../appstate/store"
 import { Provider } from "react-redux";
 import { BrowserRouter as Router } from "react-router-dom";
 import {Main} from "./Main";
import { testAuthorizationState } from "../authstate/auth";
import { authReducer } from "../authstate/authreducer";
import { AuthContext } from "../App";
 
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
         shallow(<Main/>)
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