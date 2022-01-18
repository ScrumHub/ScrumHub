import { useState, useEffect } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import * as Actions from '../appstate/actions';
import { Wrapper } from "./LoginWrapper";
import { store } from "../appstate/store";
import { loginData } from "./utility/commonInitValues";
import { useSelector } from "react-redux";
import { IState } from "../appstate/stateInterfaces";
import { setLocalStorage as setLoginStateLocalStorage } from "./utility/commonFunctions";
import { handleLogin } from "./utility/LoginAndMainHandlers";

export function Login(props: any) {
  const loginState = useSelector((appState: IState) => appState.loginState);
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const error = useSelector((appState: IState) => appState.error);
  const navigate = useNavigate();
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    if (hasCode && loginState.proxy_url!=="") {
      const newUrl = url.split("?code=");
      window.history.pushState({}, "", newUrl[0]);
      setData({ ...data, isLoading: true });
      const requestData = {
        code: newUrl[1]
      };
      fetch(loginState.proxy_url as string, {
        method: "POST",
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(response => {
          let params = new URLSearchParams(response);
          const access_token = params.get("access_token");
          if (access_token) {
            store.dispatch(Actions.login({ token: access_token, isLoggedIn: true }));
            setLoginStateLocalStorage(access_token);
            handleLogin(access_token, navigate);
          }
          else {
            setData(loginData);
          }
        })
        .catch((error:any) => {
          setData(loginData);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.isLoggedIn,loginState.token, data, loginState.proxy_url]);
  useEffect(() => {
    if (error.hasError) {
      setData(loginData);
    }
  }, [error.hasError]);
  return (
    <Wrapper>
      <section className="container">
        <div style={{ height: "60vh", width: "50vh" }}>
          <h1>ScrumHub</h1>
          <img src={process.env.PUBLIC_URL+"logo.png"} alt="Logo" style={{ width: "20vh" }} />
          <span>{data.errorMessage}</span>
          <div className="login-container">
            {data.isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                <a
                  className="login-link"
                  href={`http://github.com/login/oauth/authorize?scope=repo&client_id=${loginState.client_id}&redirect_uri=${loginState.redirect_uri}`}
                  onClick={() => {
                    setData({ ...data, errorMessage: "" });
                  }}
                >
                  <GithubOutlined />
                  <span>{loginState.isLoggedIn ? "Successful login" : "Login with GitHub"}</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </Wrapper>
  );
}