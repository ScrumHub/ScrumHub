/**
 * @jest-environment jsdom
 */

import TestRenderer from "react-test-renderer";
import { AddPBIPopup } from "../components/popups/AddPBIPopup";
import { Form } from "antd";
import { configure, shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { store } from "../appstate/store";
import { Provider } from "react-redux";
import {act, render} from "@testing-library/react";
import React from "react";
import { AddPBIForm } from "../components/popups/AddPBIForm";
const { act: actTest } = TestRenderer;
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
configure({ adapter: new Adapter() });
describe('AddPBIForm component in container', () => {
  let wrapper;
  let setState: any;
  let useStateMock: any;
  let useStateSpy: any;
  beforeEach(() => {
    setState = jest.fn();
    useStateMock = (initState: any) => [initState, setState];
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
/*it("renders", ()=>{
  const { asFragment } = render(<AddPBIPopup visible={true}
          onCreate={function (values: any): void { }}
          onCancel={() => { }} />);
  expect(asFragment()).toMatchSnapshot();
})*/

it('renders without crashing', async () => {
  const div = document.createElement('div');
  const UseFormComponent=()=>{
    const [form] = Form.useForm();
    const [value, setValue] = React.useState(0);
    const el = AddPBIForm(form, value, setValue);
    //console.log(el);
    return (<div>{el}</div>);
  };
  //const wrapper = shallow(<UseFormComponent/>);
  //console.log(wrapper);
  const wrapper2 = shallow(<UseFormComponent/>);
  //console.log(wrapper2);
  //wrapper.find('button').simulate('click');
  //expect(wrapper).toMatchSnapshot();
});
});

/*
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));*/

/*

describe('Project component in container', () => {
  let container: any;
  let store: any;
  beforeEach(() => {
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
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    if (!isNull(container)) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("Rendered list of repos", async () => {
    await act(async () => {
      render(
        <AddPBIPopup visible={true}
          onCreate={function (values: any): void { }}
          onCancel={() => { }} />,
        container
      );
    });
    expect(
      container?.getElementsByClassName("container").length
    ).toBeGreaterThanOrEqual(0);
    expect(container.textContent).toBe("");
  });

  it('project component rendered is the same as snapshot', () => {
    const temp = renderer.create(
      <AddPBIPopup visible={true}
        onCreate={function (values: any): void { }}
        onCancel={() => { }} />).toJSON();
    expect(temp).toMatchSnapshot();
  });

});*/
