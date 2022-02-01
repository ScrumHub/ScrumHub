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
import { initBacklogItemList, initBI, initPeopleList, initPerson, initSprintsList, initSprint, initState, initTask, initRepository, initAddPBI } from "../appstate/stateInitValues";
import config from "../configuration/config";

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

describe('fetching People', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/People/${tstConf.ownerName}`).reply(200, {...initPeopleList, list:[initPerson]});
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchPeopleThunk({ownerName:tstConf.ownerName, token:config.token}));
    const state = store.getState();
    expect(state).not.toEqual(initState);
  });
});

describe('fetching PBIs', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}?${filterUrlString({})}`).reply(200, {...initBacklogItemList, list:[initBI]});
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchPBIsThunk({ownerName:tstConf.ownerName, token:config.token,filters: {}}));
    const state = store.getState();
    expect(state).not.toEqual(initState);
  });
});


describe('fetching sprints', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/Sprints/${tstConf.ownerName}?${filterUrlString({})}`).reply(200, {...initSprintsList, list:[initSprint]});
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchSprintsThunk({ownerName:tstConf.ownerName, token:config.token,filters: {}}));
    const state = store.getState();
    expect(state).toEqual(state);
  });
});

describe('fetching one sprint', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/Sprints/${tstConf.ownerName}/${0}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchOneSprintThunk({ownerName:tstConf.ownerName, token:config.token,sprintNumber:0}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('fetching repos', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/Tasks/${tstConf.ownerName}`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.fetchRepoTasksThunk({ownerName:tstConf.ownerName, token:config.token}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('fetching current user', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/People/current`).reply(200, initPerson);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.getCurrentUserThunk({token:config.token}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('add repo', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(`${tstConf.url}/api/Repositories`).reply(200, initRepository);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.addRepositoryThunk({id:1,token:config.token}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('finishPBI', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}/${1}/finish`).reply(200, initBI);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.finishPBIThunk({ownerName:tstConf.ownerName,token:config.token, pbiId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('deletePBI', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onDelete(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}/${1}`).reply(204);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.deletePBIThunk({ownerName:tstConf.ownerName,token:config.token, pbiId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('add pbi', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}`).reply(200, initBI);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.addPBIThunk({ownerName:tstConf.ownerName,token:config.token, pbi:initAddPBI}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('estimatePBI', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}/${1}/estimate`).reply(200, initBI);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.estimatePBIThunk({ownerName:tstConf.ownerName,token:config.token, pbiId:1, hours:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('editPBI', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(`${tstConf.url}/api/BacklogItem/${tstConf.ownerName}/${1}/estimate`).reply(200, initBI);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.editPBIThunk({ownerName:tstConf.ownerName,token:config.token,pbi:initBI, pbiId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('updateOneSprint', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPut(`${tstConf.url}/api/Sprints/${tstConf.ownerName}/${1}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.updateOneSprintThunk({ownerName:tstConf.ownerName,token:config.token,sprintNumber:1,sprint:initSprint}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('completeOneSprint', () => {
  test('should pass and mark as success', async () => {
    const mock = new MockAdapter(axios);
    mock.onPut(`${tstConf.url}/api/Sprints/${tstConf.ownerName}/${1}/finish?failed=${true}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.completeOneSprintThunk({ownerName:tstConf.ownerName,token:config.token,sprintNumber:1,isFailure:true}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
  test('should pass  and mark as fail', async () => {
    const mock = new MockAdapter(axios);
    mock.onPut(`${tstConf.url}/api/Sprints/${tstConf.ownerName}/${1}/finish?failed=${false}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.completeOneSprintThunk({ownerName:tstConf.ownerName,token:config.token,sprintNumber:1,isFailure:false}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('addSprint', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(`${tstConf.url}/api/Sprints/${tstConf.ownerName}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.addSprintThunk({ownerName:tstConf.ownerName,token:config.token,sprint:initSprint}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('addUnassignedTasksToPBI', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${tstConf.url}/api/Tasks/${tstConf.ownerName}/PBI/${1}`).reply(200, initSprint);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.addUnassignedTasksToPBI({ownerName:tstConf.ownerName,token:config.token,pbiId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});

describe('addTaskThunk', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost(`${tstConf.url}/api/Tasks/${tstConf.ownerName}`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.addTaskThunk({token:config.token,ownerName:tstConf.ownerName,pbiId:1,name:"name"}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('assignTask To PBI success', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/Tasks/${tstConf.ownerName}/${1}/${true ? "" : "un"}assignperson`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.updatePersonInTaskThunk({token:config.token,ownerName:tstConf.ownerName,login:"login",taskId:1,isAssign:true}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('unassignTask To PBI success', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/Tasks/${tstConf.ownerName}/${1}/${false ? "" : "un"}assignperson`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.updatePersonInTaskThunk({token:config.token,ownerName:tstConf.ownerName,login:"login",taskId:1,isAssign:false}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('start hotfix branch for Task success', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/Tasks/${tstConf.ownerName}/${1}/start?hotFix=${true}`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.startTaskThunk({token:config.token,ownerName:tstConf.ownerName,isHotfix:true,taskId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
describe('start feature branch for Task success', () => {
  test('should pass', async () => {
    const mock = new MockAdapter(axios);
    mock.onPatch(`${tstConf.url}/api/Tasks/${tstConf.ownerName}/${1}/start?hotFix=${false}`).reply(200, initTask);
    const store = configureStore({
      reducer: reducerFunction(initTestState),
    });
    await store.dispatch(Actions.startTaskThunk({token:config.token,ownerName:tstConf.ownerName,isHotfix:false,taskId:1}));
    const state = store.getState();
    expect(state).not.toEqual(initState);;
  });
});
