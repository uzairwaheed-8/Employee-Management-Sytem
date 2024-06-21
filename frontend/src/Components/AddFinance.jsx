import React, { useState } from 'react';
import axios from 'axios';

const AddFinance = () => {
    const [formData, setFormData] = useState({
        month_name: '',
        account_balance: ''
    });
    const [tableData, setTableData] = useState([]);

    const [salaryTotal, setSalaryTotal] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const salaryCount = () => {
        return axios.get('http://localhost:3000/auth/salary_count')
            .then(result => {
                if (result.data.Status) {
                    return result.data.Result[0].salaryOFEmp;
                } else {
                    throw new Error(result.data.Error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get total salaries
            const totalSalaries = await salaryCount();
    
            // Calculate expenses
            const calculatedExpenses = totalSalaries * 0.8; // Assuming 80% of total salaries is expenses
    
            // Get account balance from form
            const balance = parseFloat(formData.account_balance);
    
            // Calculate profit/loss
            const profitLoss = balance >= calculatedExpenses ? 'Profit' : 'Loss';
    
            // Calculate profit amount
            const profitAmount = profitLoss === 'Profit' ? (balance - calculatedExpenses) : 0;
    
            // Add finance details to database
            const response = await axios.post('http://localhost:3000/auth/add_finance_data', {
                month_name: formData.month_name,
                account_balance: formData.account_balance,
                expenses: calculatedExpenses,
                profit_loss: profitLoss,
                profit_amount: profitAmount
            });
            console.log('Data saved successfully:', response.data);
    
            // Update table data
            setTableData([
                ...tableData,
                {
                    month_name: formData.month_name,
                    expenses: calculatedExpenses,
                    profit_loss: profitLoss,
                    profit_amount: profitAmount
                }
            ]);
        } catch (error) {
            // Handle error
            console.error('Error saving data:', error);
        }
    };
    
    

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Finance Table</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="month_name" className="form-label">Month Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="month_name"
                        name="month_name"
                        value={formData.month_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="account_balance" className="form-label">Account Balance</label>
                    <input
                        type="text"
                        className="form-control"
                        id="account_balance"
                        name="account_balance"
                        value={formData.account_balance}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Calculate</button>
            </form>

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Month Name</th>
                        <th>Expenses</th>
                        <th>Profit/Loss</th>
                        <th>Profit Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.month_name}</td>
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

export default AddFinance;
