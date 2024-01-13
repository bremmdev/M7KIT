import React from 'react'
import { IndentationProps } from './Indentation.types'

const Indentation = ({
  spaceAmount = 2,
  level = 0,
  useDashes = false,
}: IndentationProps) => {
  return (
    <React.Fragment>
      {Array.from({ length: level * spaceAmount }).map((_, index) => {
        return useDashes ? (
          <span key={index}>-</span>
        ) : (
          <span key={index}>&nbsp;</span>
        );
      })}
    </React.Fragment>
  );
};

export default Indentation