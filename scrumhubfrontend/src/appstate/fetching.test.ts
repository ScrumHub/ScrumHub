import expect from "expect"; // You can use any testing library
import { initAddPBI, IRepository, IRepositoryList } from "./stateInterfaces";
import config from "../configuration/config";
import * as Fetching from "./fetching";
import { RequestResponse } from "./response";

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

  test("fetching the pbis with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.fetchPBIs("", config.token,{pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},);
    expect(data).toEqual(errorObject);
  });

  test("add the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.addPBI("", config.token,initAddPBI,);
    expect(data).toEqual(errorObject);
  });

  test("finish the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.finishPBI("", config.token,0,);
    expect(data).toEqual(errorObject);
  });