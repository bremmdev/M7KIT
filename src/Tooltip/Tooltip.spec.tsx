import { render } from "@testing-library/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { act } from "react";

describe("Tooltip", () => {
  it("should render TooltipTrigger and TooltipContent", () => {
    const { getByRole, getByText } = render(
      <Tooltip>
        <TooltipTrigger>Tooltip trigger</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    expect(getByRole("button")).toHaveTextContent("Tooltip trigger");

    //simulate a hover event
    act(() => {
      getByRole("button").focus();
    });

    expect(getByText("Tooltip content")).toBeInTheDocument();
  });

  it("should throw an error if there is no TooltipTrigger", () => {
    expect(() => {
      render(
        <Tooltip>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
    }).toThrow("Tooltip must contain a TooltipTrigger component");
  });

  it("should throw an error if there is no TooltipContent", () => {
    expect(() => {
      render(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
        </Tooltip>
      );
    }).toThrow("Tooltip must contain a TooltipContent component");
  });

  it("should pass trigger props to the trigger button", () => {
    const { getByRole } = render(
      <Tooltip>
        <TooltipTrigger className="text-blue-500" aria-label="more info">
          Tooltip trigger
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    expect(getByRole("button")).toHaveClass("text-blue-500");
    expect(getByRole("button")).toHaveAttribute("aria-label", "more info");
  });

  it("should pass content props to the tooltip content", () => {
    const { getByRole } = render(
      <Tooltip>
        <TooltipTrigger>Tooltip trigger</TooltipTrigger>
        <TooltipContent className="bg-red-500" aria-label="content description">
          Tooltip content
        </TooltipContent>
      </Tooltip>
    );

    //simulate a hover event
    act(() => {
      getByRole("button").focus();
    });

    expect(getByRole("tooltip")).toHaveClass("bg-red-500");
    expect(getByRole("tooltip")).toHaveAttribute(
      "aria-label",
      "content description"
    );
  });
});
