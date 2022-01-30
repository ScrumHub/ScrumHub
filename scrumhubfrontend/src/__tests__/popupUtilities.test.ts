/**
 * @jest-environment jsdom
 */
import { Form, FormInstance } from "antd";
import { useState } from "react";
import { act } from "react-dom/test-utils";
import { initAddPBI } from "../appstate/stateInitValues";
import { IAddBI } from "../appstate/stateInterfaces";
import { onOkAddPBIPopup } from "../components/popups/popupUtilities"
//const onOkAddPBIPopup = require("../components/popups/popupUtilities");
describe("add pbi popup",()=>{
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



/*
const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);
  */