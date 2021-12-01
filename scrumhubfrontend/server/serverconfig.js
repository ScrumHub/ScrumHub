let joi = require('joi') 
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const config = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  proxy_url: process.env.REACT_APP_PROXY_URL,
  logout_url: process.env.REACT_APP_LOGOUT_URL
  
};

const envVarsSchema = joi.object({
  client_id: joi.string().required(),
  redirect_uri: joi.string().required(),
  client_secret: joi.string().required(),
  proxy_url: joi.string().required(),
  logout_url: joi.string().required(),
});

const { error } = envVarsSchema.validate(config);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = config;
