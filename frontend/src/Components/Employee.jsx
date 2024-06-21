import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './css/emp.css'; // Import the CSS file

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete('http://localhost:3000/auth/delete_employee/'+id)
    .then(result => {
        if(result.data.Status) {
            window.location.reload();
        } else {
            alert(result.data.Error);
        }
    });
  };

  return (
    <div className="px-5 mt-3 body">
      <div className="d-flex justify-content-center table-title">
        <h3 style={{color:"black"}}>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success btn-clik">
        Add Employee
      </Link>
      <div className="mt-3 table-fill">
        <table>
          <thead>
            <tr>
              <th className="th text-left">Name</th>
              <th className="th text-left">Image</th>
              <th className="th text-left">Email</th>
              <th className="th text-left">Address</th>
              <th className="th text-left">Salary</th>
              <th className="th text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td className="td text-left">{e.name}</td>
                <td className="td text-left">
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    alt={e.name}
                    className="employee_image"
                  />
                </td>
                <td className="td text-left">{e.email}</td>
                <td className="td text-left">{e.address}</td>
                <td className="td text-left">{e.salary}</td>
                <td className="td text-left">
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm me-2 "
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm "
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
