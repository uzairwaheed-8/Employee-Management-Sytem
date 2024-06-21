import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/project.css';

const Project = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:3000/auth/project")
            .then((result) => {
                if (result.data.Status) {
                    setProjects(result.data.projects);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3000/auth/delete_project/' + id)
            .then(result => {
                if (result.data.Status) {
                    window.location.reload();
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Projects List</h1>
                <Link to="/dashboard/add_project" className="btn btn-primary btn-clk">Add Project</Link>
            </div>
            <ul className="list-group">
                {projects.map(project => (
                    <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center hover-box">
                        <div>
                            <strong>Name:</strong> {project.name}<br />
                            <strong>Deadline:</strong> {project.deadline}<br />
                            <strong>budget:</strong> {project.budget}<br />
                            <strong>Employee ID:</strong> {project.employee_id}<br/>
                        </div>
                        <div>
                            <button
                                className="btn btn-danger btn-sm "
                                onClick={() => handleDelete(project.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Project;
