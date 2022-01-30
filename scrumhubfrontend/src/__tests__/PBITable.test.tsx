/**
 * @jest-environment jsdom
 */
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { isNull } from 'lodash';
import { unmountComponentAtNode } from 'react-dom';
import { shallow } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import { initFilteredInfo, initModalVals, initSortedInfo } from '../components/utility/commonInitValues';
import { initBI, initPeopleList, initSprint } from '../appstate/stateInitValues';
import { dragCmpnts, pbiColumns, taskColumns } from '../components/utility/TableUtilities';
import { TestDraggableBodyRow } from '../components/utility/BacklogHandlers';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducerFunction } from '../appstate/reducer';
import { updatedTestState } from '../appstate/stateTestValues';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import TestRenderer from "react-test-renderer";
import { TaskTableComponent } from '../components/tables/TaskTable';
import { PBITableComponent } from '../components/tables/PBITable';
import config from '../configuration/config';
const {act:actTester} = TestRenderer;
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector:jest.fn()
}));


configure({ adapter: new Adapter() });
describe('PBITable component in container', () => {
  let tempContainer: any, setState: any, store: any, useStateMock: any;
  beforeEach(() => {
    tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    store = configureStore({
      reducer: reducerFunction({...updatedTestState, loading:true}),
    });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    setState = jest.fn();
    useStateMock = (initState: any) => [initState, setState];
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
    const subject = shallow(<Provider store={store}>
      <DndProvider backend={HTML5Backend} key={"dnd_sprint"}>
        <PBITableComponent sortedInfo={initSortedInfo} filteredInfo={initFilteredInfo}
          sortSelected={function (items: any): void { }}
          itemSelected={function (items: number[]): void { }} TaskTableforPBI={[]}
          nameFilter={[]} peopleFilter={[]} item={initSprint}
          pbiColumns={pbiColumns([], initSortedInfo, initFilteredInfo, useStateMock,
            initModalVals, useStateMock, [] as number[], config.token, "ownerName")}
          nestedcomponents={dragCmpnts(TestDraggableBodyRow)} />
      </DndProvider>
    </Provider>);
      expect(EnzymeToJson(subject)).toMatchSnapshot();
          });
});

