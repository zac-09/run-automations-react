import { Fragment } from "react";
import styles from "./Content.module.scss";
// import Card from "../UI/Card";
import Card from "../UI/Card";
import { Line } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
// const chartStyle = {
//   height: 200,
// }
const data = {
  labels: [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ],
  datasets: [
    {
      label: "Current in Amperes",
      data: [12, 19, 3, 5, 2, 3, 5, 5, 7, 4, 5, 5, 6],
      fill: false,
      backgroundColor: "#5accf0",
      borderColor: "#5accf0",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
const Content = () => {
  return (
    <Fragment>
      <div className={styles["cardContainer"]}>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}>Current</h4>

          <GaugeChart
            id="gauge-chart-current"
            nrOfLevels={20}
            percent={0.56}
            // needleColor="#5accf0"
            textColor="#5accf0"
            formatTextValue={(value) => value + "A"}
          />
        </Card>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}>Voltage</h4>

          <GaugeChart
            id="gauge-chart-voltage"
            textColor="#5accf0"
            nrOfLevels={20}
            percent={0.26}
            colors={["#FF5F6D", "#FFC371"]}
            arcWidth={0.3}
            formatTextValue={(value) => value + "V"}
          />
        </Card>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}> Power</h4>
          <GaugeChart
            id="gauge-chart-power"
            textColor="#5accf0"
            // nrOfLevels={20}
            percent={0.86}
            formatTextValue={(value) => value + "W"}
          />
        </Card>
      </div>
      <div className={styles["chartsContainer"]}>
        {/* <span className={styles["chartsContainer__heading"]}>Statistics</span> */}
        <Card styles={styles[""]}>
          <h4 className={styles["card__title"]}>Anual Power</h4>
          <Line data={data} options={options} />
        </Card>
        {/* <Card styles={styles["chartsContainer"]}>
          <h4 className={styles["card__title"]}>Power</h4>
          <Line data={data} options={options} />
        </Card>
        <Card styles={styles["chartsContainer"]}>
          <h4 className={styles["card__title"]}>Power</h4>
        </Card> */}
      </div>
    </Fragment>
  );
};

export default Content;
