import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import "./App.css";
import LinearProgress from "@mui/material/LinearProgress";

function App() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [pathwayData, setPathwayData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPathwayData([]);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "500px",
    overflowY: "scroll",
    overflowX: "hidden",
  };

  const pathwayTexts = {
    1: "Python",
    2: "English",
    3: "Typing",
    4: "JavaScript",
    5: "Residential",
    6: "Scratch",
    7: "ACB",
    8: "TCBPI",
  };

  useEffect(() => {
    axios
      .get("https://merd-api.merakilearn.org/merakihackthon/28Sep/getAllData")
      .then((res) => {
        setData(res.data);
      });
  }, []);

  const fetchPathwayData = (userId, pathwayId) => {
    console.log(userId);
    axios({
      url: `https://merd-api.merakilearn.org/users/performance?userId=${userId}&pathway_id=${pathwayId}`,
      method: "get",
      headers: {
        accept: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQyMzc3IiwiZW1haWwiOiJzaGl2YW5zaEBuYXZndXJ1a3VsLm9yZyIsImlhdCI6MTY5NTk4MDAwNSwiZXhwIjoxNzI3NTM3NjA1fQ.SXVJp_sg2SSrFwTXS2putJIv8DPXMtMs6oc4FSCEFCI", // Replace with your actual authorization token
      },
    })
      .then((res) => {
        setPathwayData((prevData) => [
          ...prevData,
          { userId, pathwayId, data: res.data },
        ]);
      })
      .catch((error) => {
        console.error(`Error fetching data for pathway ${pathwayId}:`, error);
      });
  };

  useEffect(() => {
    console.log(userData);
    if (userData?.id) {
      for (let pathwayId = 1; pathwayId <= 10; pathwayId++) {
        fetchPathwayData(userData?.id, pathwayId);
      }
    }
  }, [userData]);

  useEffect(() => {
    console.log("Pathway Data:", pathwayData);
  }, [pathwayData]);

  function getDetails(data) {
    console.log(data);
    axios({
      url: `https://merd-api.merakilearn.org/users/${data}`,
      method: "get",
      headers: {
        accept: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQyMzc3IiwiZW1haWwiOiJzaGl2YW5zaEBuYXZndXJ1a3VsLm9yZyIsImlhdCI6MTY5NTk4MDAwNSwiZXhwIjoxNzI3NTM3NjA1fQ.SXVJp_sg2SSrFwTXS2putJIv8DPXMtMs6oc4FSCEFCI", // Replace with your actual authorization token
      },
    }).then((res) => {
      setUserData(res?.data?.user);
      setOpen(true);
    });
  }

  function convertMinutesToHoursAndMinutes(minutes) {
    if (isNaN(minutes)) {
      return "Invalid input. Please provide a number of minutes.";
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours and ${remainingMinutes} minutes`;
  }

  function convertISODateToNormalDateAndTime(isoDate) {
    const dateObject = new Date(isoDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const seconds = dateObject.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${formattedHours}:${minutes}:${seconds}${ampm}`;
    return `${formattedTime}, ${formattedDate}`;
  }

  return (
    <>
      <h1>User Data Table</h1>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{}}>
            <img
              src={userData.profile_picture}
              style={{
                width: "60px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "20px",
              }}
              alt="User profile Picture"
            />
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ color: "black" }}
            >
              {userData.name}
            </Typography>
            {pathwayData.map((pathway, index) => (
              <div
                key={index}
                style={{ border: "1px solid green", textAlign: "center" }}
              >
                <Typography style={{ color: "red" }}>
                  Course: {pathwayTexts[pathway.pathwayId]}
                </Typography>
                <Typography style={{ color: "black" }}>
                  Overall Progress:{" "}
                  {isNaN(pathway.data.overallProgress) || "" || NaN || 0
                    ? "Not Started"
                    : parseFloat(pathway.data.overallProgress).toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  style={{
                    width: "250px",
                    margin: "20px auto",
                    height: "10px",  
                    borderRadius:"5px"
                  }}
                  value={pathway.data.overallProgress}
                />
              </div>
            ))}
          </div>
        </Box>
      </Modal>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">User ID</TableCell>
              <TableCell align="right">User Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">First Seen at</TableCell>
              <TableCell align="right">Total Learning Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data) => (
              <TableRow
                key={data.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="data">
                  {data.id}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ cursor: "pointer" }}
                  onClick={() => getDetails(data.user_id)}
                >
                  {data.user_id}
                </TableCell>
                <TableCell align="right">{data.name}</TableCell>
                <TableCell align="right">{data.email}</TableCell>
                <TableCell align="right">
                  {convertISODateToNormalDateAndTime(data.created_at)}
                </TableCell>
                <TableCell align="right">
                  {convertMinutesToHoursAndMinutes(data.durations)}
                </TableCell>
                <TableCell align="right">
                  <img
                    src={data.profile_picture}
                    alt={data.name}
                    style={{ width: "30px" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
