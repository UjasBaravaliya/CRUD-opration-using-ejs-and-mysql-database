const express = require('express');
const path = require("path");
const con = require('./Database/database');
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


con.connect(function (err) {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database.');
});



app.get('/signup', (req, res) => {
  res.render('signup');
});



app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Name,Email and Password are required..");
  }

  const query = "insert into user(name,email,password) values ?";
  const value = [[name, email, password]];

  con.query(query, [value], (error) => {
    if (error) {
      return res.status(500).send('Data not insert..');
    } else {
      res.redirect('/getalldata');
    }
  })
})


app.get('/getalldata', function (req, res) {
  con.query('select * from user', function (error, result) {
    if (error) {
      return res.status(500).send('Data not found');
    } else {
      res.render(__dirname + '/student.ejs', { student: result });
    }
  })
})



app.get('/updatedata', function (req, res) {
  const query = 'select * from user where id=?';
  const id = req.query.id;
  con.query(query, [id], function (error, result) {
    if (error) {
      return res.status(500).send('Data not updated..')
    }
    res.render(__dirname + '/update_student.ejs', { student: result });
  })
})


app.post('/updatedata', function (req, res) {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).send('ID, Name, Email, and Password are required....');
  }

  const query = "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?";
  const values = [name, email, password, id];

  con.query(query, values, function (error, results) {
    if (error) {
      console.error(error);
      return res.status(500).send('Data not updated...');
    }

    res.redirect('/getalldata');
  });
});


app.get("/deletedata", function (req, res) {
  const sql = "DELETE FROM user WHERE id = ?";
  const id = req.query.id;

  con.query(sql, [id], function (error, result) {
    if (error) {
      res.status(500).send('Data not delete...');
    }
    res.redirect("/getalldata")
  })
})


PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});