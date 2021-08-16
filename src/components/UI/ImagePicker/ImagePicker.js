import styles from "./ImagePicker.module.scss";
import Webcam from "react-webcam";

import { useCallback, useRef, useState, Fragment } from "react";

import IconButton from "../IconButton/IconButton";
import InlineButton from "../InlineButton/InlineButton";
import { useFilePicker } from "use-file-picker";
import { useEffect } from "react";
const videoConstraints = {
  width: 380,
  height: 380,
  facingMode: "user",
};
const ImagePicker = (props) => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState("");

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },

    maxFileSize: 50,
  });
  useEffect(() => {
    filesContent.map((file, index) => {
      setPhoto(file.content);
    });
  }, [filesContent]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);
  const saveHandler = () => {
    props.onSave(photo);
  };
  return (
    <Fragment>
      <InlineButton
        label="upload from computer"
        icon="cloud-check"
        onClick={() => openFileSelector()}
        style={styles["btn-lib"]}
      />
      <div className={styles["webcam-container"]}>
        <Fragment>
          <div className={styles["img-container"]}>
            {photo == "" ? (
              <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={220}
                videoConstraints={videoConstraints}
              />
            ) : (
              <img src={photo} className={styles["user-img"]} />
            )}
          </div>
          {photo == "" ? (
            <IconButton
              styles={styles["btn"]}
              icon="camera"
              label="capture"
              onClick={() => {
                capture();
              }}
            />
          ) : (
            <Fragment>
              <IconButton
                styles={`${styles["btn"]}  ${styles["btn-done"]}`}
                icon="checkmark2"
                label="Done"
                onClick={() => {
                  setPhoto("");
                  saveHandler();
                }}
              />
              <IconButton
                styles={styles["btn"]}
                icon="loop2"
                label="retake"
                onClick={() => {
                  setPhoto("");
                }}
              />
            </Fragment>
          )}
        </Fragment>
      </div>
    </Fragment>
  );
};

export default ImagePicker;
