import { useEffect, useRef, useState } from "react";
import Modal from "./../UI/Modal";
import styles from "./Device.module.scss";
import InlineButton from "./../UI/InlineButton";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import sprite from "./../../assets/sprite.svg";
import AddDeviceForm from "../UI/AddDeviceForm";
import IconButton from "./../UI/IconButton";
import ReactExport from "react-data-export";
import { getAllUserDevices, deleteDevice } from "./../../store/actions/device";
import LoadingSpinner from "./../UI/LoadingSpinner";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const customStyles = {
  headCells: {
    style: {
      fontSize: "1.8rem",
      "font-weight": 700,
      color: "#25bcf3",
    },
  },
};
const columns = [
  {
    name: "device_imei",
    selector: "device_imei",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.4rem" }}>{row.device_imei}</div>
      </div>
    ),
  },
  {
    name: "Device_name",
    selector: "device_name",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.5rem" }}>{row.device_name}</div>
      </div>
    ),
  },
  {
    name: "date_registered",
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
  {
    name: "status",
    selector: "status",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div
          className={
            row.status === "active"
              ? styles["device__activity__status--active"]
              : styles["device__activity__status--deactive"]
          }
        >
          {row.status}
        </div>
      </div>
    ),
  },
];

const Devices = (props) => {
  const dispatch = useDispatch();
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [devicesToDelete, setDevicesToDelete] = useState([]);
  const data = useSelector((state) => state.devices.devices);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addDeviceModalVisible, setAddModalVisible] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  // const [devicesData, setDevicesData] = useState(
  //   useSelector((state) => state.devices.devices)
  // );
  const newData = data.filter((device) => {
    return device.device_name.search(searchParam) > -1;
  });

  const onAddDeviceHandler = () => {
    setAddModalVisible(true);
  };
  const onCloseModal = () => {
    setAddModalVisible(false);
  };
  const onSubmitFormHandler = (name, location, type) => {
    console.log("form sucessfully submited", name, location, type);
  };
  useEffect(() => {
    dispatch(getAllUserDevices());
  }, []);
  const onRowSelected = (rowsStatus) => {
    if (rowsStatus.selectedCount > 0) {
      setIsRowSelected(true);
    } else {
      setIsRowSelected(false);
    }

    setDevicesToDelete(rowsStatus.selectedRows);

    console.log("the rows are", rowsStatus);
  };
  const deleteDevicesHandler = () => {
    if (!devicesToDelete || devicesToDelete.length === 0) {
      return;
    }
    try {
      setIsDeleting(true);
      setTimeout(() => {
        devicesToDelete.forEach((device) => {
          dispatch(deleteDevice(device.device_imei));
        });
        setIsDeleting(false);
        setClearSelectedRows(true);
      }, 4000);
    } catch (err) {
      setIsDeleting(false);
    }
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["container__header"]}>
        {/* <div className={styles["container__header--title"]}>
          <span>Devices</span>
        </div> */}
        {!isRowSelected && (
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
            <ExcelSheet data={data} name="Employees">
              <ExcelColumn label="Device Name" value="device_name" />
              <ExcelColumn label="Device Imei" value="device_imei" />
              <ExcelColumn label="Date Registered" value="createdAt" />
              <ExcelColumn label="status" value="status" />
              {/* <ExcelColumn label="device type" value="device_type" />
            <ExcelColumn label="device location" value="location" /> */}
            </ExcelSheet>
          </ExcelFile>
        )}

        <div className={styles["container__input__container"]}>
          <input
            className={styles["container__input__container--input"]}
            placeholder="search device by name"
            onChange={(e) => {
              setSearchParam(e.target.value);
            }}
          />
          <svg class={styles["container__input__container--icon"]}>
            <use href={`${sprite}#icon-search`}></use>
          </svg>
        </div>

        <div className={styles["container__header--btn"]}>
          {isRowSelected && !isDeleting && (
            <IconButton
              icon="bin"
              label="delete device"
              style={styles["delete__btn"]}
              iconStyle={styles["delete__btn--icon"]}
              onClick={deleteDevicesHandler}
            />
          )}
          <InlineButton label="register device" onClick={onAddDeviceHandler} />
        </div>
      </div>
      <div className={styles["table__container"]}>
        {!isDeleting && (
          <DataTable
            title=""
            columns={columns}
            data={newData}
            selectableRows
            customStyles={customStyles}
            pagination={true}
            highlightOnHover={true}
            clearSelectedRows={clearSelectedRows}
            // expandableRows
            keyField="device_imei"
            noDataComponent="no devices found "
            onSelectedRowsChange={onRowSelected}
          />
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isDeleting && <LoadingSpinner />}
        </div>
      </div>
      {addDeviceModalVisible && (
        <Modal onClose={onCloseModal}>
          <div className={styles["form__heading"]}>
            <sapn>Register new device</sapn>
            <svg class={styles["close"]} onClick={onCloseModal}>
              <use href={`${sprite}#icon-cross`}></use>
            </svg>
          </div>
          <AddDeviceForm
            onSubmit={onSubmitFormHandler}
            onClose={onCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Devices;
