import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
import ButtonGroup from "../ButtonGroup/button-group";

const Actions = () => {
  const groupId = localStorage.getItem("groupId");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  const [buttongroupstate, setbuttongroupstate] = useState(0);
  let [list2, setList2] = useState([]);
  useEffect(() => {
    dispatch(changeRoute("/actions"));
  }, [dispatch]);

  const handleButtonWater = () => {
    setbuttongroupstate(0);
  };
  const handleAir = () => {
    setbuttongroupstate(1);
  };

  const printButtonLabel = (event) => {
    if (event.target.name === "Water") {
      handleButtonWater();
    }
    if (event.target.name === "Air") {
      handleAir();
    }
  };
  const toggleDevice = (device, value) => {
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=${device}&value=${value}`
    );
    fetchData_current_state();
  };
  //calling it after changing with start and stop
  const fetchData_current_state = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/actions/current_state?group=${groupId}`
      );
      const valuesArr = response.data.message.map((item) => ({
        object: item.object,
        group: item.group,
        value: item.value,
      }));
      setList2(valuesArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //GETTING IT TO BE SURE IT IS THE CURRENT STATE EVERY 10 SECONDS
  useEffect(() => {
    if (currentPage === "/actions") {
      fetchData_current_state();
      const interval = setInterval(fetchData_current_state, 2000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentPage, groupId]);
  const objectOrder = [
    "pump_1",
    "pump_2",
    "pump_3",
    "ventilator_1",
    "humidifyer_1",
  ];
  const sortedList = list2.sort(
    (a, b) => objectOrder.indexOf(a.object) - objectOrder.indexOf(b.object)
  );
  const Device = ({ type, number }) => {
    const deviceName = `${type}_${number || ""}`;
    const device = sortedList.find((item) => item.object === deviceName);

    if (!device) return null; // Add this line
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    if (type !== "pump") {
      return (
        <div className={styles.box}>
          <h1
            tyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {capitalizedType}
            <button
              className={styles.button}
              onClick={() =>
                toggleDevice(deviceName, device.value === "on" ? "off" : "on")
              }
            >
              {device.value === "on" ? "Stop" : "Start"}
            </button>
          </h1>
        </div>
      );
    } else {
      return (
        <div className={styles.box}>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {capitalizedType} {number}
            <button
              className={styles.button}
              onClick={() =>
                toggleDevice(deviceName, device.value === "on" ? "off" : "on")
              }
            >
              {device.value === "on" ? "Stop" : "Start"}
            </button>
          </h1>
        </div>
      );
    }
  };
  const objectMap = {
    pump_1: { objectName: "Pump 1", sensorHeading: "Water" },
    pump_2: { objectName: "Pump 2", sensorHeading: "Water" },
    pump_3: { objectName: "Pump 3", sensorHeading: "Water" },
    ventilator_1: { objectName: "Fan 1", sensorHeading: "Speed" },
    humidifyer_1: { objectName: "Humidifyer 1", sensorHeading: "Humidity" },
  };

  return (
    <div className={styles.main_container}>
      <h1 className={styles.h1}>Actions</h1>
      <div className={styles.current_state}>
        <div className={styles.data}>
          {sortedList.map((item) => {
            const { objectName, sensorHeading } = objectMap[item.object] || {};
            let sensor = {
              heading: sensorHeading,
              value: item.value,
            };
            return (
              <div className={styles.sensordata} key={item.object}>
                <div className={styles.elementssensordata}>
                  <h2 className={styles.sensorheading}>{sensor.heading}</h2>
                  <p
                    className={`${styles.sensorvalue} ${
                      sensor.value === "on" ? styles.on : styles.off
                    }`}
                  >
                    {sensor.value}
                  </p>
                </div>
                <p className={styles.objectname}>{objectName}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.box_gray}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["Water", "Air"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
            activeButton={buttongroupstate}
            overrideBoxColor={true}
            overrideButtonColor={false}
          />
        </div>
        <div>
          {buttongroupstate === 0 && (
            <div className="pumps">
              <Device type="pump" number="1" />
              <Device type="pump" number="2" />
              <Device type="pump" number="3" />
            </div>
          )}
          {buttongroupstate === 1 && (
            <div className="other">
              <Device type="humidifyer" number="1" />
              <Device type="ventilator" number="1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
