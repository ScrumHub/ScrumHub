import { NavigateFunction } from "react-router";
import * as Actions from "../../appstate/actions";
import { clearProjectLocalStorage, getFetchBodyData, setLoginStateLocalStorage } from "./commonFunctions";
import { loginDataError } from "./commonInitValues";
import { ILoginData } from "./commonInterfaces";
import { store } from '../../appstate/store';

/**
 * Handles user login for the given token returned from GitHub
 * @param {String} token Token generated by GitHub for the current user
 * @param {NavigateFunction} navigate Function for changing the route 
 * @param {React.Dispatch<React.SetStateAction<ILoginData>>} setData Action for updating the state of Login data
 */
export function handleLogin( token: string, navigate: NavigateFunction, setData: React.Dispatch<React.SetStateAction<ILoginData>>): void {
    clearProjectLocalStorage();
    store.dispatch(
        Actions.getCurrentUserThunk({
            token: token,
        })
    ).then((response: any) => {
        if (response.payload && response.payload.code !== 0) {
            store.dispatch(Actions.login({ token: token, isLoggedIn: true }));
            setLoginStateLocalStorage(token);
            navigate("/", { replace: true });
        } else {
            setData(loginDataError);
        }
    });
}
/**
 * Renders routes for the breadcrumb component
 * @returns renderedRoutes
 */
export function ItemRender(route: any, params: any[], routes: any[], paths: string[]): JSX.Element {
    return (<span key={route.path}>{(route.icon ? route.icon : "")}{" " + route.breadcrumbName}</span>)
  }

  /** Posts login code to GitHub and returns authorization token */
export function postLoginCodeToGitHub( proxy_url: string, windowReference: string,
    navigate: NavigateFunction,
    setData: React.Dispatch<React.SetStateAction<ILoginData>>) {
    updateGhResponse(fetch(proxy_url as string, {
      method: "POST",
      body: JSON.stringify(getFetchBodyData(windowReference))
    }), navigate, setData);
  
  }

  export async function updateGhResponse(axiosRequest: Promise<Response>, navigate: NavigateFunction,
    setData: React.Dispatch<React.SetStateAction<ILoginData>>) {
    axiosRequest.then(response => response.json())
      .then(response => {
        let params = new URLSearchParams(response);
        const access_token = params.get("access_token");
        if (access_token) {
          handleLogin(access_token, navigate, setData);
        }
        else {
          setData(loginDataError);
        }
      })
      .catch((error: any) => {
        setData(loginDataError);
      })
  }
