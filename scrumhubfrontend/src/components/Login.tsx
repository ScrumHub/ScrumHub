import { useState, useEffect } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { loginData } from "./utility/commonInitValues";
import { useSelector } from "react-redux";
import { IState } from "../appstate/stateInterfaces";
import { getFetchBodyData, hasGithubResponseCode, setLocalStorage as setLoginStateLocalStorage } from "./utility/commonFunctions";
import { handleLogin } from "./utility/LoginAndMainHandlers";
import "./Login.css";
import { Button } from "antd";
import { url } from "inspector";

export function Login(props: any) {
  const loginState = useSelector((appState: IState) => appState.loginState);
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const [imgLoaded, setImgLoaded] = useState(false);
  const error = useSelector((appState: IState) => appState.error);
  const navigate = useNavigate();
  useEffect(() => {
    if (hasGithubResponseCode(window.location.href) && loginState.proxy_url !== "") {
      const fetchBodyData = getFetchBodyData(window.location.href);
      setData({ ...data, isLoading: true });
      fetch(loginState.proxy_url as string, {
        method: "POST",
        body: JSON.stringify(fetchBodyData)
      })
        .then(response => response.json())
        .then(response => {
          let params = new URLSearchParams(response);
          const access_token = params.get("access_token");
          if (access_token) {
            setLoginStateLocalStorage(access_token);
            handleLogin(access_token, navigate);
          }
          else {
            setData(loginData);
          }
        })
        .catch((error: any) => {
          setData(loginData);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.isLoggedIn, loginState.token, data, loginState.proxy_url]);
  useEffect(() => {
    if (error.hasError) {
      setData(loginData);
    }
  }, [error.hasError]);
  return (
      <section className="mainContainer">
        <div className="loginDiv">
          <h1 className="loginh1">ScrumHub</h1>
          <div className={imgLoaded ? "imgLoginNone": "imgLoginTemp"}></div>
          <img onLoad={(e) => { setImgLoaded(true); }} src={process.env.PUBLIC_URL +'/logo.png'} alt="Logo" className={imgLoaded ? "imgLoginLogo" : "imgLoginNone"} />
          <span className="errorSpan">{data.errorMessage}</span>
          <div className="loginContainer">
            {data.isLoading ? 
              <div className="loaderContainer">
                <div className="loader"></div>
              </div>
             : 
              <Button type="primary" href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${loginState.client_id}&redirect_uri=${loginState.redirect_uri}`}
                  onClick={() => {setData({ ...data, errorMessage: "" });}}
                  style={{backgroundColor:"black", borderColor:"black", whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"clip", width:"100%"}}>
               <span style={{color:"white", fontFamily:'Montserrat', whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"clip", width:"100%", textTransform:"uppercase"}}>{loginState.isLoggedIn ? "Logged in  " : "Login  "}    <GithubOutlined /></span>
              </Button>}

            
          </div>
                          {/*<a
                  className="loginLink"
                  href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${loginState.client_id}&redirect_uri=${loginState.redirect_uri}`}
                  onClick={() => {setData({ ...data, errorMessage: "" });}}
                  style={{whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"clip"}}
                >
                  <span style={{whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"clip"}}>{loginState.isLoggedIn ? "Logged in " : "Login "}    <GithubOutlined /></span>
                </a>*/}
        </div>
      </section>
  );
}