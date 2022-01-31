import { isNull } from "lodash";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import { render } from "@testing-library/react";
import { initBI } from "../appstate/stateInitValues";
import { EstimatePBIPopup } from "../components/popups/EstimatePBIPopup";

describe('EstimatePBIPopup component in container', () => {
  let tempContainer: any;
  beforeEach(() => {
    tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
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
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    render(<EstimatePBIPopup
      data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); } }
      onCancel={() => { } } />);

  });
  it('changes on clicking save', async () => {
    const onClickValue = { ...initBI, expectedTimeInHours: 1 };
    const onCreate = jest.fn().mockReturnValue(initBI).mockReturnValueOnce(initBI).mockReturnValueOnce(onClickValue);
    const subject = mount(<EstimatePBIPopup  data={initBI} visible={true}
      onCreate={function (values: any): void { onCreate(); }}
      onCancel={() => { }} />, 
      { attachTo: document.getElementById('div') });
    expect(onCreate()).toBe(initBI);
    await act(async () => {
     subject.find("#SaveInEstimatePBIPopup").at(1).simulate('click');
    })
    expect(onCreate()).toStrictEqual(initBI);

  });
});