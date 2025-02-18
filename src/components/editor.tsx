import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";
import { TooltipWrapper } from "./tooltip-wrapper";
import { cn } from "@/lib/utils";
import { FaBold } from "react-icons/fa";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSubmit,
  defaultValue = [],
  onCancel,
  placeholder = "Write something...",
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  /**
   * because changes in ref objects don't cause re-renders of the components,
   * we are storing prop values into ref objects to avoid passing
   * them into dependency array and to avoid unnecessary re-renders
   */
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link", { list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code", "code-block"],
        ],
        // toolbar: "#toolbar-container",
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: function () {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) {
                  return;
                }

                submitRef.current?.({
                  body: JSON.stringify(quill.getContents()),
                  image: addedImage,
                });

                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: function () {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    // to control quill from outside the "Editor" component
    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      setText(quill.getText());
    });

    // quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
    //   // onSelectionChangeRef.current?.(...args);
    // });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((prevState) => !prevState);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  // replace '\n' or any empty HTML tags for e.g <br /> or <p></p>, remove any white spaces and check for length
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />

        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <TooltipWrapper label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="absolute hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="!size-3.5" />
                </button>
              </TooltipWrapper>
              <Image
                src={URL.createObjectURL(image)}
                fill
                alt="Uploaded image"
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex px-2 pb-2 z-[5]">
          <TooltipWrapper
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
            side="top"
            align="center"
          >
            <Button
              disabled={disabled}
              size="icon-sm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa />
            </Button>
          </TooltipWrapper>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="icon-sm" variant="ghost">
              <SmileIcon />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <TooltipWrapper label="Image" side="top" align="center">
              <Button
                disabled={disabled}
                size="icon-sm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon />
              </Button>
            </TooltipWrapper>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                size="sm"
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
                disabled={disabled || isEmpty}
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <TooltipWrapper label="Send now" side="top" align="center">
              <Button
                disabled={disabled || isEmpty}
                size="icon-sm"
                className={cn(
                  "ml-auto",
                  isEmpty
                    ? "bg-white hover:bg-white text-muted-foreground"
                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                )}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
              >
                <MdSend />
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </div>

      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
