import React, { useEffect } from 'react'

function UpcomingRetirement() {

  const [data, setData] = React.useState([]);
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
      const newData = data.data.users.filter((user) => {
        return (60 - user.Age) <= 1;
      });

      setData(newData);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='container my-4'>
      <h4 className='my-4'>UpcomingRetirement</h4>
      <table className="table table-striped">
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
        <tbody>{data &&
          data.map((element) => {
            return (
              <tr key={element._id}>
                <td>{element.first_name}</td>
                <td>{element.last_name}</td>
                <td>{element.Age}</td>
                <td>
                  {new Date(
                    parseInt(element.dateOfJoining)
                  ).toLocaleDateString()}
                </td>
                <td>{element.title}</td>
                <td>{element.department}</td>
                <td>{element.employeeType}</td>
                <td>{element.currentStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UpcomingRetirement;