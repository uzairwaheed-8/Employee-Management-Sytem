import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })
        
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
  });
  router.post("/add_employee", async (req, res) => {
    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // SQL query to insert a new employee
        const sql = "INSERT INTO employee (name, email, password, salary, address, image, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        con.query(sql, [req.body.name, req.body.email, hashedPassword, req.body.salary, req.body.address, req.body.image, req.body.category_id], (err, result) => {
            if (err) {
                return res.json({ Status: false, Error: "Failed to add employee" });
            }
            return res.json({ Status: true, Message: "Employee added successfully" });
        });
    } catch (err) {
        console.error("Error adding employee:", err);
        return res.json({ Status: false, Error: "Failed to add employee" });
    }
});
  
  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  export {router as EmployeeRouter}