import { render } from "@testing-library/react";
import { TextReveal } from "./TextReveal";

describe("TextReveal", () => {
  describe("Functionality", () => {
    it("should render single child", () => {
      const { container } = render(
        <TextReveal>
          <span>Test</span>
        </TextReveal>
      );

      expect(container.querySelector("span")).toHaveTextContent("Test");
    });

    it("should render multiple children", () => {
      const { container } = render(
        <TextReveal>
          <span>Test 1</span>
          <span>Test 2</span>
        </TextReveal>
      );

      expect(container.querySelectorAll("span")).toHaveLength(2);
    });

    it("should show only first child by default", () => {
      const { container } = render(
        <TextReveal>
          <span>Test 1</span>
          <span>Test 2</span>
        </TextReveal>
      );

      const els = container.querySelectorAll(".grid > div");

      expect(els[0]).not.toHaveClass("opacity-0");
      expect(els[1]).toHaveClass("opacity-0");
    });

    it("should show only correct child when defaultVisibleIndex is set", () => {
      const { container } = render(
        <TextReveal defaultVisibleIndex={1}>
          <span>Test 1</span>
          <span>Test 2</span>
          <span>Test 3</span>
        </TextReveal>
      );

      const els = container.querySelectorAll(".grid > div");

      expect(els[0]).toHaveClass("opacity-0");
      expect(els[1]).not.toHaveClass("opacity-0");
      expect(els[2]).toHaveClass("opacity-0");
    });
  });

  it("should set correct animation class based on direction prop", () => {
    const { container } = render(
      <TextReveal direction="up">
        <span>Test 1</span>
      </TextReveal>
    );

    const el = container.querySelector(".grid > div");

    expect(el).toHaveClass("animate-slide-up-fade");
  });

  it("should set correct animation duration", () => {
    const { container } = render(
      <TextReveal animationDuration={3000}>
        <span>Test 1</span>
      </TextReveal>
    );

    const el = container.querySelector(".grid > div");

    expect(el).toHaveStyle("animation-duration: 3000ms");
  });
});
