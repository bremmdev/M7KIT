import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { act } from "react";

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render TooltipTrigger", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByRole("button")).toHaveTextContent("Tooltip trigger");
    });

    it("should not render TooltipContent by default", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should show tooltip content on focus", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      act(() => {
        screen.getByRole("button").focus();
      });

      expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip content");
    });

    it("should throw error when TooltipTrigger is used outside of Tooltip", () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

      expect(() => {
        render(<TooltipTrigger>Orphan trigger</TooltipTrigger>);
      }).toThrow("useTooltip must be used within a TooltipProvider");

      consoleSpy.mockRestore();
    });

    it("should throw error when TooltipContent is used outside of Tooltip", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

      expect(() => {
        render(<TooltipContent>Orphan content</TooltipContent>);
      }).toThrow("useTooltip must be used within a TooltipProvider");

      consoleSpy.mockRestore();
    });
  });

  describe("Props", () => {
    it("should pass trigger props to the trigger button", () => {
      render(
        <Tooltip>
          <TooltipTrigger className="custom-class" aria-label="more info">
            Tooltip trigger
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByRole("button")).toHaveClass("custom-class");
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "more info");
    });

    it("should pass content props to the tooltip content", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent className="custom-content" data-testid="tooltip-content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      );

      act(() => {
        screen.getByRole("button").focus();
      });

      expect(screen.getByRole("tooltip")).toHaveClass("custom-content");
      expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    });
  });

  describe("Controlled mode", () => {
    it("should respect controlled open state", () => {
      render(
        <Tooltip open={true}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("should respect controlled closed state", () => {
      render(
        <Tooltip open={false}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      act(() => {
        screen.getByRole("button").focus();
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should call onOpenChange when tooltip opens", () => {
      const onOpenChange = jest.fn();

      render(
        <Tooltip onOpenChange={onOpenChange}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      act(() => {
        screen.getByRole("button").focus();
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange when tooltip closes", () => {
      const onOpenChange = jest.fn();

      render(
        <Tooltip onOpenChange={onOpenChange}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      act(() => {
        button.focus();
      });

      act(() => {
        button.blur();
        jest.runAllTimers();
      });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Keyboard interaction", () => {
    it("should close tooltip on Escape key", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      act(() => {
        button.focus();
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(button, { key: "Escape" });
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Hover behavior", () => {
    it("should show tooltip after hover delay", () => {
      render(
        <Tooltip hoverDelay={300}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);

      // Should not show immediately
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      // Advance timers past the delay
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("should hide tooltip on mouse leave after delay", () => {
      render(
        <Tooltip hoverDelay={0}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      // Show tooltip
      fireEvent.mouseEnter(button);
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      // Hide tooltip
      fireEvent.mouseLeave(button);
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should keep tooltip open when moving from trigger to content", () => {
      render(
        <Tooltip hoverDelay={0}>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      // Show tooltip
      fireEvent.mouseEnter(button);
      act(() => {
        jest.runAllTimers();
      });

      const tooltip = screen.getByRole("tooltip");

      // Leave trigger but enter content before close timer fires
      fireEvent.mouseLeave(button);
      fireEvent.mouseEnter(tooltip);

      act(() => {
        jest.runAllTimers();
      });

      // Tooltip should still be visible
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-describedby when tooltip is open", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");

      // Should not have aria-describedby when closed
      expect(button).not.toHaveAttribute("aria-describedby");

      act(() => {
        button.focus();
      });

      // Should have aria-describedby pointing to tooltip when open
      const tooltipId = screen.getByRole("tooltip").getAttribute("id");
      expect(button).toHaveAttribute("aria-describedby", tooltipId);
    });

    it("should have role=tooltip on content", () => {
      render(
        <Tooltip>
          <TooltipTrigger>Tooltip trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      act(() => {
        screen.getByRole("button").focus();
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});
