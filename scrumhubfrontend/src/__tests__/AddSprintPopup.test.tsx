import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import TestRenderer from "react-test-renderer";
import { mount } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import { render } from "@testing-library/react";
import { initAddPBI, initBI, initSprint } from "../appstate/stateInitValues";
import { AddSprintPopup } from "../components/popups/AddSprintPopup";
const { act: actTester } = TestRenderer;

describe('AddSprintPopup component in container', () => {
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
    const subject = mount(<AddSprintPopup visible={true}
    onCreate={function (values: any): void { } }
    onCancel={() => { } } data={initSprint} error={""} pbiData={[initBI]} />);
    expect(EnzymeToJson(subject)).toMatchSnapshot();
  });
  it('renders without crashing', async () => {
    const onClickValue = { ...initAddPBI, priority: 1 };
    const onCreate = jest.fn().mockReturnValue(initAddPBI).mockReturnValueOnce(initAddPBI).mockReturnValueOnce(onClickValue);
    await render(<AddSprintPopup visible={true}
      onCreate={function (values: any): void { onCreate()} }
      onCancel={() => { } } data={initSprint} error={""} pbiData={[initBI]} />);

  });
  it('changes on clicking save', async () => {
    const onClickValue = { ...initSprint, title: "Title" };
    const onCreate = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(initSprint).mockReturnValueOnce(onClickValue);
    const subject = mount(<AddSprintPopup visible={true}
      onCreate={function (values: any): void { onCreate()} }
      onCancel={() => { } } data={initSprint} error={""} pbiData={[initBI]} />, { attachTo: document.getElementById('div') });
      expect(onCreate()).toBe(initSprint);
      await act(async ()=>{
      subject.find("#SaveInAddSprintPopup").at(1).simulate('click');})
    expect(onCreate()).toStrictEqual(onClickValue);

  });
});