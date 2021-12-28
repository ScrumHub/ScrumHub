import { IFilters } from "./stateInterfaces";

export const getHeader = (token: string, config:any) => {
    return ({
        'authToken': token,
        'Accept': "application/json",
        'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
      });
  }

  export const getHeaderWithContent = (token: string, config:any) => {
    return ({
        'authToken': token,
        'Accept': "application/json",
        'contentType': "application/json",
        'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
      } as IFilters);
  }

  export const getHeaderAcceptAll = (token: string, config:any) => {
    return ({
        'authToken': token,
        'Accept': "*/*",
        'Access-Control-Allow-Origin': `https://${config.backend.ip}:${config.backend.port}`,
      } as IFilters);
  }

