import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using axios for HTTP requests
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
    const [formData, setFormData] = useState({
        name: '',
        deadline: '',
        budget: '',
        employeeName: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/add_project', formData)
            .then(result => {
                console.log(result.data);
                if (result.data.Status) {
                    navigate('/dashboard/project');
                } else {
                    alert(result.data.Error);
                }
                // Clear the form after successful submission
                setFormData({
                    name: '',
                    deadline: '',
                    budget: '',
                    employeeName: ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <h1>Add Project</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="deadline" className="form-label">Deadline</label>
                    <input
                        type="date"
                        className="form-control"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="budget" className="form-label">budget</label>
                    <input
                        type="number"
                        className="form-control"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="employeeName" className="form-label">Employee Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default AddProject;