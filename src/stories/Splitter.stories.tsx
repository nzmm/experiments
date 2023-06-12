import { Splitter } from "./Splitter";

const SPLIT_STYLE = { height: 300, border: "1px solid gray", borderRadius: 4 };
const SIDE_STYLE = {
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center"
};

const Side = ({ label = "" }) => {
  return <div style={SIDE_STYLE}>{label}</div>;
};

export default {
  title: "React/Splitter",
  component: Splitter,
  argTypes: {}
};

export const Vertical = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="vertical">
          <Side label="Left content" />
          <Side label="Right content" />
        </Splitter>
      </div>
    );
  }
};

export const Horizontal = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="horizontal">
          <Side label="Upper content" />
          <Side label="Lower content" />
        </Splitter>
      </div>
    );
  }
};

export const Nested = {
  args: {},
  render: () => {
    return (
      <div style={SPLIT_STYLE}>
        <Splitter orientation="vertical" initialPosition="30%">
          <Splitter orientation="horizontal" initialPosition="30%">
            <Side label="Upper left content" />
            <Side label="Lower left content" />
          </Splitter>

          <Splitter orientation="horizontal" initialPosition="60%">
            <Side label="Upper right content" />
            <Side label="Lower right content" />
          </Splitter>
        </Splitter>
      </div>
    );
  }
};
