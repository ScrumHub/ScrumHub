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
<<<<<<< HEAD
      sprintSize:number;
=======
>>>>>>> 1fed599254bdb219c15c836716e38e42b8843ad9
    };
    token:string;
  };
  
  const configObject: Config = require(process.env.NODE_ENV === "development"
    ? "./development.json"
    : "./production.json");
  
  export default configObject;