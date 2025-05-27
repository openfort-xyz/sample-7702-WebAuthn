import { useMemo } from "react";
import { getPublicClient } from "../getPublicClient";

export const usePublicClient = () => {
  return useMemo(() => getPublicClient(), []);
};