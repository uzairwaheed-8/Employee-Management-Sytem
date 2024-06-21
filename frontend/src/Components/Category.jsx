import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './css/category.css';

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:3000/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])

    return (
        <div className='table-title'>
            <h3 style={{color:"black",marginBottom:"20px"}}>Category List</h3>
            <Link to="/dashboard/add_category" className='btn btn-success btn-clik'>Add Category</Link>
            <div className='table-fills'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='th text-left'>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map(c => (
                            <tr key={c.id}>
                                <td className='td text-left'>{c.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Category
