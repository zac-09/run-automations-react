import { Fragment, useState } from "react";
import styles from "./Sidebar.module.scss";
import sprite from "./../../assets/sprite.svg";
import logo from "./../../assets/logo-3.png";
import Button from "../Button";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/actions/auth";
import LoadingSpinner from "../UI/LoadingSpinner";
const Sidebar = () => {
  const [loading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    setIsLoading(true);
    await dispatch(logout());
    setIsLoading(false);
  };
  return (
    <Fragment>
      <div className={styles["side-bar"]}>
        <div className={styles["side-bar__logo-box"]}>
          <img
            alt="side bar logo"
            src={logo}
            className={styles["side-bar__logo"]}
          />
          <h2 className={styles["side-bar__heading"]}>Run Automations</h2>
          <span className={styles["side-bar__tag-line"]}>
            The best monitoring experience
          </span>
        </div>
        <ul className={styles["side-bar__list"]}>
          <li
            className={`${styles["side-bar__list--item"]}  ${styles["side-bar__list--item--active"]}`}
          >
            <NavLink
              to="/dashboard"
              activeClassName={styles["side-bar__list--link--active"]}
              href="#"
              className={styles["side-bar__list--link"]}
            >
              <svg class={styles["side-bar__icon"]}>
                <use href={`${sprite}#icon-dashboard`}></use>
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className={styles["side-bar__list--item"]}>
            <NavLink
              to="/devices"
              href="#"
              className={styles["side-bar__list--link"]}
              activeClassName={styles["side-bar__list--link--active"]}
            >
              <svg class={styles["side-bar__icon"]}>
                <use href={`${sprite}#icon-devices`}></use>
              </svg>
              <span>Devices</span>
            </NavLink>
          </li>
          <li className={styles["side-bar__list--item"]}>
            <NavLink
              to="/account"
              href="#"
              className={styles["side-bar__list--link"]}
              activeClassName={styles["side-bar__list--link--active"]}
            >
              <svg class={styles["side-bar__icon"]}>
                <use href={`${sprite}#icon-user`}></use>
              </svg>
              <span>account</span>
            </NavLink>
          </li>
          <li className={styles["side-bar__list--item"]}>
            <NavLink
              to="/settings"
              href="#"
              className={styles["side-bar__list--link"]}
              activeClassName={styles["side-bar__list--link--active"]}
            >
              <svg class={styles["side-bar__icon"]}>
                <use href={`${sprite}#icon-equalizer`}></use>
              </svg>
              <span>settings</span>
            </NavLink>
          </li>
          {!loading && (
            <div className={styles["logout"]} onClick={logoutHandler}>
              <Button label="logout" />
            </div>
          )}
          {loading && <LoadingSpinner />}
        </ul>
        <div className={styles["legal"]}>
          &copy; copyright run automations 2021
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
