import React, { Fragment, useState } from "react";
import styles from "./SignIn.module.scss";
import logo from "./../../assets/newlogo.png";
import FormButton from "../../components/UI/FormButton";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/auth";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
const SignIn = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setIsLoading] = useState(false);
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const dispatch = useDispatch();
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await dispatch(login(email, password));
      history.replace("/");

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("from compnent", error.message);
    }
  };
  return (
    <Fragment>
      <div className={styles["container"]}>
        <img src={logo} className={styles["container__logo"]} />
        <div className={styles["form__container"]}>
          <h1 className={styles["form__container__heading"]}>Sign in</h1>
          <form
            className={styles["form__container__form"]}
            onSubmit={submitHandler}
          >
            <div className={styles["form__container__group"]}>
              <input
                onChange={emailChangeHandler}
                value={email}
                id="email"
                type="email"
                placeholder="Email"
                className={styles["form__container__input"]}
              />
              <label for="email" className={styles["form__container__label"]}>
                Email
              </label>
            </div>
            <div className={styles["form__container__group"]}>
              <input
                onChange={passwordChangeHandler}
                value={password}
                id="password"
                type="password"
                placeholder="Password"
                className={styles["form__container__input"]}
              />
              <label
                for="password"
                className={styles["form__container__label"]}
              >
                Password
              </label>
            </div>
            {!loading && (
              <FormButton
                style={styles["form__container__btn"]}
                title="sign in"
              />
            )}
            {loading && (
              <LoadingSpinner style={styles["form__container__spinner"]} />
            )}
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SignIn;
