import { useContext } from "react";
import { AppContext } from "./appContext";

export const useAppContext = () => {
  return useContext(AppContext);
}