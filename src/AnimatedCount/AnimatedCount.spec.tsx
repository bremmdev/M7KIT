import { act, render, screen } from "@testing-library/react";
import { AnimatedCount } from "./AnimatedCount";

// Runs the animation one step at a time (at most `steps`), and returns every number shown.
// The cap stops a counter that never reaches `count`
const runSteps = (steps = 1000) => {
  const element = screen.getByTestId("count");
  const shown = [element.textContent];
  for (let i = 0; i < steps && jest.getTimerCount() > 0; i++) {
    act(() => jest.runOnlyPendingTimers());
    shown.push(element.textContent);
  }
  return shown;
};

describe("AnimatedCount", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Direction", () => {
    it("counts up from start to count", () => {
      render(<AnimatedCount data-testid="count" count={5} />);

      expect(runSteps()).toEqual(["0", "1", "2", "3", "4", "5"]);
    });

    it("counts down when count is below start, with the default step", () => {
      render(<AnimatedCount data-testid="count" start={5} count={0} />);

      expect(runSteps()).toEqual(["5", "4", "3", "2", "1", "0"]);
    });

    it("ignores the sign of step", () => {
      render(<AnimatedCount data-testid="count" count={3} step={-1} />);

      expect(runSteps()).toEqual(["0", "1", "2", "3"]);
    });

    it("does nothing when start and count are the same", () => {
      render(<AnimatedCount data-testid="count" start={7} count={7} />);

      expect(runSteps()).toEqual(["7"]);
    });
  });

  describe("Last step", () => {
    it("stops at count when step doesn't divide the distance", () => {
      render(<AnimatedCount data-testid="count" count={10} step={3} />);

      expect(runSteps()).toEqual(["0", "3", "6", "9", "10"]);
    });

    it("stops at count when counting down", () => {
      render(<AnimatedCount data-testid="count" start={10} count={0} step={4} />);

      expect(runSteps()).toEqual(["10", "6", "2", "0"]);
    });

    it("shows fractional steps without floating point errors", () => {
      render(<AnimatedCount data-testid="count" count={1} step={0.1} />);

      expect(runSteps()).toEqual(["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"]);
    });

    it("uses the decimals of start and count", () => {
      render(<AnimatedCount data-testid="count" start={0.5} count={3.25} />);

      expect(runSteps()).toEqual(["0.50", "1.50", "2.50", "3.25"]);
    });
  });

  describe("Changing props", () => {
    it("animates down to a lower count after the animation", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" count={5} />);
      runSteps();

      rerender(<AnimatedCount data-testid="count" count={2} />);

      expect(runSteps()).toEqual(["5", "4", "3", "2"]);
    });

    it("animates from the number shown when count changes during the animation", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" count={10} />);
      runSteps(6);

      rerender(<AnimatedCount data-testid="count" count={3} />);

      expect(runSteps()).toEqual(["6", "5", "4", "3"]);
    });

    it("takes duration again for each new count", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" count={100} duration={1000} />);
      runSteps();

      rerender(<AnimatedCount data-testid="count" count={90} duration={1000} />);
      act(() => jest.advanceTimersByTime(99));

      expect(screen.getByTestId("count")).toHaveTextContent("100");

      act(() => jest.advanceTimersByTime(1));

      expect(screen.getByTestId("count")).toHaveTextContent("99");
    });

    it("starts again from a new start", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" start={0} count={3} />);
      runSteps();

      rerender(<AnimatedCount data-testid="count" start={10} count={12} />);

      expect(runSteps()).toEqual(["10", "11", "12"]);
    });
  });

  describe("Width", () => {
    it("fits the widest number of the animation", () => {
      render(<AnimatedCount data-testid="count" start={-5} count={100} />);

      expect(screen.getByTestId("count")).toHaveStyle({ width: "3ch" });
    });

    it("fits the number shown when count changes to a shorter number", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" count={1000} step={100} />);
      runSteps();

      rerender(<AnimatedCount data-testid="count" count={5} step={100} />);

      expect(screen.getByTestId("count")).toHaveStyle({ width: "4ch" });
    });

    it("fits the decimals", () => {
      render(<AnimatedCount data-testid="count" count={1} step={0.1} />);

      expect(screen.getByTestId("count")).toHaveStyle({ width: "3ch" });
    });
  });

  describe("Other props", () => {
    it("passes other props to the element", () => {
      const onClick = jest.fn();
      render(<AnimatedCount data-testid="count" count={5} id="score" aria-describedby="hint" onClick={onClick} />);
      const element = screen.getByTestId("count");

      element.click();

      expect(element).toHaveAttribute("id", "score");
      expect(element).toHaveAttribute("aria-describedby", "hint");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("merges style with the width, and lets style replace the width", () => {
      const { rerender } = render(<AnimatedCount data-testid="count" count={5} style={{ color: "red" }} />);

      expect(screen.getByTestId("count")).toHaveStyle({ color: "rgb(255, 0, 0)", width: "1ch" });

      rerender(<AnimatedCount data-testid="count" count={5} style={{ width: "10rem" }} />);

      expect(screen.getByTestId("count")).toHaveStyle({ width: "10rem" });
    });

    it("renders as another element", () => {
      render(<AnimatedCount data-testid="count" as="strong" count={5} className="text-xl" />);
      const element = screen.getByTestId("count");

      expect(element.tagName).toBe("STRONG");
      expect(element).toHaveClass("inline-block", "text-xl");
    });
  });
});
