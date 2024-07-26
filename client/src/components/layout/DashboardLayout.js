import { Fragment } from "react";

const DashboardLayout = (props) => {
  return (
    <Fragment title={props.title}>
      {<props.children {...props.data} />}
    </Fragment>
  );
};

export default DashboardLayout;
