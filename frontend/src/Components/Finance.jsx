import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';
import  './css/project.css';

const Finance = () => {
    const [financeData, setFinanceData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/get_finance_data')
            .then(response => {
                setFinanceData(response.data.financeData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Finance Table</h1>
            <Link to="/dashboard/add_finance_data" className="btn btn-primary btn-clk">Add Details</Link>
            <table className="table">
                <thead >
                    <tr>
                        <th>Month Name</th>
                        <th>Account Balance</th>
                        <th>Expenses</th>
                        <th>Profit/Loss</th>
                        <th>Profit Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {financeData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.month_name}</td>
                            <td>{data.account_balance}</td>
                            <td>{data.expenses}</td>
                            <td>{data.profit_loss}</td>
                            <td>{data.profit_amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Finance;
