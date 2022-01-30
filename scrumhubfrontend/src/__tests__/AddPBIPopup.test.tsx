import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { AddPBIPopup } from "../components/popups/AddPBIPopup";
import { mount } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import { render } from "@testing-library/react";
import { initAddPBI } from "../appstate/stateInitValues";

describe('AddPBIPopup component in container', () => {
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
    const subject = mount(<AddPBIPopup visible={true}
      onCreate={function (values: any): void { }}
      onCancel={() => { }} />);
    expect(EnzymeToJson(subject)).toMatchSnapshot();
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