import { useState, useEffect } from "react";
import { GithubOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { loginDataError } from "./utility/commonInitValues";
import { useSelector } from "react-redux";
import { IState } from "../appstate/stateInterfaces";
import { getFetchBodyData, hasGithubResponseCode } from "./utility/commonFunctions";
import { handleLogin } from "./utility/LoginAndMainHandlers";
import "./Login.css";
import { Button } from "antd";

/**
 * @returns {Element} Login Component that lets user Login via Github
 */
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
            handleLogin(access_token, navigate, setData);
          }
          else {
            setData(loginDataError);
          }
        })
        .catch((error: any) => {
          setData(loginDataError);
        });
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
              onClick={(e) => { e.preventDefault() }}
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