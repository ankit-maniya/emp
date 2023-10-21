import React, { useState } from 'react'
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

function EmployeeSearch() {


  const [employee, setemployee] = useState({ title: "", department: "", employeeType: "" })
  const [data, setdata] = useState("")


  const handleOnChange = (e) => {
    setemployee({ ...employee, [e.target.name]: e.target.value })

  }


  const handleOnClick = async (e) => {

    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query{
            filterEmployee(employeeType:"${employee.employeeType}",title:"${employee.title}",department:"${employee.department}"){
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
    })
    const data = await response.json();
    setdata(data.data.filterEmployee);
  }

  return (
    <div className='container mt-5'>
  
      <div className='row'>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="title"
              id="title"
              onChange={handleOnChange}
            >
              <option selected="true" disabled="disabled">Open this select menu</option>
              <option value="Employee">
                Employee
              </option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="VP">VP</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="department" className="form-label">
              Department
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="department"
              id="department"
              onChange={handleOnChange}
            >
              <option selected="true" disabled="disabled">Open this select menu</option>
              <option value="IT">
                IT
              </option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>

          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="employeeType" className="form-label">
              EmployeeType
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="employeeType"
              id="employeeType"
              onChange={handleOnChange}
            >
              <option selected="true" disabled="disabled">Open this select menu</option>
              <option value="FullTime">
                FullTime
              </option>
              <option value="PartTime">PartTime</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </select>

          </div>
        </div>

      </div>
      <button type="submit" className="btn btn-dark" id='btnSearchEmployee' name='btnSearchEmployee' onClick={handleOnClick}>
        Search Employee
      </button>
      <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Age</th>
            <th scope="col">Date of Joining</th>
            <th scope="col">Title</th>
            <th scope="col">Department</th>
            <th scope="col">EmployeeType</th>
            <th scope="col">CurrentStatus</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((ele) => {
            return (
              <tr key={ele._id}>
                <td>{ele.first_name}</td>
                <td>{ele.last_name}</td>
                <td>{ele.Age}</td>
                <td>{new Date(parseInt(ele.dateOfJoining)).toLocaleDateString()}</td>
                <td>{ele.title}</td>
                <td>{ele.department}</td>
                <td>{ele.employeeType}</td>
                <td>{ele.currentStatus}</td>
              </tr>)
          })}
        </tbody>
      </table>



    </div>
  )
}

export default EmployeeSearch