import { Fragment, useState } from "react";
import styles from "./AddDeviceForm.module.scss";
import IconButton from "./../UI/IconButton";
import LoadingSpinner from "./LoadingSpinner";
import useInput from "../../hooks/use-input";
import { useDispatch } from "react-redux";
import { addDevice } from "../../store/actions/device";

const validateDeviceName = (name) => name.trim() !== "";
const validateLocationName = (location) => location.trim() !== "";

const AddDeviceForm = (props) => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [radio, setRadio] = useState("iot device");
  const radioChangeHandler = (event) => {
    console.log("the event is", event.target.value);
    setRadio(event.target.value);
  };
  const {
    value: Deivcename,
    hasError: deviceNameHasError,
    isValid: deviceNameIsValid,
    reset: resetDeviceName,
    valueChangeHandler: deviceNameValueChangeHandler,
    inputBlurHandler: deviceInputBlurChnageHandler,
  } = useInput(validateDeviceName);
  const {
    value: deviceLocation,
    hasError: deviceLocationHasError,
    isValid: deviceLocationIsValid,
    reset: resetDeviceLocation,
    valueChangeHandler: deviceLocationValueChangeHandler,
    inputBlurHandler: LocationInputBlurChnageHandler,
  } = useInput(validateLocationName);
  const formIsValid = deviceNameIsValid && deviceLocationIsValid;
  const submitFormHandler = (event) => {
    event.preventDefault();
    console.log("successfully reached");
    if (!formIsValid) {
      return;
    }
    setIsLoading(true);
    try {
      dispatch(addDevice(Deivcename, deviceLocation, radio));
      setTimeout(() => {
        setIsLoading(false);
        props.onClose();
      }, 3000);
    } catch (error) {
      setIsLoading(false);
    }
    // props.onSubmit(Deivcename, deviceLocation, radio);

    resetDeviceLocation();
    resetDeviceName();
  };

  return (
    <Fragment>
      <form className={styles["form"]} onSubmit={submitFormHandler}>
        <div className={styles["form-group"]}>
          <label htmlFor="name" className={styles["form__label"]}>
            Device name:
          </label>
          <input
            id="name"
            className={styles["form__input"]}
            value={Deivcename}
            onChange={deviceNameValueChangeHandler}
            onBlur={deviceInputBlurChnageHandler}
            required
          />
          {deviceNameHasError && (
            <span className={styles["error"]}>device name can't be empty</span>
          )}
        </div>
        <div className={styles["form-group"]} onChange={radioChangeHandler}>
          <label htmlFor="type" className={styles["form__label"]}>
            Device Type:
          </label>
          <div className={styles["form__radio-group"]}>
            <input
              id="electronic"
              type="radio"
              class={styles["form__radio-input"]}
              name="type"
              value="electronic appliance"
              checked={radio === "electronic appliance"}
            />
            <label htmlFor="electronic" className={styles["form__radio-label"]}>
              <span className={styles["form__radio-button"]}></span>
              electronic appliance
            </label>
          </div>
          <div className={styles["form__radio-group"]}>
            <input
              id="iot"
              type="radio"
              className={styles["form__radio-input"]}
              name="type"
              value="iot device"
              checked={radio === "iot device"}
            />
            <label htmlFor="iot" className={styles["form__radio-label"]}>
              <span className={styles["form__radio-button"]}></span>
              iot device
            </label>
          </div>
          <div className={styles["form__radio-group"]}>
            <input
              id="sewing"
              type="radio"
              className={styles["form__radio-input"]}
              name="type"
              value="sewing machine"
              checked={radio === "sewing machine"}
            />
            <label htmlFor="sewing" className={styles["form__radio-label"]}>
              <span className={styles["form__radio-button"]}></span>
              sewing machine
            </label>
          </div>
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="name" className={styles["form__label"]}>
            Location
          </label>
          <input
            id="name"
            className={styles["form__input"]}
            value={deviceLocation}
            onChange={deviceLocationValueChangeHandler}
            onBlur={LocationInputBlurChnageHandler}
            required
          />
          {deviceLocationHasError && (
            <span className={styles["error"]}>Location must be selected</span>
          )}
        </div>
        {!loading && (
          <IconButton
            onClick={submitFormHandler}
            label="add Device"
            icon="cloud-check"
            style={styles["form__btn"]}
            type="submit"
            disabled={!formIsValid}
            //   disabled={true}
          />
        )}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LoadingSpinner />
          </div>
        )}
      </form>
    </Fragment>
  );
};

export default AddDeviceForm;
