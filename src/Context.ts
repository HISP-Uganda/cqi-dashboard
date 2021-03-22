import { useContext, createContext } from "react";

export const D2Context = createContext(null);

export function useD2() {
  return useContext(D2Context);
}
