import { Fragment, useEffect, useState } from "react";
import styles from "./AddDeviceForm.module.scss";
import IconButton from "./../../UI/IconButton/IconButton";
import LoadingSpinner from "./../LoadingSpinner/LoadingSpinner";
import useInput from "../../../hooks/use-input";
import { useDispatch, useSelector } from "react-redux";
import { addDevice } from "../../../store/actions/device";
import DeviceSvg from "./../../../assets/circuit.svg";
import Select, { components } from "react-select";

import { getAllDistricts } from "../../../store/actions/auth";
const validateDeviceName = (name) => name.trim() !== "";

const Control = ({ children, ...props }) => {
  const { emoji, onEmojiClick } = props.selectProps;
  const style = { cursor: "pointer", marginLeft: "1.2rem" };

  return (
    <components.Control {...props}>
      <span onMouseDown={onEmojiClick} style={style}>
        {emoji}
      </span>
      {children}
    </components.Control>
  );
};
const AddDeviceForm = (props) => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const districts = useSelector((state) => state.auth.districts);
  const [radio, setRadio] = useState("iot device");
  const [district, setDistrict] = useState("");
  const [districtHasEror, setDistrictHasError] = useState(false);
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

  const formIsValid = deviceNameIsValid && !districtHasEror;
  useEffect(() => { 
    dispatch(getAllDistricts());
    // console.log("the districts are", districts);
  }, [dispatch]);
  const submitFormHandler = (event) => {
    if (district.trim() === "") {
      setDistrictHasError(true);
    }
    event.preventDefault();
    console.log("successfully reached");
    if (!formIsValid) {
      return;
    }
    setIsLoading(true);
    try {
      dispatch(addDevice(Deivcename, district, radio));
      setTimeout(() => {
        setIsLoading(false);
        props.onClose();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
    }

    resetDeviceName();
  };
  const onDistrictChangeHandler = (option) => {
    setDistrict(option.value);
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
              className={styles["form__radio-input"]}
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

          <Select
            options={districts}
            className={styles["select"]}
            styles={styles}
            emoji={"📍"}
            components={{ Control }}
            placeholder={"select district"}
            noOptionsMessage={(message) => "no districts found"}
            onChange={onDistrictChangeHandler}
          />
          {districtHasEror && (
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
          <div
            style={{ display: "flex", marginTop: "2rem", marginLeft: "6.5rem" }}
          >
            <LoadingSpinner />
          </div>
        )}
      </form>
      <img src={DeviceSvg} className={styles["svg"]} alt="svg" />
    </Fragment>
  );
};

export default AddDeviceForm;
