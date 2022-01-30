import { useEffect } from "react";
import { GithubOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { initLoginData, loginDataError } from "./utility/commonInitValues";
import { useSelector } from "react-redux";
import { IState } from "../appstate/stateInterfaces";
import "./Login.css";
import { Button } from "antd";
import React from "react";
import { ILoginData } from "./utility/commonInterfaces";
import { hasGithubResponseCode } from "./utility/commonFunctions";
import { postLoginCodeToGitHub } from "./utility/LoginAndMainHandlers";

/**
 * @returns {Element} Login Component that lets user Login via Github
 */
export function Login(props: any) {
  const loginState = useSelector((appState: IState) => appState.loginState);
  const [data, setData] = React.useState<ILoginData>(initLoginData);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const error = useSelector((appState: IState) => appState.error);
  const navigate = useNavigate();
  useEffect(() => {
    if (hasGithubResponseCode(window.location.href) && loginState.proxy_url !== "") {
      setData({ ...data, isLoading: true });
      postLoginCodeToGitHub(loginState.proxy_url,window.location.href, navigate, setData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.isLoggedIn, loginState.token, data, loginState.proxy_url]);
  useEffect(() => {
    if (error.hasError) {
      setData(loginDataError);
    }
  }, [error.hasError]);
  return (
    <section className="mainContainer">
      <div className="loginDiv">
        <h1 className="loginh1">ScrumHub</h1>
        <div className={imgLoaded ? "imgLoginNone" : "imgLoginTemp"}></div>
        <img onLoad={(e) => { setImgLoaded(true); }} src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className={imgLoaded ? "imgLoginLogo" : "imgLoginNone"} />
        <span className="errorSpan">{data.errorMessage}</span>
        <div className="loginContainer">
          {data.isLoading ?
            <Button icon={<LoadingOutlined />} type="primary"
              style={{ backgroundColor: "black", borderColor: "black", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "clip", width: "100%" }}>
            </Button> :
            <Button type="primary" href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${loginState.client_id}&redirect_uri=${loginState.redirect_uri}`}
              style={{ backgroundColor: "black", borderColor: "black", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "clip", width: "100%" }}>
              {<span style={{ color: "white", fontFamily: 'Montserrat', whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "clip", width: "100%", textTransform: "uppercase" }}>{loginState.isLoggedIn && !data.errorMessage ? "Logged in  " : "Login  "}    <GithubOutlined /></span>}
            </Button>
          }
        </div>
      </div>
    </section>
  );
}