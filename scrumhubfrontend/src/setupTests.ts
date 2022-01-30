// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const localStorageMock = {
    getItem: jest.fn(),
    removeItem:jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    length:0,
    key:jest.fn()
  };
  global.localStorage = localStorageMock;

configure({ adapter: new Adapter() });