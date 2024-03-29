import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import { render } from "@testing-library/react";
import { initAddPBI, initBI, initSprint } from "../appstate/stateInitValues";
import { AddSprintPopup } from "../components/popups/AddSprintPopup";
import { testMediaMatchObject } from "../appstate/stateUtitlities";

describe('AddSprintPopup component in container', () => {
  let tempContainer: any;
  beforeEach(() => {
    tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    testMediaMatchObject();
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
    const onCreate = jest.fn().mockReturnValue(initAddPBI).mockReturnValueOnce(initAddPBI).mockReturnValueOnce(onClickValue);
    await render(<AddSprintPopup visible={true}
    onCreate={function (values: any): void { onCreate(); } }
    onCancel={() => { } } data={initSprint} error={""} pbiData={[initBI]} sprintData={[]} />);

  });
  it('changes on clicking save', async () => {
    const onClickValue = { ...initSprint, title: "Title" };
    const onCreate = jest.fn().mockReturnValue(initSprint).mockReturnValueOnce(initSprint).mockReturnValueOnce(onClickValue);
    const subject = mount(<AddSprintPopup visible={true}
    onCreate={function (values: any): void { onCreate(); } }
    onCancel={() => { } } data={initSprint} error={""} pbiData={[initBI]} sprintData={[]} />, { attachTo: document.getElementById('div') });
      expect(onCreate()).toBe(initSprint);
      await act(async ()=>{
      subject.find("#SaveInAddSprintPopup").at(1).simulate('click');})
    expect(onCreate()).toStrictEqual(onClickValue);

  });
});