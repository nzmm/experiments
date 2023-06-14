import { useRef, useState } from "react";
import { Popover } from "./Popover";

const BG_STYLE = {
  width: "60%",
  height: "300px",
  borderRadius: 4,
  border: "1px solid gray",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ddd"
};

export default {
  title: "React/Popover",
  component: Popover,
  argTypes: {}
};

export const Resizable = {
  args: {},
  render: () => {
    return (
      <div style={BG_STYLE}>
        <Popover arrowOffset={0.75} show>
          <textarea
            rows={10}
            cols={25}
            defaultValue="Some interesting text in a popover... 😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 ... and some emoji's"
          ></textarea>
        </Popover>
      </div>
    );
  }
};

export const Anchored = {
  args: {},
  render: () => {
    const anchor = useRef<HTMLButtonElement>(null);
    return (
      <div style={BG_STYLE}>
        <Popover anchor={anchor} show>
          Some popover content further explaining things...
        </Popover>

        <div>
          A span element to{" "}
          <span ref={anchor}>
            <u>anchor things</u>
          </span>{" "}
          by.
        </div>
      </div>
    );
  }
};

export const Toggle = {
  args: {},
  render: () => {
    const [show, setShow] = useState(false);
    const anchor = useRef<HTMLButtonElement>(null);
    return (
      <div style={BG_STYLE}>
        <Popover anchor={anchor} show={show}>
          Some popover content
        </Popover>

        <button ref={anchor} onClick={() => setShow(!show)}>
          Popover toggle
        </button>
      </div>
    );
  }
};
