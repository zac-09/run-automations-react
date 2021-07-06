import React from "react";
import styles from "./IconButton.module.scss";
import sprite from "./../../assets/sprite.svg";

const IconButton = (props) => {
  return (
    <button
      className={`${styles["btn"]} ${props.style}`}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
    >
      <svg className={`${styles["btn__icon"]} ${props.iconStyle}`}>
        <use href={`${sprite}#icon-${props.icon}`}></use>
      </svg>
      <a href="#">{props.label}</a>
    </button>
  );
};

export default IconButton;
