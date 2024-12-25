import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPInput } from "./OTPInput";
import { act } from 'react';

describe("OTPInput", () => {
  it("should render the correct number of fields - default", () => {
    render(<OTPInput />);

    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')
    ).toHaveLength(6);
  });

  it("should render the correct number of fields - custom", () => {
    render(<OTPInput maxLength={4} />);

    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')
    ).toHaveLength(4);
  });

  it("should render the correct value", () => {
    render(<OTPInput value="1234" />);

    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')[0]
    ).toHaveTextContent("1");
    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')[1]
    ).toHaveTextContent("2");
    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')[2]
    ).toHaveTextContent("3");
    expect(
      document.querySelectorAll('[data-otp-container="true"] > div')[3]
    ).toHaveTextContent("4");
  });

  it("should not accept value greater than maxLength", () => {
    const { getByRole } = render(<OTPInput maxLength={4} value="12345" />);
    expect(getByRole("textbox")).toHaveValue("1234");
  });

  it("should accept only numeric characters", () => {
    const { getByRole } = render(<OTPInput value="aa32" />);
    const input = getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should not accept non-numeric characters", async () => {
    const { getByRole } = render(<OTPInput />);
    const input = getByRole("textbox");

    act(() => {
      input.focus();
    });
    await userEvent.keyboard("a");

    expect(input).toHaveValue("");
  });

  it("should call onChange", async () => {
    const onChange = jest.fn();
    const { getByRole } = render(<OTPInput onValueChange={onChange} />);
    const input = getByRole("textbox");

    act(() => {
      input.focus();
    });
    await userEvent.keyboard("{1}");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("should not call onComplete before maxLength", async () => {
    const onComplete = jest.fn();
    const { getByRole } = render(<OTPInput onComplete={onComplete} />);

    const input = getByRole("textbox");

    act(() => {
      input.focus();
    });
    await userEvent.keyboard("{1}{2}{3}{4}");

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("should call onComplete", async () => {
    const onComplete = jest.fn();
    const { getByRole } = render(
      <OTPInput maxLength={4} onComplete={onComplete} />
    );
    const input = getByRole("textbox");

    act(() => {
      input.focus();
    });
    await userEvent.keyboard("{1}{2}{3}{4}");

    expect(onComplete).toHaveBeenCalledWith("1234");
  });
});
