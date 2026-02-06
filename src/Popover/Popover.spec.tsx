import { render, screen, fireEvent } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from "./Popover";
import { act } from "react";

describe("Popover", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Rendering", () => {
        it("should render PopoverTrigger", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("button")).toHaveTextContent("Open popover");
        });

        it("should not render PopoverContent by default", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("should render PopoverContent when open is true", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("dialog")).toHaveTextContent("Popover content");
        });

        it("should throw error when PopoverTrigger is used outside of Popover", () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

            expect(() => {
                render(<PopoverTrigger>Orphan trigger</PopoverTrigger>);
            }).toThrow("usePopover must be used within a PopoverProvider");

            consoleSpy.mockRestore();
        });

        it("should throw error when PopoverContent is used outside of Popover", () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

            expect(() => {
                render(<PopoverContent>Orphan content</PopoverContent>);
            }).toThrow("usePopover must be used within a PopoverProvider");

            consoleSpy.mockRestore();
        });

        it("should throw error when PopoverTitle is used outside of Popover", () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

            expect(() => {
                render(<PopoverTitle>Orphan title</PopoverTitle>);
            }).toThrow("usePopover must be used within a PopoverProvider");

            consoleSpy.mockRestore();
        });
    });

    describe("Props", () => {
        it("should pass trigger props to the trigger button", () => {
            render(
                <Popover>
                    <PopoverTrigger className="custom-class" data-testid="trigger">
                        Open popover
                    </PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("button")).toHaveClass("custom-class");
            expect(screen.getByTestId("trigger")).toBeInTheDocument();
        });

        it("should pass content props to the popover content", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent className="custom-content" data-testid="popover-content">
                        Popover content
                    </PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("dialog")).toHaveClass("custom-content");
            expect(screen.getByTestId("popover-content")).toBeInTheDocument();
        });

        it("should apply fade animation by default", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("dialog")).toHaveClass("animate-fade-in");
        });

        it("should not apply fade animation when fade is false", () => {
            render(
                <Popover open={true} fade={false}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("dialog")).not.toHaveClass("animate-fade-in");
        });
    });

    describe("Click behavior", () => {
        it("should open popover on click", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button"));

            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("should close popover on second click", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");

            fireEvent.click(trigger);
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            fireEvent.click(trigger);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("should close popover on click outside", () => {
            render(
                <div>
                    <button data-testid="outside">Outside</button>
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                </div>
            );

            fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            fireEvent.mouseDown(screen.getByTestId("outside"));

            act(() => {
                jest.runAllTimers();
            });

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    describe("Keyboard interaction", () => {
        it("should close popover on Escape key when trigger is focused", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");

            fireEvent.click(trigger);
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            fireEvent.keyDown(trigger, { key: "Escape" });

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("should close popover on Escape key when content is focused", () => {
            const onOpenChange = jest.fn();

            render(
                <Popover open={true} onOpenChange={onOpenChange}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <button>Focusable button</button>
                    </PopoverContent>
                </Popover>
            );

            const dialog = screen.getByRole("dialog");

            act(() => {
                jest.runAllTimers();
            });

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it("should return focus to trigger after closing with Escape", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <button>Focusable button</button>
                    </PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button", { name: "Open popover" });

            fireEvent.click(trigger);
            const dialog = screen.getByRole("dialog");

            act(() => {
                jest.runAllTimers();
            });

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(trigger).toHaveFocus();
        });

        it("should not close popover on non-Escape keys", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");

            fireEvent.click(trigger);
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            fireEvent.keyDown(trigger, { key: "Enter" });
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            fireEvent.keyDown(trigger, { key: "Tab" });
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });

    describe("Focus management", () => {
        it("should focus container on open (with firstOrContainer fallback)", () => {
            // The Popover uses initialFocusElement: "firstOrContainer", which focuses
            // the first focusable element OR the container. Due to requestAnimationFrame
            // timing, the container gets focus first in jsdom environment
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <button data-testid="first-focusable">First</button>
                        <button>Second</button>
                    </PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button", { name: "Open popover" }));

            act(() => {
                jest.runAllTimers();
            });

            // Focus goes to dialog container which is focusable via tabindex=-1
            expect(screen.getByRole("dialog")).toHaveFocus();
        });

        it("should focus container when no focusable elements exist", () => {
            render(
                <Popover>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <p>Non-focusable content</p>
                    </PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button", { name: "Open popover" }));

            act(() => {
                jest.runAllTimers();
            });

            expect(screen.getByRole("dialog")).toHaveFocus();
        });

        it("should set aria-modal=true when trapFocus is enabled, indicating modal behavior", () => {
            // When trapFocus is true, the popover becomes modal-like with focus trapped inside.
            // This is verified by aria-modal="true" being set on the dialog.
            // Testing the actual focus trap loop behavior in jsdom is unreliable due to 
            // jsdom's limited focus management, but we can verify the ARIA attributes
            // that indicate the intended behavior.
            render(
                <Popover trapFocus={true} open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <button data-testid="first">First</button>
                        <button data-testid="last">Last</button>
                    </PopoverContent>
                </Popover>
            );

            const dialog = screen.getByRole("dialog");

            // aria-modal=true indicates focus should be trapped within the dialog
            expect(dialog).toHaveAttribute("aria-modal", "true");

            // Both focusable elements should be present and accessible
            expect(screen.getByTestId("first")).toBeInTheDocument();
            expect(screen.getByTestId("last")).toBeInTheDocument();
        });

        it("should close popover on Tab out when trapFocus is false", () => {
            render(
                <Popover trapFocus={false}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <button data-testid="only-button">Only button</button>
                    </PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button", { name: "Open popover" }));

            act(() => {
                jest.runAllTimers();
            });

            const onlyButton = screen.getByTestId("only-button");
            onlyButton.focus();

            fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    describe("ARIA attributes", () => {
        describe("Trigger", () => {
            it("should have aria-haspopup=dialog", () => {
                render(
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "dialog");
            });

            it("should have aria-expanded=false when closed", () => {
                render(
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
            });

            it("should have aria-expanded=true when open", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
            });

            it("should not have aria-controls when closed", () => {
                render(
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).not.toHaveAttribute("aria-controls");
            });

            it("should have aria-controls pointing to dialog when open", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                const trigger = screen.getByRole("button");
                const dialog = screen.getByRole("dialog");

                expect(trigger).toHaveAttribute("aria-controls", dialog.id);
            });

            it("should have type=button", () => {
                render(
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).toHaveAttribute("type", "button");
            });

            it("should have an id for reference", () => {
                render(
                    <Popover>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("button")).toHaveAttribute("id");
                expect(screen.getByRole("button").id).toBeTruthy();
            });
        });

        describe("Content", () => {
            it("should have role=dialog", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).toBeInTheDocument();
            });

            it("should have an id", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).toHaveAttribute("id");
                expect(screen.getByRole("dialog").id).toBeTruthy();
            });

            it("should have tabIndex=-1 for programmatic focus", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).toHaveAttribute("tabindex", "-1");
            });

            it("should not have aria-modal when trapFocus is false", () => {
                render(
                    <Popover open={true} trapFocus={false}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
            });

            it("should have aria-modal=true when trapFocus is true", () => {
                render(
                    <Popover open={true} trapFocus={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
            });

            it("should not have aria-labelledby when no PopoverTitle is present", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
            });

            it("should have aria-labelledby pointing to PopoverTitle when present", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>
                            <PopoverTitle>Dialog Title</PopoverTitle>
                            <p>Content</p>
                        </PopoverContent>
                    </Popover>
                );

                const dialog = screen.getByRole("dialog");
                const title = screen.getByText("Dialog Title");

                expect(dialog).toHaveAttribute("aria-labelledby", title.id);
            });
        });

        describe("Title", () => {
            it("should render as h3 by default", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>
                            <PopoverTitle>Dialog Title</PopoverTitle>
                        </PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Dialog Title");
            });

            it("should render as custom heading level", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>
                            {/* @ts-expect-error - Testing runtime behavior with h2 */}
                            <PopoverTitle as="h2">Dialog Title</PopoverTitle>
                        </PopoverContent>
                    </Popover>
                );

                expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Dialog Title");
            });

            it("should have an id for aria-labelledby reference", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>
                            <PopoverTitle>Dialog Title</PopoverTitle>
                        </PopoverContent>
                    </Popover>
                );

                expect(screen.getByText("Dialog Title")).toHaveAttribute("id");
            });

            it("should pass custom props", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>
                            <PopoverTitle className="custom-title" data-testid="title">
                                Dialog Title
                            </PopoverTitle>
                        </PopoverContent>
                    </Popover>
                );

                expect(screen.getByTestId("title")).toHaveClass("custom-title");
            });
        });

        describe("Arrow", () => {
            it("should have aria-hidden on arrow", () => {
                render(
                    <Popover open={true}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                );

                const arrow = screen.getByRole("dialog").querySelector("[aria-hidden]");
                expect(arrow).toHaveAttribute("aria-hidden", "true");
            });
        });
    });

    describe("Controlled mode", () => {
        it("should respect controlled open state", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("should respect controlled closed state", () => {
            render(
                <Popover open={false}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button"));

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("should call onOpenChange when popover opens", () => {
            const onOpenChange = jest.fn();

            render(
                <Popover onOpenChange={onOpenChange}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            fireEvent.click(screen.getByRole("button"));

            expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        it("should call onOpenChange when popover closes via toggle", () => {
            const onOpenChange = jest.fn();

            render(
                <Popover onOpenChange={onOpenChange}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");

            fireEvent.click(trigger);
            fireEvent.click(trigger);

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it("should call onOpenChange when popover closes via Escape", () => {
            const onOpenChange = jest.fn();

            render(
                <Popover onOpenChange={onOpenChange}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");

            fireEvent.click(trigger);
            fireEvent.keyDown(trigger, { key: "Escape" });

            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });

        it("should call onOpenChange when popover closes via click outside", () => {
            const onOpenChange = jest.fn();

            render(
                <div>
                    <button data-testid="outside">Outside</button>
                    <Popover onOpenChange={onOpenChange}>
                        <PopoverTrigger>Open popover</PopoverTrigger>
                        <PopoverContent>Popover content</PopoverContent>
                    </Popover>
                </div>
            );

            fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
            fireEvent.mouseDown(screen.getByTestId("outside"));

            act(() => {
                jest.runAllTimers();
            });

            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe("ID association", () => {
        it("should have matching IDs between trigger aria-controls and dialog id", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>Popover content</PopoverContent>
                </Popover>
            );

            const trigger = screen.getByRole("button");
            const dialog = screen.getByRole("dialog");

            expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
        });

        it("should have matching IDs between PopoverTitle and dialog aria-labelledby", () => {
            render(
                <Popover open={true}>
                    <PopoverTrigger>Open popover</PopoverTrigger>
                    <PopoverContent>
                        <PopoverTitle>Title</PopoverTitle>
                        <p>Content</p>
                    </PopoverContent>
                </Popover>
            );

            const dialog = screen.getByRole("dialog");
            const title = screen.getByText("Title");

            expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
        });
    });
});
