import React, { Fragment, useState } from "react";
import styles from "./SignIn.module.scss";
import logo from "./../../../assets/newlogo.png";
import FormButton from "../../../components/UI/FormButton/FormButton";
import { useDispatch } from "react-redux";
import { login } from "../../../store/actions/auth";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import useInput from "../../../hooks/use-input";
import { Link } from "react-router-dom";
const validateEmail = (email) => email.trim() !== "";
const validatePassword = (password) => password.trim() !== "";
const SignIn = (props) => {
  const {
    value: emailValue,
    hasError: emailHasError,
    inputBlurHandler: emailInputBlurHandler,
    valueChangeHandler: emailValueChangeHandler,

    isValid: emailIsValid,
  } = useInput(validateEmail);
  const {
    value: passwordValue,
    hasError: passwordHasError,
    inputBlurHandler: passwordInputBlurHandler,
    valueChangeHandler: passwordValueChangeHandler,

    isValid: passwordIsValid,
  } = useInput(validatePassword);

  const history = useHistory();

  const [loading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const formIsValid = emailIsValid && passwordIsValid;
  const submitHandler = async (event) => {
    if (!formIsValid) {
      return;
    }
    event.preventDefault();
    try {
      setIsLoading(true);
      await dispatch(login(emailValue, passwordValue));
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
        <img
          src={logo}
          className={styles["container__logo"]}
          alt="company logo"
        />
        <div className={styles["form__container"]}>
          <h1 className={styles["form__container__heading"]}>Sign in</h1>
          <form
            className={styles["form__container__form"]}
            onSubmit={submitHandler}
          >
            <div className={styles["form__container__group"]}>
              <input
                onChange={emailValueChangeHandler}
                value={emailValue}
                onBlur={emailInputBlurHandler}
                id="email"
                type="email"
                placeholder="Email"
                className={styles["form__container__input"]}
              />
              <label for="email" className={styles["form__container__label"]}>
                Email
              </label>
              {emailHasError && (
                <span className={styles["error"]}>
                  Please provide a valid email
                </span>
              )}
            </div>
            <div className={styles["form__container__group"]}>
              <input
                onChange={passwordValueChangeHandler}
                value={passwordValue}
                onBlur={passwordInputBlurHandler}
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
              {passwordHasError && (
                <span className={styles["error"]}>
                  please provide valid password
                </span>
              )}
            </div>

            <div className={styles["register_container"]}>
              <p>
                Don't have an account?
                <Link to="/register" style={{ textDecoration: "none" ,marginLeft:".5rem",color:"#25bcf3"}}>
                  <span>Signup</span>
                </Link>
              </p>
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
