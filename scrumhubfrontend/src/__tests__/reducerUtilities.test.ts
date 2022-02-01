 /**
 * @jest-environment jsdom
 */

import { addStatePBI, addStateRepo, addStateSprint, addStateTask, addStateUnassignedTaskToPBI, filterPBIsList, filterPbiTasksById, filterTasksById, getError, updateAllTasksSWR, updateOnDragStateTasks, updateStateKeys, updateStateOneSprint, updateStatePBI, updateStateRepos, updateStateTasks, validateUri } from "../appstate/reducerUtilities";
import { initBI, initRepository, initRepositoryList, initSprint, initState, initTask, initTaskList } from "../appstate/stateInitValues";
import { initTestState } from "../appstate/stateTestValues";

 
 test('can get an error', () => {
     expect(getError({response:{Message:"error"}, code:404})).toStrictEqual({
      hasError: true,
      errorCode: 404,
      erorMessage: "error",
  });
 })

 test('can check that string is undefined and return empty', () => {
  expect(validateUri(undefined)).toBe("");
})
test('can filter tasks by id and remove duplicates', () => {
  expect(filterTasksById([initTask, initTask])).toStrictEqual([initTask]);
})

test('can filter tasks by id and remove duplicates in pbi', () => {
  expect(filterPbiTasksById({...initBI, tasks:[initTask, initTask]})).toStrictEqual({...initBI, tasks:[initTask]});
})

test('can filter keys', () => {
  expect(updateStateKeys([1], [2,1])).toStrictEqual([2]);
})

test('update tasks in store succesful', () => {
  expect(updateStateTasks(initTestState, initTask)).not.toStrictEqual(initState);
})

test('update tasks in pbi succesful', () => {
  expect(filterPBIsList([{...initBI, tasks:[initTask]}], {...initTask,name:"name"})).not.toStrictEqual([{...initBI, tasks:[initTask]}]);
})

test('update tasks on drag succesful', () => {
  expect(updateOnDragStateTasks(initTestState, initTask)).not.toStrictEqual(initState);
})

test('adding tasks on drag succesful', () => {
  expect(addStateTask(initTestState, initTask)).toStrictEqual(initTestState);
})

test('adding unassigned tasks on drag succesful', () => {
  expect(addStateUnassignedTaskToPBI(initTestState, initTaskList)).toBe(initTestState);
})

test('update tasks after polling succesful', () => {
  expect(updateAllTasksSWR({...initTestState, tasks:[initTask]}, [{...initTask, name:"new"}])).not.toStrictEqual(initState);
})

test('update pbi state succesful', () => {
  expect(updateAllTasksSWR({...initTestState, tasks:[initTask]}, [{...initTask, name:"new"}])).not.toStrictEqual(initState);
})

test('adding pbi to state succesful', () => {
  expect(updateStatePBI(initTestState, {...initBI, name:"name"})).not.toStrictEqual(initState);
})

test('updating repository in state  is succesful', () => {
  expect(updateStateRepos(initTestState, {...initRepositoryList, list:[initRepository]},1,10,1)).not.toStrictEqual(initState);
})

test('updaing state of one sprint is succesful', () => {
  expect(updateStateOneSprint(initTestState, {...initSprint, title:"title"})).not.toStrictEqual(initState);
})

test('adding repository to state succesful', () => {
  expect(addStateRepo(initTestState, initRepository)).not.toStrictEqual(initState);
})

test('adding pbis to state succesful', () => {
  expect(addStatePBI(initTestState, {...initBI, name:"name"})).toBe(initTestState);
})

test('adding sprints to state succesful', () => {
  expect(addStateSprint(initTestState, {...initSprint, title:"title"})).not.toStrictEqual(initState);
})
























 
