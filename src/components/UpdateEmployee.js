import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";


function UpdateEmployee(props) {

  const { id } = useParams();
  const navigate = useNavigate()
  const [errMessage, setErrMessage] = useState("")

  const [openSuccess, setOpenSuccess] = useState(false);
  const [open,setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setOpenSuccess(false)
  };

  const [user, setuser] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    age: "",
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: "",
  });



  async function fetchData() {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
              query{
                getSingleEmployee(_id:"${id}"){
                  _id
                  first_name
                  last_name
                  Age
                  dateOfJoining
                  title
                  department
                  employeeType
                  currentStatus
                }
              }
              `
        }),
      });

      const data = await response.json();

      console.log(data);

      setuser({
        _id: data.data.getSingleEmployee._id,
        first_name: data.data.getSingleEmployee.first_name,
        last_name: data.data.getSingleEmployee.last_name,
        age: data.data.getSingleEmployee.Age,
        dateOfJoining: new Date(
          parseInt(data.data.getSingleEmployee.dateOfJoining)
        ).toLocaleDateString(),
        title: data.data.getSingleEmployee.title,
        department: data.data.getSingleEmployee.department,
        employeeType: data.data.getSingleEmployee.employeeType,
        currentStatus: data.data.getSingleEmployee.currentStatus,
      })


    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {

    console.log(id);
    fetchData()
    // eslint-disable-next-line
  }, [])

  const handleUserChange = async (e) => {
    setuser({ ...user, [e.target.name]: e.target.value })
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    setOpen(false)
    try {
      if (user.employeeType === "Contract" || user.employeeType === "Seasonal") {
        if (user.title === "Manager" || user.title === "Director" || user.title === "VP") {
          setErrMessage("Manager, Director and VP can't be a Contract or Seasonal Employee.")
          setOpen(true);
        }else{
          await fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation{
                  updateEmployee(_id:"${user._id}",title:"${user.title}",department:"${user.department}",currentStatus:"${user.currentStatus}"){
                    _id
                  }
                }
                `,
            }),
          });
          setOpenSuccess(true)
        }
      } else {
        await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation{
                updateEmployee(_id:"${user._id}",title:"${user.title}",department:"${user.department}",currentStatus:"${user.currentStatus}"){
                  _id
                }
              }
              `,
          }),
        });

        setOpenSuccess(true)
      }

    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="container mt-5" >
       {openSuccess && <div className="alert alert-success" role="alert">
       Employee Has Been Updated Successfully.
          </div>}

          {open && <div className="alert alert-danger" role="alert">
          {errMessage}
          </div>}
      <form>



        <div className="row">

          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={user.first_name}
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="Last_name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={user.last_name}
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={user.age}
                disabled
              />
            </div>
          </div>


          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="DOJ" className="form-label">
                Date of Joining
              </label>
              <input
                type="text"
                className="form-control"
                id="dateOfJoining"
                name="dateOfJoining"
                value={user.dateOfJoining}
                disabled
              />
            </div>
          </div>


          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="title"
                id="title"
                onChange={handleUserChange}
              >
                <option value="Employee" selected={`${user.title === "Employee" ? "true" : ""}`}>Employee</option>
                <option value="Manager" selected={`${user.title === "Manager" ? "true" : ""}`}>Manager</option>
                <option value="Director" selected={`${user.title === "Director" ? "true" : ""}`}>Director</option>
                <option value="VP" selected={`${user.title === "VP" ? "true" : ""}`}>VP</option>
              </select>
            </div>

          </div>

          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="department"
                id="department"
                onChange={handleUserChange}
              >

                <option value="IT" selected={`${user.department === "IT" ? "true" : ""}`}>IT</option>
                <option value="Marketing" selected={`${user.department === "Marketing" ? "true" : ""}`}>Marketing</option>
                <option value="HR" selected={`${user.department === "HR" ? "true" : ""}`}>HR</option>
                <option value="Engineering" selected={`${user.department === "Engineering" ? "true" : ""}`}>Engineering</option>
              </select>
            </div>
          </div>

          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="employeeType" className="form-label">
                EmployeeType
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeType"
                name="employeeType"
                value={user.employeeType}
                disabled
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="mb-3">
              <label htmlFor="employeeType" className="form-label">
                Current Status
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="currentStatus"
                id="currentStatus"
                onChange={handleUserChange}
              >

                <option value="1" selected={`${user.currentStatus === "1" ? "true" : ""}`}>1</option>
                <option value="0" selected={`${user.currentStatus === "0" ? "true" : ""}`}>0</option>
              </select>
            </div>
          </div>
        </div>



        <button type="submit" className="btn btn-dark"
          onClick={handleUpdateUserInfo}
        >
          Update Employee
        </button>
      </form>
    </div>
  )
}

export default UpdateEmployee