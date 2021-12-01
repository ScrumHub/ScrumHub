export type Config = {
    environment_name: string;
    backend: {
      ip: string;
      port: number;
    };
    defaultFilters: {
      size: number;
      page: number;
    };
    token:string;
  };
  
  const configObject: Config = require(process.env.NODE_ENV === "development"
    ? "./development.json"
    : "./production.json");
  
  export default configObject;