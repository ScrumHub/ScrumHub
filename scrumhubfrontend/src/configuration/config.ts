/**
 * Configuration of the application, can be in development or in production
 */
export type Config = {
  environment_name: string;
  backend: {
    ip: string;
    port: number;
  };
  defaultFilters: {
    size: number;
    page: number;
    pbiSize:number;
    sprintSize:number;
  };
  token:string;
};

/**
 * Renders default configuration
 */
const configObject: Config = require(process.env.NODE_ENV === "development"
  ? "./development.json"
  : "./production.json");

export default configObject;