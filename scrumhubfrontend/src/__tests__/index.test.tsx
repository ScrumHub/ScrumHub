/**
 * @jest-environment jsdom
 */
import ReactDOM, {  } from "react-dom";
import { ReactStrictMode, rootElement } from '../index'

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('index.tsx', () => {
  it('renders without crashing', () => {
    ReactDOM.render(ReactStrictMode, rootElement)
    expect(ReactDOM.render).toHaveBeenCalledWith(ReactStrictMode, rootElement)
  })
})