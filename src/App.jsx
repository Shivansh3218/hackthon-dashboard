import { React, useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([]);
  let [names, setNames] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [userData, setUserData] = useState({})
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

  };


  useEffect(() => {
    axios.get('https://merd-api.merakilearn.org/merakihackthon/28Sep/getAllData')
      .then((res) => {
        // console.log(res.data)
        setData(res.data)

      })
  }
    , [])


  function getDetails(data) {

    console.log(data)
    axios({
      url: `https://merd-api.merakilearn.org/users/${data}`,
      method: "get",
      headers: { accept: "application/json", Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQyMzc3IiwiZW1haWwiOiJzaGl2YW5zaEBuYXZndXJ1a3VsLm9yZyIsImlhdCI6MTY5NTk4MDAwNSwiZXhwIjoxNzI3NTM3NjA1fQ.SXVJp_sg2SSrFwTXS2putJIv8DPXMtMs6oc4FSCEFCI" }
    }).then((res) => {
      console.log(res.data.user)
      setUserData(res.data.user)
      // setNames([...names, res.data.user.name]) 
    })
    setOpen(true)

  }

  function convertMinutesToHoursAndMinutes(minutes) {
    if (isNaN(minutes)) {
      return 'Invalid input. Please provide a number of minutes.';
    }
  
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    return `${hours} hours and ${remainingMinutes} minutes`;
  }

  function convertISODateToNormalDateAndTime(isoDate) {
    const dateObject = new Date(isoDate);

    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = dateObject.getDate().toString().padStart(2, '0');
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert to 12-hour format
    const formattedHours = (hours % 12) || 12;
  
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${formattedHours}:${minutes}:${seconds}${ampm}`;
  
    return `${formattedTime}, ${formattedDate}`;
  }



  return (
    <>

      <h1>User Data Table </h1>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={style}>
            <div style={{display:"flex"}}>
            <img src={userData.profile_picture} style={{
              width: "60px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "20px"
            }
            } alt="User profile Picture" />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {userData.name}
            </Typography>
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
              <TableCell align="right">Email </TableCell>
              <TableCell align="right">First Seen at</TableCell>

              <TableCell align="right">Total Learning Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data) => (
              <TableRow
                key={data.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="data">
                  {data.id}
                </TableCell>
                <TableCell align="right" sx={{cursor:"pointer"}} onClick={() => getDetails(data.user_id)}>{data.user_id}</TableCell>

                <TableCell  align="right">{names.data}</TableCell>
                <TableCell align="right">{data.email}</TableCell>
                <TableCell align="right">{convertISODateToNormalDateAndTime(data.created_at)}</TableCell>
                <TableCell align="right">{convertMinutesToHoursAndMinutes(data.durations)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default App
