import { render } from "@testing-library/react";
import { Slider } from "./Slider";
import userEvent from "@testing-library/user-event";

describe("Slider", () => {
  describe("Functionality", () => {
    it("should set correct default value", async () => {
      const { findByRole } = render(<Slider value={76} />);
      expect(await findByRole("slider")).toHaveAttribute("aria-valuenow", "76");
    });
    it("should set correct default value when value less than minimum", async () => {
      const { findByRole } = render(<Slider value={-1} min={20} />);
      expect(await findByRole("slider")).toHaveAttribute("aria-valuenow", "20");
    });
    it("should set correct default value when value is > 100", async () => {
      const { findByRole } = render(<Slider value={101} />);
      expect(await findByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "100"
      );
    });
    it("should render without label", () => {
      const { queryByRole } = render(<Slider />);
      expect(queryByRole("label")).toBeNull();
    });
    it("should render with label", () => {
      const { getByText } = render(<Slider label="Score" />);
      expect(getByText("Score")).toBeTruthy();
    });
    it("should render with value", () => {
      const { getByText } = render(<Slider value={50} />);
      expect(getByText("50")).toBeTruthy();
    });

    it("should render input with name", () => {
      const { getByRole } = render(<Slider name="score" value={50} />);
      expect(getByRole("textbox")).toBeTruthy();
    });

    it("should render input without name", () => {
      const { queryByRole } = render(<Slider value={50} />);
      expect(queryByRole("textbox")).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("should render the slider with the correct role", () => {
      const { getByRole } = render(<Slider />);
      expect(getByRole("slider")).toBeTruthy();
    });
    it("should render the slider with the correct aria-valuemin", () => {
      const { getByRole } = render(<Slider />);
      expect(getByRole("slider")).toHaveAttribute("aria-valuemin", "0");
    });
    it("should render the slider with the correct aria-valuemax", () => {
      const { getByRole } = render(<Slider />);
      expect(getByRole("slider")).toHaveAttribute("aria-valuemax", "100");
    });
    it("should be referenced by aria-labelledby when label is provided", () => {
      const { getByRole } = render(<Slider label="Score" />);
      expect(getByRole("slider")).toHaveAttribute("aria-labelledby");
    });
  });

  describe("Keyboard interaction", () => {
    it("should be focusable", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider />);
      expect(getByRole("slider")).not.toHaveFocus();
      await user.keyboard("{tab}");
      expect(getByRole("slider")).toHaveFocus();
    });

    it("should not be focusable when disabled", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider disabled />);
      expect(getByRole("slider")).not.toHaveFocus();
      await user.keyboard("{tab}");
      expect(getByRole("slider")).not.toHaveFocus();
    });

    it("should increase value when right arrow is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={34} />);
      await user.keyboard("{tab}{arrowright}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "35");
    });

    it("should increase value when up arrow is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={75} />);
      await user.keyboard("{tab}{arrowup}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "76");
    });

    it("should decrease value when left arrow is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={34} />);
      await user.keyboard("{tab}{arrowleft}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "33");
    });

    it("should decrease value when down arrow is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={75} />);
      await user.keyboard("{tab}{arrowdown}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "74");
    });

    it("should set value to minimum when home is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={75} min={12} />);
      await user.keyboard("{tab}{home}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "12");
    });

    it("should set value to maximum when end is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={75} max={99} />);
      await user.keyboard("{tab}{end}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "99");
    });

    it("should not increase value when right arrow is pressed and value is at max", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={100} />);
      await user.keyboard("{tab}{arrowright}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
    });

    it("should not increase value when up arrow is pressed and value is at max", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={100} />);
      await user.keyboard("{tab}{arrowup}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
    });

    it("should not decrease value when left arrow is pressed and value is at min", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={0} />);
      await user.keyboard("{tab}{arrowleft}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    });

    it("should not decrease value when down arrow is pressed and value is at min", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={0} />);
      await user.keyboard("{tab}{arrowdown}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    });

    it("should increase by correct step", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Slider value={0} step={10} />);
      await user.keyboard("{tab}{arrowright}");
      expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "10");
    });
  });
});
