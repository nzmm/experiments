import { Splitter } from "./Splitter";

const SPLIT_STYLE = { height: 300, border: "1px solid gray", borderRadius: 4 };

const Side = ({ label = "" }) => {
  return <div>{label}</div>;
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
        <Splitter orientation="vertical">
          <Splitter orientation="horizontal">
            <Side label="Upper left content" />
            <Side label="Lower left content" />
          </Splitter>
          <Splitter orientation="horizontal">
            <Side label="Upper right content" />
            <Side label="Lower right content" />
          </Splitter>
        </Splitter>
      </div>
    );
  }
};
