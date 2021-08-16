import styles from "./Signup.module.scss";
import SVG from "./../../../assets/setup.svg";
import wellDone from "./../../../assets/well_done.svg";

import useInput from "../../../hooks/use-input";
import { useState } from "react";
import Modal from "../../../components/UI/Modal/Modal";
import ImagePicker from "../../../components/UI/ImagePicker/ImagePicker";
import placeholder from "../../../assets/profile_pic.svg";
import sprite from "../../../assets/sprite.svg";
import IconButton from "../../../components/UI/IconButton/IconButton";
import InlineButton from "../../../components/UI/InlineButton/InlineButton";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import FormButton from "../../../components/UI/FormButton/FormButton";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../../store";
import { signup } from "../../../store/actions/auth";
import { Fragment } from "react";

const validateEmail = (email) => email.trim() !== "" && email.includes("@");
const validatePassword = (password) =>
  password.trim() !== "" && password.length >= 5;
const validateName = (name) => name.trim() !== "";
const Signup = (props) => {
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
  const {
    value: nameValue,
    hasError: nameHasError,
    inputBlurHandler: nameInputBlurHandler,
    valueChangeHandler: nameValueChangeHandler,

    isValid: nameIsValid,
  } = useInput(validateName);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(placeholder);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);
  const onCloseImageModal = () => {
    setIsImageModalOpen(false);
  };
  const onOpenImageModal = () => {
    setIsImageModalOpen(true);
  };
  const onSelectUserPhoto = (photo) => {
    setUserPhoto(photo);
    onCloseImageModal();
  };
  const [registrationSucessful, setIsRegSuccessful] = useState(false);
  let formIsValid = nameIsValid && emailIsValid && passwordIsValid;
  const submitFormHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!formIsValid) {
      dispatch(
        notificationActions.showAlert({
          type: "error",
          message: "Please check the form for errors",
        })
      );
      setIsLoading(false);

      return;
    }
    try {
      setIsLoading(true);
      await dispatch(signup(emailValue, passwordValue, nameValue, userPhoto));
      dispatch(
        notificationActions.showCardNotification({
          type: "success",
          message: "Account created successfully please login to continue",
          title: "success",
        })
      );
      setIsLoading(false);
      setTimeout(() => {
        history.push("/");
      }, 3000);
      setTimeout(() => {
        dispatch(notificationActions.hideCardNotification());
      }, 4000);

      setIsRegSuccessful(true);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles["container"]}>
      <Fragment>
        <div className={styles["form__container"]}>
          {!registrationSucessful ? (
            <Fragment>
              <div className={styles["form"]}>
                <p className={styles["form__title"]}>Sign Up</p>
                <p className={styles["form__sub-title"]}>
                  Let's get you set up
                </p>

                <form
                  action=""
                  className={styles["form-group"]}
                  onSubmit={submitFormHandler}
                >
                  <div
                    className={styles["img-container"]}
                    onClick={onOpenImageModal}
                  >
                    <img src={userPhoto} className={styles["user-img"]} />
                    <div className={styles["icon-container"]}>
                      <svg
                        class={styles["user-icon"]}
                        onClick={onOpenImageModal}
                      >
                        <use href={`${sprite}#icon-camera`}></use>
                      </svg>
                    </div>
                  </div>
                  <div className={styles["text-inputs"]}>
                    <div className={styles["input-group"]}>
                      <label htmlFor="email" className={styles["label"]}>
                        Email:
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={styles["input"]}
                        value={emailValue}
                        onChange={emailValueChangeHandler}
                        onBlur={emailInputBlurHandler}
                        required
                      />
                      {emailHasError && (
                        <span className={styles["error"]}>
                          Please provide a valid email
                        </span>
                      )}
                    </div>
                    <div className={styles["input-group"]}>
                      <label htmlFor="name" className={styles["label"]}>
                        Name:
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={styles["input"]}
                        value={nameValue}
                        onChange={nameValueChangeHandler}
                        onBlur={nameInputBlurHandler}
                        required
                      />
                      {nameHasError && (
                        <span className={styles["error"]}>
                          Please provide a name
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles["password-inputs"]}>
                    <div className={styles["password-input-group"]}>
                      <label htmlFor="password" className={styles["label"]}>
                        password:
                      </label>
                      <input
                        id="password"
                        type="password"
                        className={styles["input"]}
                        value={passwordValue}
                        onChange={passwordValueChangeHandler}
                        onBlur={passwordInputBlurHandler}
                        required
                      />
                      {passwordHasError && (
                        <span className={styles["error"]}>
                          Please provide a password longer than 5 characters
                        </span>
                      )}
                    </div>
                  </div>
                  {!loading && (
                    <FormButton
                      style={styles["form__container__btn"]}
                      title="register"
                    />
                  )}
                  {loading && (
                    <LoadingSpinner
                      style={styles["form__container__spinner"]}
                    />
                  )}
                </form>
              </div>

              <div className={styles["illustration"]}>
                <img src={SVG} alt="" className={styles["svg"]} />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <img src={wellDone} className={styles["well-done"]} />
            </Fragment>
          )}
        </div>
        {isImageModalOpen && (
          <Modal onClose={onCloseImageModal} style={styles["image__modal"]}>
            <div className={styles["form__heading"]}>
              <sapn>Take a Selfie!</sapn>
              <svg class={styles["close"]} onClick={onCloseImageModal}>
                <use href={`${sprite}#icon-cross`}></use>
              </svg>
            </div>

            <ImagePicker onSave={onSelectUserPhoto} />
          </Modal>
        )}
      </Fragment>
    </div>
  );
};

export default Signup;
