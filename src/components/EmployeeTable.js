import { EditRounded, Delete } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

function EmployeeTable() {
  const [data, setData] = useState([]);
  const [checkType, setCheckType] = useState("");
  const [checkStatus, setCheckStatus] = useState("All");
  const [upcomingEmp, setUpcomingEmp] = useState([]);
  const [open, setOpen] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query{
            users{
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
          `,
        }),
      });

      const data = await response.json();

      console.log(data);

      setData(data.data.users);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnChange = async (e) => {
    setCheckType(e.target.value);

    if (e.target.value === "All") {
      fetchData();
    } else {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query{
            getUserByType(employeeType:"${e.target.value}"){
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
          `,
        }),
      });

      const data = await response.json();

      if (checkStatus === "Ret") {
        const newData = data.data.getUserByType.filter((user) => {
          return 60 - user.Age <= 1;
        });
        setData(newData);
        setUpcomingEmp(newData);
      } else {
        setData(data.data.getUserByType);
        setUpcomingEmp(data.data.getUserByType);
      }
    }
  };

  const deleteUser = async (_id, currentStatus) => {
    setOpen(false);
    try {
      if (currentStatus === "1") {
        setErrMessage("Employee is Active, Cannot Delete");
        setOpen(true);
        return;
      } else {
        await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
          mutation{
            deleteEmployee(_id:"${_id}"){
              _id
            }
          }
          `,
          }),
        });

        setOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEmp = async (e) => {
    setCheckStatus(e.target.value);
    if (e.target.value === "All") {
      if (checkType === "All") {
        fetchData();
      } else {
        const newData = upcomingEmp.filter((element) => {
          return element.employeeType === checkType;
        });
        console.log(newData);
        setData(newData);
      }
    } else {
      const newData = upcomingEmp;
      upcomingEmp.filter((element) => {
        return 60 - element.Age <= 1;
      });
      console.log(newData);
      setData(newData);
    }
  };

  return (
    <>
      <div className="container mt-4">
        {open && (
          <div className="alert alert-danger" role="alert">
            {errMessage}
          </div>
        )}

        <div className="my-5" style={{ width: "225px" }}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Choose Employee Type
          </label>
          <select
            id="type"
            name="type"
            className="form-select"
            aria-label="Default select example"
            onChange={handleOnChange}
          >
            <option selected="true" disabled="disabled">
              Open this select menu
            </option>
            <option value="All">All</option>
            <option value="FullTime">FullTime</option>
            <option value="PartTime">PartTime</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>
        <div className="my-5" style={{ width: "225px" }}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Choose Upcoming Employee
          </label>
          <select
            id="upEmp"
            name="upEmp"
            className="form-select"
            aria-label="Default select example"
            onChange={handleChangeEmp}
          >
            <option selected="true" disabled="disabled">
              Open this select menu
            </option>
            <option value="All">All</option>
            <option value="Ret">Ret</option>
          </select>
        </div>

        <table className="table">
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
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((ele) => {
                return (
                  <tr key={ele._id}>
                    <td>{ele.first_name}</td>
                    <td>{ele.last_name}</td>
                    <td>{ele.Age}</td>
                    <td>
                      {new Date(
                        parseInt(ele.dateOfJoining)
                      ).toLocaleDateString()}
                    </td>
                    <td>{ele.title}</td>
                    <td>{ele.department}</td>
                    <td>{ele.employeeType}</td>
                    <td>{ele.currentStatus}</td>
                    <td>
                      <Link to={`/update_employee/${ele._id}`}>
                        <EditRounded style={{ cursor: "pointer" }} />
                      </Link>
                    </td>
                    <td>
                      <Delete
                        onClick={() => {
                          deleteUser(ele._id, ele.currentStatus);
                        }}
                        style={{ cursor: "pointer", color: "#d91709" }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployeeTable;
