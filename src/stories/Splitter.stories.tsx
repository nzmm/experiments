import { Splitter } from "./Splitter";

const LeftContent = () => {
  return <div>Left content</div>;
};

const RightContent = () => {
  return <div>Right content</div>;
};

export default {
  title: "React/Splitter",
  component: Splitter,
  argTypes: {}
};

export const Example = {
  args: {},
  render: () => {
    return (
      <div style={{ height: 300, border: "1px solid gray", borderRadius: 4 }}>
        <Splitter left={LeftContent} right={RightContent} />
      </div>
    );
  }
};
