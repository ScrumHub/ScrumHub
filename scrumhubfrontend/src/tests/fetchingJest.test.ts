/**
 * @jest-environment jsdom
 */
import expect from "expect"; // You can use any testing library
import { IPerson, IProductBacklogItem, IProductBacklogList, IRepository, IRepositoryList, ISprint, ISprintList } from "../appstate/stateInterfaces";
import config from "../configuration/config";
import * as Fetching from "../appstate/fetching";
import { RequestResponse } from "../appstate/response";
import { errorObject, initAddPBI, initSprint } from "../appstate/initStateValues";
import { testConnectionError } from "../appstate/stateTestValues";
const axios = require('axios');

/* At the same scope with `require`*/
jest.mock('axios');
test('responseIsEqualToFullfiled', async () => {
  const response = await Fetching.getResponse(axios.get(`https://api.github.com/rate_limit`, 
  { headers: { "Accept": "application/vnd.github.v3+json"}}));
  expect(response).toEqual(testConnectionError);
})

test("adding the repository with a wrong token results in an error", async () => {
  const data: RequestResponse<IRepository, undefined> =
    await Fetching.addRepo(0, config.token);
  expect(data).toEqual(errorObject);
});

test("fetching the repositories with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.fetchRepos({pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},
         config.token);
    expect(data).toEqual(errorObject);
  });

  test("fetching the pbis with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogList, undefined> =
      await Fetching.fetchPBIs("", config.token,{pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},);
    expect(data).toEqual(errorObject);
  });

  test("add the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.addPBI("", config.token,initAddPBI,);
    expect(data).toEqual(errorObject);
  });

  test("finish the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.finishPBI("", config.token,0,);
    expect(data).toEqual(errorObject);
  });

  test("estimate the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.estimatePBI("", config.token,0,0);
    expect(data).toEqual(errorObject);
  });

  
  test("delete the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<number, undefined> =
      await Fetching.deletePBI("", config.token,0);
    expect(data).toEqual(errorObject);
  });

  test("fetch the sprints with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprintList, undefined> =
      await Fetching.fetchSprints("", config.token,{});
    expect(data).toEqual(errorObject);
  });

  test("fetch one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.fetchOneSprint("", config.token,0);
    expect(data).toEqual(errorObject);
  });

  test("fetch sprints with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprintList, undefined> =
      await Fetching.fetchSprints("", config.token,{});
    expect(data).toEqual(errorObject);
  });

  test("fetching current user with a wrong token results in an error", async () => {
    const data: RequestResponse<IPerson, undefined> =
      await Fetching.getCurrentUser(config.token);
    expect(data).toEqual(errorObject);
  });

  test("updating one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.updateOneSprint(config.token, "", 0,initSprint);
    expect(data).toEqual(errorObject);
  });

  test("completing one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.completeOneSprint(config.token, "", 0,true);
    expect(data).toEqual(errorObject);
  });

  /*
      //  expect.assertions(1);
      const repo = initRepository;
      //axios.get.mockResolvedValueOnce(repo);
      axios.post = jest.fn().mockResolvedValue(repo);
      // when
      
    expect(data).toEqual(errorObject);

      // then
      //expect(axios.get).toHaveBeenCalledWith(`/repo`);
      await expect(data).resolves.toBe("");
 // });
//});

  describe("fetchRepos", () => {
  describe("when API call is successful", () => {
    it("should return repos list", async () => {
      // given
      const repos = [
        { id: 1, name: "John" },
        { id: 2, name: "Andrew" },
      ];
      axios.get.mockResolvedValueOnce(users);

      // when
      const result = await fetchUsers();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/users`);
      expect(result).toEqual(users);
    });
  });

test("adding the repository with a wrong token results in an error", async () => {
  const data: RequestResponse<IRepository, undefined> =
    await Fetching.addRepository(0, config.token);
  expect(data).toEqual(errorObject);
});

test("fetching the repositories with a wrong token results in an error", async () => {
    const data: RequestResponse<IRepositoryList, undefined> =
      await Fetching.fetchRepos({pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},
         config.token);
    expect(data).toEqual(errorObject);
  });

  test("fetching the pbis with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogList, undefined> =
      await Fetching.fetchPBIs("", config.token,{pageSize:config.defaultFilters.page, pageNumber:config.defaultFilters.size},);
    expect(data).toEqual(errorObject);
  });

  test("add the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.addPBI("", config.token,initAddPBI,);
    expect(data).toEqual(errorObject);
  });

  test("finish the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.finishPBI("", config.token,0,);
    expect(data).toEqual(errorObject);
  });

  test("estimate the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<IProductBacklogItem, undefined> =
      await Fetching.estimatePBI("", config.token,0,0);
    expect(data).toEqual(errorObject);
  });

  
  test("delete the pbi with a wrong token results in an error", async () => {
    const data: RequestResponse<number, undefined> =
      await Fetching.deletePBI("", config.token,0);
    expect(data).toEqual(errorObject);
  });

  test("fetch the sprints with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprintList, undefined> =
      await Fetching.fetchSprints("", config.token,{});
    expect(data).toEqual(errorObject);
  });

  test("fetch one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.fetchOneSprint("", config.token,0);
    expect(data).toEqual(errorObject);
  });

  test("fetch sprints with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprintList, undefined> =
      await Fetching.fetchSprints("", config.token,{});
    expect(data).toEqual(errorObject);
  });

  test("fetching current user with a wrong token results in an error", async () => {
    const data: RequestResponse<IPerson, undefined> =
      await Fetching.getCurrentUser(config.token);
    expect(data).toEqual(errorObject);
  });

  test("updating one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.updateOneSprint(config.token, "", 0,initSprint);
    expect(data).toEqual(errorObject);
  });

  test("completing one sprint with a wrong token results in an error", async () => {
    const data: RequestResponse<ISprint, undefined> =
      await Fetching.completeOneSprint(config.token, "", 0,true);
    expect(data).toEqual(errorObject);
  });*/