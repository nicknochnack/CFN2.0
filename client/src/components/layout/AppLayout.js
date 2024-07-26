import { Fragment } from "react";

const AppLayout = (props) => {
  console.log("Logging out props from AppLayout.js");
  console.log(props);
  return (
    <Fragment title={props.title}>
      {<props.children {...props.data} />}
    </Fragment>
  );
};

export default AppLayout;
