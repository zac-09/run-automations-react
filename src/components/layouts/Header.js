import { Fragment } from "react";
import styles from "./Header.module.scss";
import user from "./../../assets/user-6.jpg";
import sprite from "./../../assets/sprite.svg";
const Header = (props) => {
  return (
    <Fragment>
      <header className={styles["header"]}>
        {/* <img src={logo} alt="header logo" className={styles["header__logo"]} /> */}
        <h2 className={styles["header__heading"]}>{props.title}</h2>
        <div className={styles["header__user-nav"]}>
          <div className={styles["header__user-nav--icon-box"]}>
            <svg className={styles["header__user-nav--icon"]}>
              <use href={`${sprite}#icon-message`}></use>
            </svg>
            <span className={styles["header__user-nav--notification"]}>0</span>
          </div>
          <div className={styles["header__user-nav--icon-box"]}>
            <svg className={styles["header__user-nav--icon"]}>
              <use href={`${sprite}#icon-bell `}></use>
            </svg>
            <span className={styles["header__user-nav--notification"]}>0</span>
          </div>

          <div className={styles["header__user-nav--user-nav"]}>
            <img
              className={styles["header__user-nav--user-photo"]}
              src={user}
              alt="header user"
            />
            <span class={styles["header__user-nav--user-name"]}>zac</span>
            <div className={styles["header__user--button"]}></div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
