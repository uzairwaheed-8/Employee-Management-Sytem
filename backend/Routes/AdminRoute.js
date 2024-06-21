import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.get('/project', (req, res) => {
    const getProjectsQuery = "SELECT * FROM project";
    con.query(getProjectsQuery, (err, projects) => {
        if (err) {
            console.error("Query Error (getProjectsQuery):", err);
            return res.status(500).json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, projects });
    });
});

// Delete a project by ID
router.delete('/delete_project/:id', (req, res) => {
    const projectId = req.params.id;
    const deleteProjectQuery = "DELETE FROM project WHERE id = ?";
    con.query(deleteProjectQuery, [projectId], (err, result) => {
        if (err) {
            console.error("Query Error (deleteProjectQuery):", err);
            return res.status(500).json({ Status: false, Error: "Query Error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "Project not found" });
        }
        return res.json({ Status: true });
    });
});

// Add a new project
router.post('/add_project', (req, res) => {
    const { name, deadline, budget, employeeName } = req.body;

    const getEmployeeIdQuery = "SELECT id FROM employee WHERE name = ?";
    con.query(getEmployeeIdQuery, [employeeName], (err, employeeResult) => {
        if (err) {
            console.error("Query Error (getEmployeeIdQuery):", err);
            return res.json({ Status: false, Error: "Query Error" });
        }

        if (employeeResult.length === 0) {
            return res.json({ Status: false, Error: "Employee not found" });
        }

        const employeeId = employeeResult[0].id;
        const insertProjectQuery = "INSERT INTO project (name, deadline, budget, employee_id) VALUES (?, ?, ?, ?)";

        con.query(insertProjectQuery, [name, deadline, budget, employeeId], (err, result) => {
            if (err) {
                console.error("Query Error (insertProjectQuery):", err);
                return res.json({ Status: false, Error: "Query Error: " + err.message });
            }
            return res.json({ Status: true });
        });
    });
});



// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_finance_data', (req, res) => {
    const { month_name, account_balance, expenses, profit_loss, profit_amount } = req.body;

    const insertFinanceDataQuery = "INSERT INTO finance (month_name, account_balance, expenses, profit_loss, profit_amount) VALUES (?, ?, ?, ?, ?)";
    con.query(insertFinanceDataQuery, [month_name, account_balance, expenses, profit_loss, profit_amount], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true });
    });
});


router.get('/get_finance_data', (req, res) => {
    const getFinanceDataQuery = "SELECT month_name, account_balance, expenses, profit_loss, profit_amount FROM finance";

    con.query(getFinanceDataQuery, (err, financeData) => {
        if (err) {
            return res.status(500).json({ error: "Query Error" });
        }

        return res.json({ financeData });
    });
});


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };
