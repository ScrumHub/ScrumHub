
import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import joi from "joi";
const require = createRequire(import.meta.url);
const path = require("path");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

export const githubConfig = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  proxy_url: process.env.REACT_APP_PROXY_URL,
  logout_url: process.env.REACT_APP_LOGOUT_URL
};

const validateGithubConfig = joi.object({
  client_id: joi.string().required(),
  redirect_uri: joi.string().required(),
  client_secret: joi.string().required(),
  proxy_url: joi.string().required(),
  logout_url: joi.string().required(),
});

const { error } = validateGithubConfig.validate(githubConfig);
if (error) {
  throw new Error(`Config validation error.`);
}
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: any, res: any, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req: any, res: any) => {
  const { code } = req.body;
  const data = {
    client_id: githubConfig.client_id, client_secret: githubConfig.client_secret,
    code: code, redirect_uri: githubConfig.redirect_uri
  };
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
    }
  })
    .then((response: any) => response.text())
    .then((response: any) => {
      return res.status(200).json(response);
    })
    .catch((error: any) => {
      return res.status(400).json(error);
    });
});

const PORT = process.env.REACT_APP_SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));