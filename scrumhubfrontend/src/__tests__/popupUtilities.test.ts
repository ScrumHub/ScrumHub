/**
 * @jest-environment jsdom
 */
import { FormInstance } from "antd";
import { initAddPBI, initBI, initSprint } from "../appstate/stateInitValues";
import { IAddBI } from "../appstate/stateInterfaces";
import { onOkAddPBIPopup, onOkAddSprintPopup, onOkAddTaskPopup, onOkEditPBIPopup, onOkEstimatePBIPopup } from "../components/popups/popupUtilities"

describe("add pbi popup", () => {
  test('validates values properly', () => {
    let initValues = {} as IAddBI;
    const onCreate = jest.fn().mockReturnValue(initValues).mockReturnValueOnce(initAddPBI);
    let form = {
      validateFields: jest.fn(() => Promise.resolve({ data: initAddPBI })),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddPBIPopup(form, onCreate);
    expect(onCreate()).toBe(initAddPBI);
  })
  test('catches error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    let initValues = {} as IAddBI;
    const onCreate = jest.fn().mockReturnValue(initValues).mockReturnValueOnce(initAddPBI);
    let form = {
      validateFields: jest.fn(() => Promise.reject("Error!")),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddPBIPopup(form, onCreate);
    expect(onCreate()).toBe(initAddPBI);
  })
})

describe("estimate pbi popup", () => {
  test('validates values properly', () => {
    let onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.resolve({ data: initBI })),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkEstimatePBIPopup(form, onCreate, 1);
    expect(onCreate()).toBe(onClickValue);
  })
  test('catches error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    let onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.reject("Error!")),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkEstimatePBIPopup(form, onCreate, 1);
    expect(onCreate()).toBe(onClickValue);
  })
})

describe("add sprint popup", () => {
  test('validates values properly', () => {
    let onClickValue = { ...initSprint, title: "Title" };
    const onCreate = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.resolve({ data: initSprint })),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddSprintPopup(form, onCreate, [initBI]);
    expect(onCreate()).toBe(onClickValue);
  })
  test('catches error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    let onClickValue = { ...initSprint, title: "Title" };
    const onCreate = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.reject("Error!")),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddSprintPopup(form, onCreate, [initBI]);
    expect(onCreate()).toBe(onClickValue);
  })
})

describe("add task popup", () => {
  test('validates values properly', () => {
    const onCreate = jest.fn().mockReturnValue("task").mockReturnValueOnce("task");
    let form = {
      validateFields: jest.fn(() => Promise.resolve({ data: "task" })),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddTaskPopup(form, onCreate);
    expect(onCreate()).toBe("task");
  })
  test('catches error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const onCreate = jest.fn().mockReturnValue("task").mockReturnValueOnce("task");
    let form = {
      validateFields: jest.fn(() => Promise.reject("Error!")),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkAddTaskPopup(form, onCreate);
    expect(onCreate()).toBe("task");
  })
})
describe("edit pbi popup", () => {
  test('validates values properly', () => {
    let onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.resolve({ data: initBI })),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkEditPBIPopup(form, onCreate);
    expect(onCreate()).toBe(onClickValue);
  })
  test('catches error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    let onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(onClickValue);
    let form = {
      validateFields: jest.fn(() => Promise.reject("Error!")),
      resetFields: jest.fn()
    } as unknown as FormInstance<any>;
    onOkEditPBIPopup(form, onCreate);
    expect(onCreate()).toBe(onClickValue);
  })
})

