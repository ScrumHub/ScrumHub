import { IFilters } from "../../appstate/stateInterfaces";

export const initIDs: IFilters = {
    oldSprintId: -1, newSprintId: -1, pbiId: -1, dropped: false
  };

  export const fixedType = 'NonDraggableBodyRow';

  export const initModalVals = {
    isAddTaskModalVisible: false,
    isAssignTaskModalVisible: false,
    isAssignPeopleModalVisible: false,
    isAddModalVisible: false,
    isUpdateModalVisible: false,
    isAddPBIModalVisible: false,
    isEditModalVisible: false,
    isEstimateModalVisible: false,
  }

  export const initFetchVals = {
    fetchSprints: false,
    fetchSprintsPBI: false,
    fetchPBIs: false,
    fetched: false,
  }
