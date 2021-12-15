import { IFilters } from "../../appstate/stateInterfaces"

export const validate = (IDs: IFilters) => {
    return (IDs.oldSprintId !== -1 && IDs.newSprintId !== -1 && IDs.pbiId !== -1 && IDs.newSprintId !== IDs.oldSprintId)
  }