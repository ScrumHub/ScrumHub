import { IFilters, IProductBacklogItem } from "../../appstate/stateInterfaces";
import { store } from "../../appstate/store";
import * as Actions from '../../appstate/actions';

/*export const Increment = (count, setCount) => {
    //more logic here ..
    setCount(count + 1);
};

export const Decrement = (count, setCount) => {
    //more logic here ..
    setCount(count !== 0 ? count - 1 : 0);
};
export const addTaskToPBI = (input: IFilters, isModal:IFilters, 
    setIsModal: any, setInitialRefresh:any, setSelectedPBI:any,
    token:string, ownerName:string, selectedPBI:IProductBacklogItem) => {
    try {
      store.dispatch(
        Actions.addTaskThunk({
          token: token,
          ownerName: ownerName,
          pbiId: selectedPBI.id,
          name: input.name
        }) //filters
      );
    } catch (err) { console.error("Failed to add the pbis: ", err); }
    finally {
      setSelectedPBI({} as IProductBacklogItem);
      setInitialRefresh(true);
    }
  };*/