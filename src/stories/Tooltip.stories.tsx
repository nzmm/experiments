import { useRef } from "react";
import { Tooltip as Tip } from "./Tooltip";

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
  component: Tip,
  argTypes: {}
};

export const Tooltip = {
  args: {},
  render: () => {
    return (
      <div style={BG_STYLE}>
        <Tip
          id="yay"
          text="A very elaborate explanation about a thing!"
          as="p"
        >
          Some text with a tooltip to make things clearer (?)
        </Tip>
      </div>
    );
  }
};
