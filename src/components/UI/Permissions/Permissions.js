import React from "react";
import { Fragment } from "react";
const roles = {
  admin: ["create", "read", "update", "delete"],
  client: [],
};
const actions = ["create", "read", "update", "delete"];
const Permissions = (props) => {
  const { role, action, restrictTo } = props;
  const displayModule = role === restrictTo ? true : false;

  return (
    <Fragment>
      {displayModule && <Fragment> {props.children}</Fragment>}
    </Fragment>
  );
};

export default Permissions;
