/**
 * @jest-environment jsdom
 */
import expect from "expect"; // You can use any testing library
import { IPeopleList, IPerson, IBacklogItem, IBacklogItemList, IRepository, IRepositoryList, ISprint, ISprintList, ITask, ITaskList } from "../appstate/stateInterfaces";
import config from "../configuration/config";
import * as Fetching from "../appstate/fetching";
import { RequestResponse } from "../appstate/response";
import { initPerson, initBI, initRepository, initSprint, initTask, initPBIFilter, errorObject } from "../appstate/stateInitValues";
import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { tstConf, testFilters, testBItemList, testRepositoryList, testSprintList, testTaskList } from "../appstate/stateTestValues";
import { filterUrlString, getHeader } from "../appstate/stateUtitlities";

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
  mock.onGet(`${config.backend.ip}:${config.backend.port}/api/Repositories?${filterUrlString(initPBIFilter)}`).reply(200,testRepositoryList);
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
  mock.onGet(`${tstConf.url}/People/${tstConf.ownerName}`).reply(200, testBItemList);
  const response: RequestResponse<IPeopleList, number> =
    await Fetching.fetchPeople(tstConf.ownerName, config.token);
  expect(response).toEqual({ code: 200, response: testBItemList });
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
  mock.onGet(`${tstConf.url}/BacklogItem/${tstConf.ownerName}?${filterUrlString(testFilters)}`).reply(200, testBItemList);
  const response: RequestResponse<IBacklogItemList, number> =
    await Fetching.fetchPBIs(tstConf.ownerName, config.token,testFilters);
  expect(response).toEqual({ code: 200, response: testBItemList });
});

test("finishPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}/finish`,{}).reply(200, initBI);
  const response: RequestResponse<IBacklogItem, number> =
    await Fetching.finishPBI(tstConf.ownerName, config.token, tstConf.pbiId);
    expect(response).toEqual({ code: 200, response: initBI });
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
  mock.onPost(`${tstConf.url}/BacklogItem/${tstConf.ownerName}`).reply(200, initBI);
  const response: RequestResponse<IBacklogItem, number> =
    await Fetching.addPBI(tstConf.ownerName, config.token, initBI);
  expect(response).toEqual({ code: 200, response: initBI });
});

test("estimatePBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPatch(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}/estimate`,{ "hours": JSON.stringify(tstConf.hours) }).reply(200, initBI);
  const response: RequestResponse<IBacklogItem, number> =
    await Fetching.estimatePBI(tstConf.ownerName, config.token, tstConf.pbiId, tstConf.hours);
    expect(response).toEqual({ code: 200, response: initBI });
});

test("editPBItemIsSuccessful", async () => {
  const mock = new MockAdapter(axios);
  mock.onPut(`${tstConf.url}/BacklogItem/${tstConf.ownerName}/${tstConf.pbiId}`).reply(200, initBI);
  const response: RequestResponse<IBacklogItem, number> =
    await Fetching.editPBI(tstConf.ownerName, config.token, initBI, tstConf.pbiId);
    expect(response).toEqual({ code: 200, response: initBI });
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
});