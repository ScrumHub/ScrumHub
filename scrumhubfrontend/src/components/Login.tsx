import { useState, useEffect, useContext } from "react";
import Styled from "styled-components";
import { GithubOutlined } from "@ant-design/icons";
import { AuthContext } from "../App";
import logo from './scrum.jpg';
import {useNavigate} from "react-router";
import { useCookies } from "react-cookie";
import config from "../configuration/config";

export default function Login(props:any) {
  const { state, dispatch: auth } = useContext(AuthContext);
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
            
          //}
        })
        .catch(error => {
          setData({
            isLoading: false,
            errorMessage: "Sorry! Login failed"
          });
          
        });
    }
  }, [state, auth, data, proxy_url]);
  useEffect(() => {
  if (state.isLoggedIn)
  {
    navigate("/", { replace: true });
  }
},[navigate, state]);


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

const Wrapper = Styled.section`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial;
    background-color:#fff;
    

    > div:nth-child(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      width: 25%;
      height: 45%;

      > h1 {
        font-size: 2rem;
        margin-bottom: 20px;
      }

      > span:nth-child(2) {
        font-size: 1.1rem;
        color: #808080;
        margin-bottom: 70px;
      }

      > span:nth-child(3) {
        margin: 10px 0 20px;
        color: red;
      }

      .login-container {
        background-color: #000;
        width: 70%;
        border-radius: 3px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        > .login-link {
          text-decoration: none;
          color: #fff;
          text-transform: uppercase;
          cursor: default;
          display: flex;
          align-items: center;          
          height: 40px;

          > span:nth-child(2) {
            margin-left: 5px;
          }
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;          
          height: 40px;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
`;
