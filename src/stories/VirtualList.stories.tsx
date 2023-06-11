import { VirtualList, ListItemRenderer } from "./VirtualList";

const VL_STYLE = {
  height: "80vh",
  width: "50vw",
  maxHeight: "500px",
  border: "1px solid gray"
};

const LI_STYLE = {
  height: "100%",
  width: "100%",
  margin: 0,
  borderBottom: "1px dashed #999"
};

const createItems = (variableHeight: boolean, n: number) => {
  n = isNaN(n) ? 20 : n;
  n = Math.max(0, Math.min(n, 100_000));
  return Array(n)
    .fill(null)
    .map((_, i) => {
      return {
        label: `Item ${i + 1}`,
        height: variableHeight ? Math.floor(60 + Math.random() * 60) : 60
      };
    });
};

const ListItem: ListItemRenderer<{
  label: string;
  height: number;
}> = ({ label }) => {
  return <div style={LI_STYLE}>{label}</div>;
};

export default {
  title: "React/VirtualList",
  component: VirtualList,
  argTypes: {
    itemCount: {
      control: {
        type: "number",
        min: 0,
        max: 100_000,
        step: 1
      }
    }
  }
};

export const Test = {
  args: {
    itemCount: 20,
    variableHeight: false
  },
  render: (args: { variableHeight: boolean; itemCount: number }) => {
    const items = createItems(args.variableHeight, args.itemCount);
    return (
      <>
        <h3>VirtualList</h3>
        <div style={VL_STYLE}>
          <VirtualList items={items} renderer={ListItem} />
        </div>
        <small>Stuff below</small>
      </>
    );
  }
};
