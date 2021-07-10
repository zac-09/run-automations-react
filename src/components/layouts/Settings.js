import styles from "./Settings.module.scss";
import Switch from "@material-ui/core/Switch";
import { useDispatch, useSelector } from "react-redux";
import { darkModeOn } from "../../store/reducers/darkMode";

const Settings = (props) => {
  const dispatch = useDispatch();

  const bgColor = useSelector(state => state.darkMode.backgroundColor)

  const darkModeHandler = () => {
    if(bgColor === '#f4f2f2'){
      dispatch(darkModeOn({backgroundColor: 'black', color: 'white'}))
      }else{
        dispatch(darkModeOn({backgroundColor: '#f4f2f2', color: 'black'}))
      }
  };

  return (
    <div>
      <div className={styles["device__activity__switch"]}>
        <div>
          <span className={styles["device__activity__relay"]}>Dark mode</span>
        </div>
        <Switch
        onChange={darkModeHandler}
        />
      </div>
    </div>

  );
};

export default Settings;
