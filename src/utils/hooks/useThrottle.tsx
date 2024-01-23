/* eslint-disable */
import React from "react";

export function useThrottle(cb: (...args: Array<any>) => void, delay = 200) {
  //keep track of the last time the function ran
  const lastRun = React.useRef(Date.now());

  return function (...args: Array<any>) {
    //if wait time has elapsed, fire callback and reset the lastRun time
    if (Date.now() - lastRun.current >= delay) {
      cb(...args);
      lastRun.current = Date.now();
    }
  };
}

export default useThrottle;
