import { IFilters } from "./stateInterfaces";

/**
 * @returns Request header
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
 export const getHeader = (token: string, config: any) => {
  return ({
    'Accept': "application/json",
    'authToken': token,
    'Access-Control-Allow-Origin': `*`,
  });
};

/**
 * @returns Request header with "application/json" content type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderWithContent = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "application/json",
    'contentType': "application/json",
    'Access-Control-Allow-Origin': `*`,
  } as IFilters);
};

/**
 * @returns Request header that accepts all responses type
 * @param {String} token User validation
 * @param {Object} config Configuration of port and id, can be in Production or Development
 */
export const getHeaderAcceptAll = (token: string, config: any) => {
  return ({
    'authToken': token,
    'Accept': "*/*",
    'Access-Control-Allow-Origin': `*`,
  } as IFilters);
};

/**
 * @param {IFilters} filters Filters to validate and concatenate into string
 * @returns {String} Filters' names and values combined into one string 
 */
 export function filterUrlString(filters: IFilters) {
  return (typeof (filters) === "undefined" ? ""
    : Object.keys(filters)
      .map((filterName: string) => {
        const value = String(filters[filterName]).trim();
        return value && value !== "null" && value !== "undefined" ? `${filterName}=${value}` : "";
      })
      .filter((x) => x !== "")
      .join("&"));
};


