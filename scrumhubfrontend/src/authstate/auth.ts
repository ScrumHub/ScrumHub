import React from "react";
import { useCookies } from "react-cookie";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
export const initialAuthorizationState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === "undefined" ? false : JSON.parse(localStorage.getItem("isLoggedIn") as string) || false,
  token: localStorage.getItem('token') === "undefined" ? null : JSON.parse(localStorage.getItem("token") as string) || null,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  proxy_url: process.env.REACT_APP_PROXY_URL,
  logout_url: process.env.REACT_APP_LOGOUT_URL
};

export interface ILogin {
  isLoggedIn: boolean,
  token: string,
  client_id: string,
  redirect_uri: string,
  client_secret: string,
  proxy_url: string,
  logout_url: string,
}

export interface LoginContext {
  state: ILogin,
  dispatch: React.Dispatch<React.SetStateAction<ILogin>>
}