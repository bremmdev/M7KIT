import { render } from "@testing-library/react";
import { Masonry } from "./Masonry";

describe("Masonry", () => {
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

  it("render correct number of columns", () => {
    const { getAllByTestId } = render(
      <Masonry columns={3}>{children}</Masonry>
    );

    expect(getAllByTestId("column")).toHaveLength(3);
  });

  it("render correct number of columns with vertical order", () => {
    const { getAllByTestId } = render(
      <Masonry columns={4} columnOrder="vertical">
        {children}
      </Masonry>
    );

    expect(getAllByTestId("column")).toHaveLength(4);
  });

  it("render correct order of items for horizontal", () => {
    const { getAllByTestId } = render(
      <Masonry columns={3}>{children}</Masonry>
    );
    expect(getAllByTestId("column")[0]).toHaveTextContent("147");
    expect(getAllByTestId("column")[1]).toHaveTextContent("258");
    expect(getAllByTestId("column")[2]).toHaveTextContent("36");
  });

  it("render correct order of items for vertical", () => {
    const { getAllByTestId } = render(
      <Masonry columns={3} columnOrder="vertical">
        {children}
      </Masonry>
    );
    expect(getAllByTestId("column")[0]).toHaveTextContent("123");
    expect(getAllByTestId("column")[1]).toHaveTextContent("456");
    expect(getAllByTestId("column")[2]).toHaveTextContent("78");
  });

  it("should not render empty columns", () => {
    const { getAllByTestId } = render(
      <Masonry columns={5} columnOrder="vertical">
        {children}
      </Masonry>
    );

    expect(getAllByTestId("column")[4]).toHaveTextContent("8");
  });
});
