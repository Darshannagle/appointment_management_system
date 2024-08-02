import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/ReactToastify.css"
import { Modal } from 'react-bootstrap'
function Home() {
  // const ams_url = "http://192.168.1.14:1200"; // Replace with your AMS url
  const [docList, setDocList] = useState(null); // Initially set to null for loading state
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [slots, setslots] = useState(null)
  // const [bookingSlot, setSelectedSlot] = useState(null)
  const [bookingSlot, setBookingSlot] = useState(null)
  const [isO, setO] = useState(null)

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`/doctor/`);
      if (response.ok) {

        const data = await response.json();
        setDocList(data);
      } else {
        console.error("Failed to fetch doctors:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`http://newsapi.org/v2/everything?q=India&from=2024-06-14&apiKey=4483c1698c2448df942bd2f23ed12020`);
      if (response.ok) {

        const data = await response.json();
        console.log("data :", data);
      } else {
        console.error("Failed to fetch doctors:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }

  const fetchSchedule = async (doctorId, date, timezone) => {
    try {
      console.log(doctorId, " ", date, " ", timezone);
      const response = await fetch(`/schedule/getSlots?doc_id=${doctorId}&date=${date}&timezone=${timezone}`);
      if (response.ok) {
        const data = await response.json();
        setslots(data.slots)
        console.log("Slots:", data);
        toast.success("fetched Slots successfully", { position: 'top-center', autoClose: 1500 })
        // Handle the fetched schedule data as needed
      }
      // else if (response.status==400) {
      //   console.log(response);
      //   toast.error(, { position: 'top-center', autoClose: 1500 })

      // } 
      else {
        let message = await response.json();
        // await response.json()

        toast.error(message.message, { position: 'top-center', autoClose: 1500 })

        // console.log("Failed to fetch schedule:", response.statusText);
      }
    } catch (error) {

      toast.error(error.message, { position: 'top-center', autoClose: 1500 })

      console.error("Error fetching schedule:", error);

    }
  };

  async function bookSlot(StartTime, EndTime, patientName, patientEmail) {
    let data = {
      doc_id: selectedDoctorId,
      date: document.getElementById('date').value,
      startTime: StartTime,
      endTime: EndTime,
      patient_name: patientName,
      patient_email: patientEmail
    }
    console.log(data);
    let response = await fetch(`/slot/`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    )
    if (response.status === 201) {
      const dataJson = await response.json();

      toast.success('slot of ' + dataJson.startTime + ' to ' + dataJson.endTime + ' added successfully', { position: 'top-center', autoClose: 1500 })
    }
    else if (response.status == 400) {
      const message = await response.json();
      toast.error('Error:' + message.message, { position: 'top-center', autoClose: 1500 })
    }
    else if (response.status == 500) {
      // const message = await response.json().message;
      toast.error('Error:' + response.body, { position: 'top-center', autoClose: 1500 })
    }

  }

  const closeModal = () => {
    setO(false);
  }
  const addSlot = async (i) => {
    console.clear()
    console.log(setBookingSlot(i));
    console.log("i : ", i);
    console.log(bookingSlot);
    setO(true)
  }
  const handleDoctorChange = (event) => {
    setSelectedDoctorId(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const selectedDate = document.getElementById('date').value;
    const timezone = document.getElementById('timezone').value;
    console.log(selectedDate);
    fetchSchedule(selectedDoctorId, selectedDate, timezone);
  };

  return (
    <div className="row container-fluid d-flex justify-content-center ">
      <div className="col-sm-6 col-md-5 d-flex justify-content-center m-1 p-1">
        <ToastContainer></ToastContainer>
        <div className=" p-5 m-2 card" style={{ maxWidth: "80%", minWidth: "60%", height: "max-content" }}>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="doc" className="form-label">
                Doctor:
              </label>
              <select id="doc" className="form-select" onChange={handleDoctorChange} value={selectedDoctorId}>
                <option value="">Select a doctor</option>
                {docList ? (
                  docList.map((item) => (
                    <option key={item.doc_id} value={item.doc_id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}

              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date:
              </label>
              <input id="date" type="date" className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                timezone :
              </label>
              <input id="timezone" type="text" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              Show
            </button>
          </form>
        </div>
      </div>

      <div className=" card col-sm-6 col-md-5 d-flex justify-content-start m-1 p-2">
        <table className="table table-bordered text-center ">
          <thead className="table table-dark">
            <tr className="text-center" key={slots} >
              <th>StartTime</th>
              <th>EndTime</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {slots ? (typeof slots == "object" ? (slots.map((i) => (
              <tr key={i.id}>
                <td>{i.start}</td>
                <td>{i.end}</td>
                <td><button className="btn btn-primary text-center " onClick={() => { addSlot(i) }}>+</button></td>
              </tr>
            ))) : (toast.error("No Slots available"))) : (<div></div>)
            }
          </tbody>
        </table>

      </div>
      <Modal show={isO} size="xl" onHide={setO} style={{}} >
        <Modal.Header closeButton ><Modal.Title>Book a Slot</Modal.Title> </Modal.Header>
        <Modal.Body>
          <form >
          <div className="col m-1 d-flex flex-column justify-content-center align-items-streach-around">

            <span className="card p-2 mb-2">start time : {(bookingSlot) ? bookingSlot.start : ""}</span>
            <span className="card p-2 mb-2">end time : {(bookingSlot) ? bookingSlot.end : ""}</span>
            <div className=" p-1 d-flex justify-content-evenly"><label htmlFor="patientName">    Patient's Name : </label>   <input type="text" id="patientName" />  </div>
            <div className=" p-1 d-flex justify-content-evenly"><label htmlFor="patientEmail">    Patient's Email : </label>   <input type="email" id="patientEmail" />  </div>
            <div className="p-1 d-flex justify-content-evenly "  ><button className="btn btn-success rounded-1" onClick={(e) => { e.preventDefault(); bookSlot(bookingSlot.start.split(" ")[1], bookingSlot.end.split(" ")[1], patientName.value, patientEmail.value); closeModal(); fetchSchedule(selectedDoctorId, document.getElementById('date').value, document.getElementById('timezone').value); }}>Submit</button>     <button type="reset" className="btn btn-danger rounded-1" >Clear </button> </div>
          </div>
          </form>
        </Modal.Body>
      </Modal>
    </div >

  )
}

export default Home;
