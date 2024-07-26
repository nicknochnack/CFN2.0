import { Fragment } from "react";

const MarketingLayout = (props) => {
  return (
    <Fragment title={props.title}>
      {<props.children {...props.data} />}
    </Fragment>
  );
};

export default MarketingLayout;
