import { createRef } from "react";

export const DraweNavigation: any = createRef();

export const useDrawerNavigation = () => {
  if (!!DraweNavigation.current) {
    return DraweNavigation.current;
  }

  return {};
};
