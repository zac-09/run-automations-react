import React from "react";
import styles from "./FormButton.module.scss";
const FormButton = (props) => {
  return (
    <button className={`${styles["btn"]} ${props.style}`}>
      <span className={styles["btn--text"]}>{props.title}</span>
    </button>
  );
};

export default FormButton;
