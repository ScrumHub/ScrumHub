//import thunk from "redux-thunk";
import expect from "expect"; // You can use any testing library
import { IRepository, IRepositoryList } from "./stateInterfaces";
import config from "../configuration/config";
import * as Fetching from "./fetching";
import { RequestResponse } from "./response";
//const middlewares = [thunk];

jest.mock("axios");

const errorObject = {
  code: 0,
  response: {
    data: null,
    message: "Connection error",
    successful: false,
    metadata: null,
  },
};

test("adding the repository with a wrong token results in an error", async () => {
  const data: RequestResponse<IRepository, undefined> =
    await Fetching.addRepository(0, config.token);
  expect(data).toEqual(errorObject);
});

test("fetching the repositories with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.fetchRepositories({pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},
         config.token);
    expect(data).toEqual(errorObject);
  });