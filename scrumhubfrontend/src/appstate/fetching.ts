import type { APIResponse, RequestResponse } from "./response";
import config from "../configuration/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";
import { IFilters, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList } from "./stateInterfaces";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getResponse<T, K>(
  axiosRequest: Promise<AxiosResponse<any>>
): Promise<RequestResponse<T, K>> {
  try {
    const response = await axiosRequest;
    return {
      code: response.status,
      response: response.data as APIResponse<T, K>,
    };
  } catch (error: any) {
    if (error instanceof TypeError || error.message === "Network Error") {
      return {
        code: 0,
        response: {
          message: "Connection error",
          successful: false,
          data: null,
          metadata: null,
        },
      };
    }

    let response_1 = error.response;
    return {
      code: response_1.status,
      response: response_1.data as APIResponse<T, K>,
    };
  }
}

export function fetchRepositories(filters: IFilters, token: string
): Promise<RequestResponse<IRepositoryList, number>> {
  const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" ? `${filterName}=${value}` : "";
          //}
        })
        .filter((x) => x !== "")
        .join("&");
  return getResponse(
    axios.get(
      `https://${config.backend.ip}:${config.backend.port}/api/Repositories?${filtersString}`,
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'Access-Control-Allow-Origin':`https://${config.backend.ip}:${config.backend.port}`,
        },
      }
    )
  );
}

export function addRepository(id: number, token: string,
): Promise<RequestResponse<IRepository, number>> {
  return getResponse(
    axios.post(
      `https://${config.backend.ip}:${config.backend.port}/api/Repositories`,
      {"index":JSON.stringify(id)},
      {
        headers: {
          'authToken': token,
          'Accept': "application/json",
          'contentType':"application/json",
          'Access-Control-Allow-Origin':"*",
        },
      }
    )
  );
}

export function fetchPBIs(ownerName: any, token: string, filters:IFilters
  ): Promise<RequestResponse<IProductBacklogList, number>> {
    const filtersString =
    filters === undefined
      ? ""
      : Object.keys(filters)
        .map((filterName) => {
          const value = String(filters[filterName]).trim();
          return value && value !== "null" ? `${filterName}=${value}` : "";
          //}
        })
        .filter((x) => x !== "")
        .join("&");
        console.log(filtersString);
    return getResponse(
      axios.get(
        `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}?${filtersString}`,
        {
          headers: {
            'authToken': token,
            'Accept': "application/json",
            'Access-Control-Allow-Origin':`https://${config.backend.ip}:${config.backend.port}`,
          },
        }
      )
    );
  }

  export function finishPBI(ownerName: any, token: string, pbild:number
    ): Promise<RequestResponse<IProductBacklogItem, number>> {
      return getResponse(
        axios.patch(
          `https://${config.backend.ip}:${config.backend.port}/api/BacklogItem/${ownerName}/${pbild}/finish`,
          {},
          {
            headers: {
              'authToken': token,
              'Accept': "application/json",
              'Access-Control-Allow-Origin':`https://${config.backend.ip}:${config.backend.port}`,
            },
          }
        )
      );
    }


