import { isNull } from "lodash";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import TestRenderer from "react-test-renderer";
import { AddPBIPopup } from "../components/popups/AddPBIPopup";
import { mount } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import { fireEvent, getByLabelText, render } from "@testing-library/react";
const {act:actTester} = TestRenderer;

describe('AddPBIPopup component in container', () => {
  let container: any;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
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
    if (!isNull(container)) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });
  it('is the same as snapshot', () => {
    const subject = mount( <AddPBIPopup visible={true}
      onCreate={function (values: any): void { }}
      onCancel={() => { }} />);
      expect(EnzymeToJson(subject)).toMatchSnapshot();
   });
  it('renders without crashing', () => {
    //act(() => {
      const {container, getByText} = render(<AddPBIPopup visible={true}
        onCreate={function (values: any): void { }}
        onCancel={() => { }} />);
    //});
    //const m = container.getByLabelText("Save"); 
    //const modal = container.querySelector("ant-btn ant-btn-primary") as Element;
    //console.log(modal);
    //getByText("Save"); //container.querySelector('.modalAdd');
    //fireEvent.click(modal);
    //modal.simulate('click');
    //console.log(button);
    //expect(container).toMatchSnapshot();

  });
});