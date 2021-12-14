import fetch from "node-fetch";
import express from"express";
import  bodyParser from "body-parser";

import {FormData} from "formdata-node";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { client_id, redirect_uri, client_secret} = require("./serverconfig");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: true }));
//changed to true

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
  const { code } = req.body;
  //form data for node
  const data = new FormData();
  data.set("client_id", client_id);
  data.set("client_secret", client_secret);
  data.set("code", code);
  data.set("redirect_uri", redirect_uri);
  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body:data,
  }
  )
    .then((response) => response.text())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

app.get("/", (req, res) => {
})

app.get("/logout", (req, res) => {
    //const { token } = req.headers.authorization;
    res.clearCookie('ai_user', { path: '/login' });
    var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        //var name = retrieveCookie(cookies[i]).toString();
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
})


const PORT = process.env.REACT_APP_SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));