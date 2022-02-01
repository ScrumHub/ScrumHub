import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import { render } from "@testing-library/react";
import { initBI } from "../appstate/stateInitValues";
import { testMediaMatchObject } from "../appstate/stateUtitlities";
import { EditPBIPopup } from "../components/popups/EditPBIPopup";

describe('EditPBIPopup component in container', () => {
  let tempContainer: any;
  beforeEach(() => {
    tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
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
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    render(<EditPBIPopup
      data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); } }
      onCancel={() => { } } onDelete={function (): void {
      } } onFinish={function (): void {
      } } />);

  });
  it('changes on clicking save', async () => {
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onFinish = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onDelete = jest.fn().mockReturnValue(initBI).mockReturnValueOnce([]).mockReturnValueOnce([]);
    const subject = mount(<EditPBIPopup  data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); }}
      onCancel={() => { }} onDelete={function (): void {
        onDelete();
      } } onFinish={function (): void { onFinish();
      } } />, 
      { attachTo: document.getElementById('div') });
    expect(onCreate()).toBe(initBI);
    await act(async () => {
     subject.find("#SaveInEditPopup").at(1).simulate('click');
    })
    expect(onCreate()).toStrictEqual(initBI);

  });
  it('changes on clicking delete', async () => {
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onFinish = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onDelete = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce([]);
    const subject = mount(<EditPBIPopup  data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); }}
      onCancel={() => { }} onDelete={function (): void {
        onDelete();
      } } onFinish={function (): void { onFinish();
      } } />, 
      { attachTo: document.getElementById('div') });
    expect(onDelete()).toBe(initBI);
    await act(async () => {
     subject.find("#DeleteInEditPopup").at(1).simulate('click');
    })
    expect(onDelete()).toStrictEqual([]);

  });
  it('changes on clicking finish', async () => {
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onFinish = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const onDelete = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce([]);
    const subject = mount(<EditPBIPopup  data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); }}
      onCancel={() => { }} onDelete={function (): void {
        onDelete();
      } } onFinish={function (): void { onFinish();
      } } />, 
      { attachTo: document.getElementById('div') });
    expect(onFinish()).toBe(initBI);
    await act(async () => {
     subject.find("#FinishInEditPopup").at(1).simulate('click');
    })
    expect(onFinish()).toStrictEqual(onClickValue);

  });
});