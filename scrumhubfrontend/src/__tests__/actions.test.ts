/**
 * @jest-environment jsdom
 */
import expect from "expect"; // You can use any testing library
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { reducerFunction } from "../appstate/reducer";
import { initTestState, testFetchReposVals, testFilters, testRepositoryList, tstConf } from "../appstate/stateTestValues";
import * as Actions from "../appstate/actions";
import { updateStateRepos } from "../appstate/reducerUtilities";
import MockAdapter from "axios-mock-adapter";
import { filterUrlString } from "../appstate/stateUtitlities";

describe('fetching Repos', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Repositories?${filterUrlString(testFilters)}`).reply(200, testRepositoryList);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchReposThunk(testFetchReposVals));
    const state = store.getState();
    expect(state).toEqual(updateStateRepos(initTestState,testRepositoryList,1,10,1));
  });
});
/*
    // Test that our thunk is calling the API using the arguments we expect
    it('calls the api correctly', async () => {
      await action(dispatch, getState, undefined);
      expect(api.register).toHaveBeenCalledWith(arg);
    });

    // Confirm that a success dispatches an action that we anticipate
    it('triggers auth success', async () => {
      const call = actions.authSuccess(result);
      await action(dispatch, getState, undefined);
      expect(dispatch).toHaveBeenCalledWith(call);
    });
  });


test("getResponseResultsInNetworkError", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`).networkError();
  const response = axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`,
      { headers: getHeader(config.token, config), }
    ).then(()=>{return{ ...errorObject, message: "Network Error" } as unknown as AxiosResponse<any>});
  expect(((await Fetching.getResponse(response)).code).toString().substring(0,1).length).toBe(1);
});

test("getResponseResultsInOtherError", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`).networkError();
  const response = axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`,
      { headers: getHeader(config.token, config), }
    ).then(()=>{return{response: errorObject } as unknown as AxiosResponse<any>});
  expect(((await Fetching.getResponse(response)).code).toString().substring(0,1).length).toBe(1);
});

test("getResponseResultsInSuccess", async () => {
  const mock = new MockAdapter(axios);
  const p = mock.onGet(`${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`).reply(200,testRepositoryList);
  const response = axios.get(
      `${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`,
      { headers: getHeader(config.token, config), }
    );//.then((resp)=>{return({...resp,request:resp.request})});
  expect(await Fetching.getResponse(response)).toEqual({ code: 200, response: testRepositoryList });
});
test("fetchReposIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Repositories?${filterUrlString(testFilters)}`).reply(200, testRepositoryList);
  const response: RequestResponse<IRepositoryList, number> =
    await Fetching.fetchRepos(testFilters, config.token);
  expect(response).toEqual({ code: 200, response: testRepositoryList });
});

test("addRepoIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPost(`${tstConf.url}/Repositories`).reply(200, initRepository);
  const response: RequestResponse<IRepository, number> =
    await Fetching.addRepo(0, config.token);
  expect(response).toEqual({ code: 200, response: initRepository });
});

test("fetchPeopleIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/People/${tstConf.ownerName}`).reply(200, testPBIList);
  const response: RequestResponse<IPeopleList, number> =
    await Fetching.fetchPeople(tstConf.ownerName, config.token);
  expect(response).toEqual({ code: 200, response: testPBIList });
});

test("getCurrentUserIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/People/current`).reply(200, initPerson);
  const response: RequestResponse<IPerson, number> =
    await Fetching.getCurrentUser(config.token);
  expect(response).toEqual({ code: 200, response: initPerson });
});

test("fetchPBItemsIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/BacklogItem/${tstConf.ownerName}?${filterUrlString(testFilters)}`).reply(200, testPBIList);
  const response: RequestResponse<IProductBacklogList, number> =
    await Fetching.fetchPBIs(tstConf.ownerName, config.token,testFilters);
  expect(response).toEqual({ code: 200, response: testPBIList });
});

test("finishPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}/finish`,{}).reply(200, initPBItem);
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.finishPBI(tstConf.ownerName, config.token, tstConf.pbiId);
    expect(response).toEqual({ code: 200, response: initPBItem });
});

test("deletePBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onDelete(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}`).reply(200, "Success");
  const response: RequestResponse<any, any> =
    await Fetching.deletePBI(tstConf.ownerName, config.token, tstConf.pbiId);
  expect(response).toEqual({ code: 200, response: "Success" });
});

test("addPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPost(`${tstConf.url}/BacklogItem/${tstConf.ownerName}`).reply(200, initPBItem);
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.addPBI(tstConf.ownerName, config.token, initPBItem);
  expect(response).toEqual({ code: 200, response: initPBItem });
});

test("estimatePBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}/estimate`,{ "hours": JSON.stringify(tstConf.hours) }).reply(200, initPBItem);
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.estimatePBI(tstConf.ownerName, config.token, tstConf.pbiId, tstConf.hours);
    expect(response).toEqual({ code: 200, response: initPBItem });
});

test("editPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPut(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}`).reply(200, initPBItem);
  const response: RequestResponse<IProductBacklogItem, number> =
    await Fetching.editPBI(tstConf.ownerName, config.token, initPBItem, tstConf.pbiId);
    expect(response).toEqual({ code: 200, response: initPBItem });
});

test("fetchSprintsIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Sprints/${tstConf.ownerName}?${filterUrlString(testFilters)}`).reply(200, testSprintList);
  const response: RequestResponse<ISprintList, number> =
    await Fetching.fetchSprints(config.token,tstConf.ownerName, testFilters);
  expect(response).toEqual({ code: 200, response: testSprintList });
});

test("fetchOneSprintIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Sprints/${tstConf.ownerName}/${tstConf.sprintNr}`).reply(200, initSprint);
  const response: RequestResponse<ISprint, number> =
    await Fetching.fetchOneSprint(config.token,tstConf.ownerName, tstConf.sprintNr);
  expect(response).toEqual({ code: 200, response: initSprint });
});

test("updateOneSprintIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPut(`${tstConf.url}/Sprints/${tstConf.ownerName}/${tstConf.sprintNr}`).reply(200, initSprint);
  const response: RequestResponse<ISprint, number> =
    await Fetching.updateOneSprint(config.token,tstConf.ownerName, tstConf.sprintNr,initSprint);
    expect(response).toEqual({ code: 200, response: initSprint });
});

test("completeOneSprintIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPut(`${tstConf.url}/Sprints/${tstConf.ownerName}/${tstConf.sprintNr}/finish?failed=true`).reply(200, {...initSprint, isCompleted:true, status:"Failed"});
  const response: RequestResponse<ISprint, number> =
    await Fetching.completeOneSprint(config.token,tstConf.ownerName, tstConf.sprintNr,true);
    expect(response).toEqual({ code: 200, response: {...initSprint, isCompleted:true, status:"Failed"} });
});

test("addSprintIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPost(`${tstConf.url}/Sprints/${tstConf.ownerName}`).reply(200, initSprint);
  const response: RequestResponse<ISprint, number> =
    await Fetching.addSprint(config.token,tstConf.ownerName, initSprint);
  expect(response).toEqual({ code: 200, response: initSprint });
});

test("fetchPBITasksIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Tasks/${tstConf.ownerName}/PBI/${tstConf.pbiId}`).reply(200, testTaskList);
  const response: RequestResponse<ITaskList, number> =
    await Fetching.fetchPBITasks(config.token,tstConf.ownerName, tstConf.pbiId);
  expect(response).toEqual({ code: 200, response: testTaskList });
});
test("fetchNullPBITasksIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Tasks/${tstConf.ownerName}/PBI/0`).reply(200, testTaskList);
  const response: RequestResponse<ITaskList, number> =
    await Fetching.fetchPBITasks(config.token,tstConf.ownerName, null);
  expect(response).toEqual({ code: 200, response: testTaskList });
});

test("addUnassignedTasksIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/Tasks/${tstConf.ownerName}/PBI/${tstConf.pbiId}`).reply(200, testTaskList);
  const response: RequestResponse<ITaskList, number> =
    await Fetching.addUnassignedTasksToPBI(config.token,tstConf.ownerName, tstConf.pbiId);
  expect(response).toEqual({ code: 200, response: testTaskList });
});

test("addTaskIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPost(`${tstConf.url}/Tasks/${tstConf.ownerName}`,{name:tstConf.name,pbiId:tstConf.pbiId.toString()}).reply(200, testTaskList);
  const response: RequestResponse<ITask, number> =
    await Fetching.addTask(config.token,tstConf.ownerName, tstConf.pbiId, tstConf.name);
  expect(response).toEqual({ code: 200, response: testTaskList });
});

test("getPBINamesIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onGet(`${tstConf.url}/BacklogItem/${tstConf.ownerName}?${filterUrlString(testFilters)}`).reply(200, testPBIList);
  const response: RequestResponse<IProductBacklogList, number> =
    await Fetching.getPBINames(tstConf.ownerName, config.token,testFilters);
  expect(response).toEqual({ code: 200, response: testPBIList });
});


test("assignTaskToPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/assignpbi`,{ "index":tstConf.pbiId}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.assignTaskToPBI(config.token,tstConf.ownerName, tstConf.pbiId, tstConf.taskId);
  expect(response).toEqual({ code: 200, response: initTask });
});

test("assignTaskToNulltemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/assignpbi`,{ "index":0}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.assignTaskToPBI(config.token,tstConf.ownerName, null, tstConf.taskId);
  expect(response).toEqual({ code: 200, response: initTask });
});

test("assignPersonInTaskIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/${tstConf.isAssign ? "" : "un"}assignperson`,{ "login":tstConf.login}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.updatePersonInTask(config.token,tstConf.ownerName, tstConf.login, tstConf.taskId, tstConf.isAssign);
  expect(response).toEqual({ code: 200, response: initTask });
});

test("unassignPersonInTaskIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/${!tstConf.isAssign ? "" : "un"}assignperson`,{ "login":tstConf.login}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.updatePersonInTask(config.token,tstConf.ownerName, tstConf.login, tstConf.taskId, !tstConf.isAssign);
  expect(response).toEqual({ code: 200, response: initTask });
});

test("startHotfixBranchForTaskIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/start?hotFix=${tstConf.hotfix}`,{}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.startBranchForTask(config.token,tstConf.ownerName, tstConf.hotfix,tstConf.taskId, );
  expect(response).toEqual({ code: 200, response: initTask });
});

test("startFeatureBranchForTaskIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/Tasks/${tstConf.ownerName}/${tstConf.taskId}/start?hotFix=${!tstConf.hotfix}`,{}).reply(200, initTask);
  const response: RequestResponse<ITask, number> =
    await Fetching.startBranchForTask(config.token,tstConf.ownerName, !tstConf.hotfix,tstConf.taskId, );
  expect(response).toEqual({ code: 200, response: initTask });
});*/