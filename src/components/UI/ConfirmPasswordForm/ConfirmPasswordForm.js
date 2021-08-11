import styles from "./ConfirmPasswordForm.module.scss";
import IconButton from "../IconButton/IconButton";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useInput from "../../../hooks/use-input";
import { useDispatch } from "react-redux";
import {  useState } from "react";
import { confirmPassword } from "../../../store/actions/device";
const validatePassword = (name) => name.trim() !== "";

const ConfirmPasswordForm = (props) => {
  const {
    value: password,
    hasError: passwordHasError,
    isValid: passwordIsValid,
  
    valueChangeHandler: passwordValueChangeHandler,
    inputBlurHandler: passwordInputBlurChnageHandler,
  } = useInput(validatePassword);
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);

  const submitFormHandler = async () => {
    if (!passwordIsValid) {
      return;
    }
    setIsLoading(true);
    try {  
      setTimeout(async () => {
        await dispatch(confirmPassword(password));
        setIsLoading(false);

        props.onClose();

        props.onDeleteDevices();
      }, 2000);
    } catch (errr) {
      setIsLoading(false);
    }
    // setIsLoading(false);
  };
  return (
    <form className={styles["form"]} onSubmit={submitFormHandler}>
      <div className={styles["form-group"]}>
        <label htmlFor="name" className={styles["form__label"]}>
          please confirm with your password:
        </label>
        <input
          id="name"
          className={styles["form__input"]}
          type="password"
          value={password}
          onChange={passwordValueChangeHandler}
          onBlur={passwordInputBlurChnageHandler}
          required
        />
        {passwordHasError && (
          <span className={styles["error"]}>password can't be empty</span>
        )}
      </div>

      {!loading && (
        <IconButton
          onClick={submitFormHandler}
          label="Confirm "
          icon="checkmark"
          style={styles["form__btn"]}
          type="submit"
          //   disabled={!formIsValid}
          //   disabled={true}
        />
      )}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LoadingSpinner />
        </div>
      )}
    </form>
  );
};

export default ConfirmPasswordForm;
