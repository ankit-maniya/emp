import React, { useState } from "react";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import './css/Form.css'



function EmployeeCreate() {

  const [employee, setEmployee] = useState({ first_name: "", last_name: "", age: "", dateOfJoining: "", title: "", department: "", employeeType: "" })
  const [error_first_name, setFirstName] = useState(false);
  const [error_last_name, setLastName] = useState(false);
  const [error_age, setAge] = useState(false);
  const [error_dateofjoining, setDateOfJoining] = useState(false);
  const [error_title, setTitle] = useState(false);
  const [error_department, setDepartment] = useState(false);
  const [error_employeetype, setEmployeeType] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ageError, setAgeError] = useState("");

  const handleOnChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value })
  }


  const handleOnClick = async (e) => {
    e.preventDefault();

    setFirstName(false);
    setLastName(false);
    setAge(false);
    setDateOfJoining(false);
    setTitle(false);
    setDepartment(false);
    setEmployeeType(false);
    setSuccess(false);

    setAgeError("");
    if (employee.first_name === "") {

      setFirstName(true);
    } else if (employee.last_name === "") {

      setLastName(true);
    } else if (employee.age === "") {
      setAgeError("Please Fill the Age Field.")
      setAge(true);
    } else if (employee.age < 20 || employee.age > 70) {
      setAgeError("Please Enter Age between 20 to 70.")
      setAge(true);
    } else if (employee.dateOfJoining === "") {

      setDateOfJoining(true);
    } else if (employee.title === "") {

      setTitle(true)
    } else if (employee.department === "") {

      setDepartment(true);
    } else if (employee.employeeType === "") {

      setEmployeeType(true);
    }
    else {

      setFirstName(false);
      setLastName(false);
      setAge(false);
      setDateOfJoining(false);
      setTitle(false);
      setDepartment(false);
      setEmployeeType(false);


      if (employee.employeeType === "Contract" || employee.employeeType === "Seasonal") {
        if (employee.title === "Manager" || employee.title === "Director" || employee.title === "VP") {
          setErrMessage("Manager, Director and VP can't be a Contract or Seasonal Employee.")
          setOpen(true);
        } else {
          await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
              mutation{
                createEmployee(first_name:"${employee.first_name}",last_name:"${employee.last_name}",Age:${employee.age},dateOfJoining:"${employee.dateOfJoining}",title:"${employee.title}",department:"${employee.department}",employeeType:"${employee.employeeType}"){
                  _id
                }
              }
              `
            }),
          })
          setOpen(false)
          setSuccess(true);
        }
      } else {

        await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
          mutation{
            createEmployee(first_name:"${employee.first_name}",last_name:"${employee.last_name}",Age:${employee.age},dateOfJoining:"${employee.dateOfJoining}",title:"${employee.title}",department:"${employee.department}",employeeType:"${employee.employeeType}"){
              _id
            }
          }
          `
          }),
        })
        setSuccess(true);
      }
    }
  }

  return (
    <>
      <div className="container mt-4">
        <div className="container mt-3" >
          {success && <div className="alert alert-success" role="alert">
            Employee Has Been Added To The Database.
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
                    className={`form-control  ${error_first_name === true ? "error" : ""
                      }`}
                    id="first_name"
                    name="first_name"
                    onChange={handleOnChange}

                  />
                  <div className={`form-text  ${error_first_name === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Enter First Name.</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="Last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${error_last_name === true ? "error" : ""
                      }`}
                    id="last_name"
                    name="last_name"
                    onChange={handleOnChange}
                  />
                  <div className={`form-text  ${error_last_name === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Enter Last Name.</div>
                </div>

              </div>


              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input type="number" className={`form-control  ${error_age === true ? "error" : ""
                    }`} id="age" name="age" onChange={handleOnChange} />
                  <div className={`form-text  ${error_age === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>{ageError}</div>
                </div>
              </div>


              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="DOJ" className="form-label">
                    Date of Joining
                  </label>
                  <input type="date" className={`form-control  ${error_dateofjoining === true ? "error" : ""
                    }`} id="dateOfJoining" name="dateOfJoining" onChange={handleOnChange} placeholder="dd/mm/yyyy" />
                  <div className={`form-text  ${error_dateofjoining === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Enter Date of Joining.</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <select
                    className={`form-select ${error_title === true ? "error" : ""
                      }`}
                    aria-label="Default select example"
                    name="title"
                    id="title"
                    onChange={handleOnChange}
                  >
                    <option defaultValue>Open this select menu</option>
                    <option value="Employee">
                      Employee
                    </option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="VP">VP</option>
                  </select>
                  <div className={`form-text  ${error_title === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Select Title.</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <select
                    className={`form-select ${error_department === true ? "error" : ""
                      }`}
                    aria-label="Default select example"
                    name="department"
                    id="department"
                    onChange={handleOnChange}
                  >
                    <option defaultValue>Open this select menu</option>
                    <option value="IT">
                      IT
                    </option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                  <div className={`form-text  ${error_department === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Select Department.</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="employeeType" className="form-label">
                    EmployeeType
                  </label>
                  <select
                    className={`form-select ${error_employeetype === true ? "error" : ""
                      }`}
                    aria-label="Default select example"
                    name="employeeType"
                    id="employeeType"
                    onChange={handleOnChange}
                  >
                    <option defaultValue>Open this select menu</option>
                    <option value="FullTime">
                      FullTime
                    </option>
                    <option value="PartTime">PartTime</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                  <div className={`form-text  ${error_employeetype === true ? "" : "d-none"
                    }`} style={{ "color": "red" }}>Please Select EmployeeType.</div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-dark" id="loginSubmit" name="loginSubmit" onClick={handleOnClick}>
              Create Employee
            </button>
          </form>
        </div>

  



      </div>
    </>
  );
}

export default EmployeeCreate;
