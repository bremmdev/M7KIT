import React from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    const updateScrollPosition = () => {
      //the current scroll position
      const scrollY = window.scrollY;
      //the total height of the document, including the non-visible parts
      const scrollHeight = document.body.scrollHeight;
      //the height of the visible part of the document
      const windowHeight = window.innerHeight;
      const scrollPercent = (scrollY / (scrollHeight - windowHeight)) * 100;
      setScrollPosition(scrollY);
      setScrollPercent(scrollPercent > 100 ? 100 : scrollPercent);
    };

    window.addEventListener("scroll", updateScrollPosition);

    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, []);

  return { scrollPosition, scrollPercent };
}

export default useScrollPosition;
