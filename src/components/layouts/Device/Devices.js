import { useEffect, useState } from "react";
import Modal from "./../../UI/Modal/Modal";
import styles from "./Device.module.scss";
import InlineButton from "./../../UI/InlineButton/InlineButton";
import moment from "moment";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import sprite from "./../../../assets/sprite.svg";
import AddDeviceForm from "../../UI/AddDeviceForm/AddDeviceForm";
import EditDeviceForm from "./../../UI/EditDeviceForm/EditDeviceForm";
import IconButton from "./../../UI/IconButton/IconButton";
import ReactExport from "react-data-export";
import {
  getAllUserDevices,
  deleteDevice,
} from "./../../../store/actions/device";
import LoadingSpinner from "./../../UI/LoadingSpinner/LoadingSpinner";
import ConfirmPasswordForm from "../../UI/ConfirmPasswordForm/ConfirmPasswordForm";
import DeviceDetails from "../../UI/DeviceDetails/DeviceDetails";
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
    name: "serial number",
    selector: "device_imei",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.3rem" }}>{row.device_imei}</div>
      </div>
    ),
  },
  {
    name: "name",
    selector: "device_name",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.4rem" }}>{row.device_name}</div>
      </div>
    ),
  },
  {
    name: "location",
    selector: "location",
    sortable: true,
    cell: (row) => (
      <div data-tag="allowRowEvents">
        <div style={{ fontSize: "1.5rem" }}>{row.location}</div>
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
  const [selectedDevices, setSelectedDevices] = useState([]);
  const data = useSelector((state) => state.devices.devices);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addDeviceModalVisible, setAddModalVisible] = useState(false);
  const [editDeviceModalVisible, setEditModalVisible] = useState(false);
  const [isShowDeviceDetails, setIsShowDeviceDetails] = useState(false);
  const [clickedDeviceData, setClickedDeviceData] = useState(null);
  const [deleteDeviceModalVisible, setDeleteModalVisible] = useState(false);

  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [isMultiSelect, setIsMultiselect] = useState(false);

  const newData = data.filter((device) => {
    return (
      device.device_name.toLowerCase().search(searchParam.toLowerCase()) > -1
    );
  });

  const closeDeviceDetailsModal = () => {
    setIsShowDeviceDetails(false);
  };
  const onAddDeviceHandler = () => {
    setAddModalVisible(true);
  };
  const onEditDeviceHandler = () => {
    setEditModalVisible(true);
  };
  const onCloseModal = () => {
    setAddModalVisible(false);
  };
  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false);
  };
  const onCloseEditModal = () => {
    setEditModalVisible(false);
  };

  const onSubmitFormHandler = (name, location, type) => {
    console.log("form sucessfully submited", name, location, type);
  };
  useEffect(() => {
    dispatch(getAllUserDevices());
  }, [dispatch]);
  const onRowSelected = (rowsStatus) => {
    if (rowsStatus.selectedCount > 0) {
      setIsRowSelected(true);
    } else {
      setIsRowSelected(false);
    }
    if (rowsStatus.selectedCount > 1) {
      setIsMultiselect(true);
    } else {
      setIsMultiselect(false);
    }
    setSelectedDevices(rowsStatus.selectedRows);

    console.log("the rows are", rowsStatus);
  };
  const deleteDevicesHandler = () => {
    if (!selectedDevices || selectedDevices.length === 0) {
      return;
    }

    try {
      setIsDeleting(true);

      setTimeout(() => {
        selectedDevices.forEach((device) => {
          dispatch(deleteDevice(device.device_imei));
        });
        setIsDeleting(false);
        setDeleteModalVisible(false);
      }, 2000);
    } catch (err) {
      setIsDeleting(false);
    }
    setClearSelectedRows(true);
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["container__header"]}>
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
            <ExcelSheet data={data} name="Devices">
              <ExcelColumn label="Device Name" value="device_name" />
              <ExcelColumn label="Device Imei" value="device_imei" />
              <ExcelColumn label="Date Registered" value="createdAt" />
              <ExcelColumn label="status" value="status" />
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
          {!isMultiSelect && isRowSelected && (
            <IconButton
              icon="edit"
              label="edit device"
              style={`${styles["btn"]} ${styles["btn--edit"]}   `}
              iconStyle={styles["btn--icon"]}
              onClick={onEditDeviceHandler}
            />
          )}
          {isRowSelected && !isDeleting && (
            <IconButton
              icon="bin"
              label={`delete device${isMultiSelect ? "s" : ""}`}
              style={`${styles["btn"]} ${styles["btn--delete"]}   `}
              iconStyle={styles["btn--icon"]}
              onClick={() => {
                setDeleteModalVisible(true);
              }}
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
            onRowClicked={(data) => {
              setIsShowDeviceDetails(true);
              setClickedDeviceData(data);
            }}
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
        <Modal onClose={onCloseModal} style={styles["add__device__form"]}>
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
      {editDeviceModalVisible && (
        <Modal onClose={onCloseEditModal} style={styles["add__device__form"]}>
          <div className={styles["form__heading"]}>
            <sapn>Edit device details</sapn>
            <svg class={styles["close"]} onClick={onCloseEditModal}>
              <use href={`${sprite}#icon-cross`}></use>
            </svg>
          </div>
          <EditDeviceForm
            onSubmit={onSubmitFormHandler}
            onClose={onCloseEditModal}
            device={selectedDevices}
          />
        </Modal>
      )}
      {deleteDeviceModalVisible && (
        <Modal
          onClose={onCloseDeleteModal}
          style={styles["delete__device__form"]}
        >
          <div className={styles["form__heading__delete"]}>
            <sapn>{`Are you sure you want to delete device${
              isMultiSelect ? "s" : ""
            }?`}</sapn>
            <svg class={styles["close"]} onClick={onCloseDeleteModal}>
              <use href={`${sprite}#icon-cross`}></use>
            </svg>
          </div>
          <ConfirmPasswordForm
            onClose={onCloseDeleteModal}
            onDeleteDevices={deleteDevicesHandler}
          />
        </Modal>
      )}
      {isShowDeviceDetails && (
        <Modal
          onClose={closeDeviceDetailsModal}
          style={styles["device-details"]}
        >
          <div className={styles["form__heading"]}>
            <sapn>Device Details</sapn>
            <svg class={styles["close"]} onClick={closeDeviceDetailsModal}>
              <use href={`${sprite}#icon-cross`}></use>
            </svg>
          </div>
          <DeviceDetails deviceData={clickedDeviceData} />
        </Modal>
      )}
    </div>
  );
};

export default Devices;
