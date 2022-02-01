import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AddPBIPopup } from "../components/popups/AddPBIPopup";
import { mount } from 'enzyme';
import { render } from "@testing-library/react";
import { initAddPBI } from "../appstate/stateInitValues";
import { testMediaMatchObject } from "../appstate/stateUtitlities";

describe('AddPBIPopup component in container', () => {
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
    await render(<AddPBIPopup visible={true}
      onCreate={function (values: any): void { onCreate() }}
      onCancel={() => { }} />);

  });
  it('changes on clicking save', async () => {
    const onClickValue = { ...initAddPBI, priority: 1 };
    const onCreate = jest.fn().mockReturnValue(initAddPBI).mockReturnValueOnce(initAddPBI).mockReturnValueOnce(onClickValue);
    const subject = mount(<AddPBIPopup visible={true}
      onCreate={function (values: any): void {onCreate() }}
      onCancel={() => { }} />, { attachTo: document.getElementById('div') });
      expect(onCreate()).toBe(initAddPBI);
      await act(async ()=>{
      subject.find("#SaveInAddPBIPopup").at(1).simulate('click');})
    expect(onCreate()).toStrictEqual(onClickValue);

  });
});