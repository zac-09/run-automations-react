import React from "react";
import sprite from "./../../../assets/sprite.svg";

import styles from "./InlineButton.module.scss";

const InlineButton = (props) => {
  return (
    <div className={`${styles["btn"]} ${props.style}`} onClick={props.onClick}>
      <svg class={styles["btn__icon"]}>
        <use href={`${sprite}#icon-plus`}></use>
      </svg>
      <a href="#">{props.label}</a>
    </div>
  );
};

export default InlineButton;
