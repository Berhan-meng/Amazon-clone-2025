import { useEffect, createContext, useReducer } from "react";
import { reducer } from "../../../Utility/reducer";

export const DataContext = createContext();

// Single source of truth
const initialState = {
  basket: JSON.parse(localStorage.getItem("basket")) || [],
  user: null,
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist basket to localStorage
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(state.basket));
  }, [state.basket]);

  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};
