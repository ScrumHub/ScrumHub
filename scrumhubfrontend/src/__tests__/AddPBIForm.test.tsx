/**
 * @jest-environment jsdom
 */
import { Form } from "antd";
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from "react";
import { AddPBIForm } from "../components/popups/AddPBIForm";
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
configure({ adapter: new Adapter() });
describe('AddPBIForm component in container', () => {
  let setState: any;
  let useStateMock: any;
  let useStateSpy: any;
  beforeEach(() => {
    setState = jest.fn();
    useStateMock = (initState: any) => [initState, setState];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useStateSpy = jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

it('renders without crashing', async () => {
  const UseFormComponent=()=>{
    const [form] = Form.useForm();
    const [value, setValue] = React.useState(0);
    const el = AddPBIForm(form, value, setValue);
    return (<div>{el}</div>);
  };
  shallow(<UseFormComponent/>);
});
});

