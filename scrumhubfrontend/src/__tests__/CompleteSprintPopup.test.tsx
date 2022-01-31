import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import { render } from "@testing-library/react";
import { initAddPBI, initBI, initSprint } from "../appstate/stateInitValues";
import { AddSprintPopup } from "../components/popups/AddSprintPopup";
import { CompleteSprintPopup } from "../components/popups/CompleteSprintPopup";

describe('CompleteSprintPopup component in container', () => {
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
  it('renders without crashing', async () => {
    const onClickValue = { ...initAddPBI, priority: 1 };
    const onComplete = jest.fn().mockReturnValue(initAddPBI).mockReturnValueOnce(initAddPBI).mockReturnValueOnce(onClickValue);
    await render(<CompleteSprintPopup visible={true}
    onComplete={function (values: any): void { onComplete(); } }
    onCancel={() => { } } data={initSprint} />);

  });
  it('changes on clicking mark as failed', async () => {
    const onClickValue = { ...initSprint,status : "Failed" };
    const onComplete = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(initSprint).mockReturnValueOnce(onClickValue);
    const subject = mount(<CompleteSprintPopup visible={true}
      onComplete={function (values: any): void { onComplete(); } }
      onCancel={() => { } } data={initSprint} />, { attachTo: document.getElementById('div') });
      expect(onComplete()).toBe(initSprint);
      await act(async ()=>{
      subject.find("#FailedInCompletePopup").at(1).simulate('click');})
    expect(onComplete()).toStrictEqual(onClickValue);

  });

  it('changes on clicking mark as successful', async () => {
    const onClickValue = { ...initSprint,status : "Successful" };
    const onComplete = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(initSprint).mockReturnValueOnce(onClickValue);
    const subject = mount(<CompleteSprintPopup visible={true}
      onComplete={function (values: any): void { onComplete(); } }
      onCancel={() => { } } data={initSprint} />, { attachTo: document.getElementById('div') });
      expect(onComplete()).toBe(initSprint);
      await act(async ()=>{
      subject.find("#SuccesfulInCompletePopup").at(1).simulate('click');})
    expect(onComplete()).toStrictEqual(onClickValue);

  });
});