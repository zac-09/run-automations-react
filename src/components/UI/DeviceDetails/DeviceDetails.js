import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DeviceDetails.module.scss";
import ReactExport from "react-data-export";
import DataTable from "react-data-table-component";
import IconButton from "../IconButton/IconButton";
import moment from "moment";
import { getDeviceLogs } from "../../../store/actions/device";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const customStyles = {
  headCells: {
    style: {
      fontSize: "1.9rem",
      fontWeight: 700,
      color: "#25bcf3",
      "font-weight": "bold",
    },
  },
};
const columns = [
  {
    name: "voltage",
    selector: "voltage",
    sortable: true,
  },
  {
    name: "current",
    selector: "current",
    sortable: true,
  },
  {
    name: "power",
    selector: "power",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.5rem" }}>{row.power.toFixed(2)}</div>
      </div>
    ),
  },
  {
    name: "date_logged",
    selector: "createdAt",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.4rem" }}>
          {moment(row.createdAt).format("LLL")}
        </div>
      </div>
    ),
  },
];
const DeviceDetails = (props) => {
  const deviceData = props.deviceData;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.devices.deviceLogs);
  console.log("device data from device details", data);

  let deviceStatusClasses;
  if (deviceData !== null && deviceData !== undefined) {
    deviceStatusClasses =
      deviceData.status === "active"
        ? styles["device__activity__status--active"]
        : styles["device__activity__status--deactive"];
  }
  useEffect(() => {
    dispatch(getDeviceLogs(deviceData.device_imei));
  }, [dispatch, deviceData.device_imei]);
  return (
    <div className={styles["container"]}>
      <div className={styles["device"]}>
        <div>
          <span>
            Name:{" "}
            <span className={styles["device-name"]}>
              {deviceData.device_name}
            </span>
          </span>
        </div>
        <div>
          <span>
            Serial Number:{" "}
            <span className={styles["device-name"]}>
              {deviceData.device_imei}
            </span>
          </span>
        </div>
        <div>
          <span>
            Location:{" "}
            <span className={styles["device-name"]}>{deviceData.location}</span>
          </span>
        </div>
        <div>
          <span>
            Status:{" "}
            <div className={deviceStatusClasses}>
              <span>{deviceData.status}</span>
            </div>
          </span>
        </div>
      </div>
      <div className={styles["btn-container"]}>
        <ExcelFile
          element={
            <IconButton
              icon="export"
              label="export data"
              style={styles["export__btn"]}
              iconStyle={styles["export__btn--icon"]}
            />
          }
        >
          <ExcelSheet data={data} name={`${deviceData.device_imei}`}>
            <ExcelColumn label="Voltage " value="voltage" />
            <ExcelColumn label=" Current" value="current" />

            <ExcelColumn label="Power" value="power" />
            <ExcelColumn label="date_logged" value="createdAt" />

          </ExcelSheet>
        </ExcelFile>
      </div>

      <div className={styles["content"]}>
        <div className={styles["table__container"]}>
          <DataTable
            title=""
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination={true}
            highlightOnHover={true}
            // clearSelectedRows={clearSelectedRows}
            // expandableRows

            keyField="device_imei"
            noDataComponent="no logs found "
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
