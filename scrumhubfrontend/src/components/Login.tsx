import { useState, useEffect, useContext } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { AuthContext } from "../App";
import logo from './scrum.jpg';
import {useNavigate} from "react-router";
import { useCookies } from "react-cookie";
import config from "../configuration/config";
import * as Actions from '../appstate/actions';
import { store } from "../appstate/store";
import { Wrapper } from "./LoginWrapper";

export default function Login(props:any) {
  const { state, dispatch: auth, token } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  let navigate = useNavigate();
  const { client_id, redirect_uri, proxy_url} = state;
  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, "", newUrl[0]);
      setData({ ...data, isLoading: true });
      const requestData = {
        code: newUrl[1]
      };

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxy_url, {
        method: "POST",
        body: JSON.stringify(requestData)
      })
      .then (response => response.json())
        .then(response => {
            let params = new URLSearchParams(response);
            const access_token = params.get("access_token");
            if (access_token){ 
            setCookie(config.token, access_token, { path: "/" });
            auth({
              type: "LOGIN",
              payload: { token: access_token, isLoggedIn: true }
            }); }
            else{
              setData({
            isLoading: false,
            errorMessage: "Sorry! Login failed"
          });
          }
        })
        .catch(error => {
          setData({
            isLoading: false,
            errorMessage: "Sorry! Login failed"
          });
          
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, auth, data, proxy_url]);

  useEffect(() => {
  if (state.isLoggedIn)
  {
    localStorage.removeItem("ownerName");
    localStorage.removeItem("sprintID");
    navigate("/", { replace: true });
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[navigate, state, token]);


  return (
    <Wrapper>
      <section className="container">
        <div style={{height:"60vh",width:"50vh"}}>
          <h1>ScrumHub</h1>
          <img src={logo} alt="Logo" style={{width:"20vh"}}/>
          <span>{data.errorMessage}</span>
          <div className="login-container">
            {data.isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                {
                  // Link to request GitHub access
                }
                <a
                  className="login-link"
                  href={`http://github.com/login/oauth/authorize?scope=repo&client_id=${client_id}&redirect_uri=${redirect_uri}`}
                  onClick={() => {
                    setData({ ...data, errorMessage: "" });
                  }}
                >
                  <GithubOutlined />
                  <span>{state.isLoggedIn ?"Successful login":"Login with GitHub"}</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </Wrapper>
  );
}