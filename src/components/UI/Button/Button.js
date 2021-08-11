import React from "react";

import styles from "./Button.module.scss";

const Button = (props) => {
  return (
    // <div className={styles["btn"]}>
      <a href="#" className={`${styles["btn"]} ${props.style}`}>{props.label}</a>
    // </div>
  );
};

export default Button;
