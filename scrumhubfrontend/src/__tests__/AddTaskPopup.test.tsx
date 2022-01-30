import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import { render } from "@testing-library/react";
import { AddTaskPopup } from "../components/popups/AddTaskPopup";
import { IFilters } from "../appstate/stateInterfaces";

describe('AddTaskPopup component in container', () => {
  let tempContainer: any;
  beforeEach(() => {
    tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
  afterEach(() => {
    // cleanup on exiting
    if (!isNull(tempContainer)) {
      unmountComponentAtNode(tempContainer);
      tempContainer.remove();
      tempContainer = null;
    }
  });
  it('is the same as snapshot', () => {
    const subject = mount(<AddTaskPopup visible={true}
    onCreate={function (values: any): void { } }
    onCancel={() => { } } data={{ name: "" } as IFilters} />);
    expect(EnzymeToJson(subject)).toMatchSnapshot();
  });
  it('renders without crashing', async () => {
    const initValue = { name:"" };
    const onClickValue = { name:"task2" };
    const onCreate = jest.fn().mockReturnValue(initValue).mockReturnValueOnce(initValue).mockReturnValueOnce(onClickValue);
    await render(<AddTaskPopup visible={true}
      onCreate={function (values: any): void { onCreate()} }
      onCancel={() => { } } data={initValue} />);

  });
  it('changes on clicking save', async () => {
    const initValue = { name:"" };
    const onClickValue = { name:"task2" };
    const onCreate = jest.fn().mockReturnValue(initValue).mockReturnValueOnce(initValue).mockReturnValueOnce(onClickValue).mockReturnValueOnce(initValue);
    const subject = mount(<AddTaskPopup visible={true}
      onCreate={function (values: any): void { onCreate()} }
      onCancel={() => { } } data={initValue} />,
       { attachTo: document.getElementById('div') });
      expect(onCreate()).toBe(initValue); 
      await act(async ()=>{
      subject.find("#SaveInAddTaskPopup").at(1).simulate('click');})
    expect(onCreate()).toStrictEqual(onClickValue);
    await act(async ()=>{
      subject.find("#InputInAddTaskPopup").at(1).simulate('keypress', {key: 'Enter'});})
      expect(onCreate()).toStrictEqual(initValue);
      await act(async ()=>{
        subject.find("#InputInAddTaskPopup").at(1).simulate('keypress', {key: 'Space'});})
        expect(onCreate()).toStrictEqual(initValue);

  });
});