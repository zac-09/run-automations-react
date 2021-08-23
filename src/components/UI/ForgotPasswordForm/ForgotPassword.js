import styles from "./ForgotPassword.module.scss";
import FormButton from "../FormButton/FormButton";
import { useState } from "react";
import useInput from "../../../hooks/use-input";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../store/actions/auth";
const validateEmail = (email) => email.trim() !== "" && email.includes("@");

const ForgotPassword = (props) => {
  const [loading, setLoading] = useState(false);

  const {
    value: emailValue,
    hasError: emailHasError,
    inputBlurHandler: emailInputBlurHandler,
    valueChangeHandler: emailValueChangeHandler,

    isValid: emailIsValid,
  } = useInput(validateEmail);
  const dispatch = useDispatch();
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!emailIsValid) {
      return;
    }
    try {
      setLoading(true);
      await dispatch(forgotPassword(emailValue));
      setLoading(false);
      props.onClose();
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className={styles["form__container__group"]}>
          <div className={styles["descriptionText"]}>
            <p>
              Please fill in your email address and a link with details about
              how to reset your password will be immediately sent to your email
            </p>
          </div>
          <div className="">
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
        </div>
        {!loading && (
          <div className={styles["btn-container"]}>
            <FormButton
              style={styles["form__container__btn"]}
              title="reset password"
            />
          </div>
        )}

        {loading && (
          <div className={styles["btn-container"]}>
            <LoadingSpinner style={styles["form__container__spinner"]} />
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
