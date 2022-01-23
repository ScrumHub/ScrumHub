import { NavigateFunction } from "react-router";
import * as Actions from "../../appstate/actions";
import { store } from "../../appstate/store";
import { clearProjectLocalStorage } from "./commonFunctions";

export const handleLogin = (token:string, navigate:NavigateFunction) => {
    clearProjectLocalStorage();
    store.dispatch(
        Actions.getCurrentUserThunk({
            token: token,
        })
    ).then((response: any) => {
        if (response.payload && response.payload.code !== 0) {
            store.dispatch(Actions.login({ token: token, isLoggedIn: true }));
            navigate("/", { replace: true });
        }
    });
}

export function ItemRender(route: any, params: any[], routes: any[], paths: any[]) {
    return (<span key={route.path}>{(route.icon ? route.icon : "")}{" " + route.breadcrumbName}</span>)
  }