import { fireEvent, render, act } from "@testing-library/react";
import { GalleryStack } from "./GalleryStack";

describe("Gallery", () => {
  const children = [
    <div key={1}>1</div>,
    <div key={2}>2</div>,
    <div key={3}>3</div>,
    <div key={4}>4</div>,
    <div key={5}>5</div>,
    <div key={6}>6</div>,
    <div key={7}>7</div>,
    <div key={8}>8</div>
  ];

  it("render correct order of items", () => {
    const { getByTestId } = render(<GalleryStack>{children}</GalleryStack>);

    const items = Array.from(getByTestId("gallery-stack").querySelectorAll("div"));

    expect(items[0]).toHaveTextContent("1");
  });

  it("renders reversed order of items", () => {
    const { getByTestId } = render(<GalleryStack reversed>{children}</GalleryStack>);

    const items = Array.from(getByTestId("gallery-stack").querySelectorAll("div"));

    expect(items[0]).toHaveTextContent("8");
  });

  it("renders correct rotation amount", () => {
    const { getByTestId } = render(<GalleryStack rotationAmount={10}>{children}</GalleryStack>);

    const items = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    //first child (bottom of the stack with index 7) will have 70 degrees of rotation
    expect(items[0]).toHaveStyle("transform: rotate(70deg) translateX(0)");
    expect(items[1]).toHaveStyle("transform: rotate(60deg) translateX(0)");
    expect(items[2]).toHaveStyle("transform: rotate(50deg) translateX(0)");
  });

  it("renders correct negative rotation amount", () => {
    const { getByTestId } = render(<GalleryStack rotationAmount={-15}>{children}</GalleryStack>);

    const items = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    //first child (bottom of the stack with index 7) will have -70 degrees of rotation
    expect(items[0]).toHaveStyle("transform: rotate(-105deg) translateX(0)");
    expect(items[1]).toHaveStyle("transform: rotate(-90deg) translateX(0)");
    expect(items[2]).toHaveStyle("transform: rotate(-75deg) translateX(0)");
  });

  it("rotates the stack forward", async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<GalleryStack>{children}</GalleryStack>);

    const items = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    // use faketimers to advance the time in order to let the animation finish
    act(() => {
      fireEvent.click(items[0]);
      jest.advanceTimersByTime(5000);
    });

    const itemsAfterClick = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    expect(itemsAfterClick[0]).toHaveTextContent("2");
    expect(itemsAfterClick[1]).toHaveTextContent("3");
    expect(itemsAfterClick[2]).toHaveTextContent("4");
    jest.useRealTimers();
  });

  it("rotates the stack forward on arrow right click", async () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByRole } = render(<GalleryStack>{children}</GalleryStack>);

    const arrow = getAllByRole("button")[0];

    act(() => {
      fireEvent.click(arrow);
      jest.advanceTimersByTime(5000);
    });

    const itemsAfterClick = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    expect(itemsAfterClick[0]).toHaveTextContent("2");
    expect(itemsAfterClick[1]).toHaveTextContent("3");
    expect(itemsAfterClick[2]).toHaveTextContent("4");
    jest.useRealTimers();
  });

  it("rotates the stack backward on arrow left click", async () => {
    jest.useFakeTimers();
    const { getByTestId, getAllByRole } = render(<GalleryStack>{children}</GalleryStack>);

    const arrow = getAllByRole("button")[1];

    act(() => {
      fireEvent.click(arrow);
      jest.advanceTimersByTime(5000);
    });

    const itemsAfterClick = Array.from(getByTestId("gallery-stack").querySelectorAll(":scope > div"));

    expect(itemsAfterClick[0]).toHaveTextContent("8");
    expect(itemsAfterClick[1]).toHaveTextContent("1");
    expect(itemsAfterClick[2]).toHaveTextContent("2");
    jest.useRealTimers();
  });
});
