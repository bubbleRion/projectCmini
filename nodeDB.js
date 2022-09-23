const mysql = require("mysql")
const conn = require("./myCON.js")
const path = require("path")
const bodyParser = require("body-parser")
const express = require("express")
const app = express();
const cors = require("cors")
app.set('port', process.env.PORT || 8000);

const connection = mysql.createConnection(conn);

// connection.connect();


// app.use(cors());

// app.use(express.static(path.join(__dirname , "./client/src")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname,"/index.html"));
// });
app.use(bodyParser.urlencoded({extended : true}))

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'dummy.html'))
})


app.post("/", (req, res)=> {
  // let sql = "insert into pokemon(no, name, type1, type2) values(5, 주완, 풀, 독);"

  let body = req.body
  console.log(body)
  let no = body.no
  let name = body.name
  let type1 = body.type1
  let type2 = body.type2

  let query = connection.query(`insert into pokemon(no, name, type1, type2) values("${no}", "${name}", "${type1}", "${type2}");`,  (err)=>{
    if(err){
      console.error(err)
    }
  })
})

// app.get("/slice", (req, res)=>{
//   let sql = "select * from type1;"
//   connection.query(sql, (err, result)=>{
//     if(err){
//       console.log(err)
//     }
  



//     res.send(result);
//   })
// })


app.post("/slice", (req, res)=> {
  // let sql = "insert into pokemon(no, name, type1, type2) values(5, 주완, 풀, 독);"

  let body = req.body
  console.log(body)
  let no = body.no
  let name = body.name
  let type1 = body.type1
  let type2 = body.type2

  let query = connection.query(`insert into pokemon(no, name, type1, type2) values("${no}", "${name}", "${type1}", "${type2}");`,  (err)=>{
    if(err){
      console.error(err)
    }
  })
})

app.get("/add", (req, res)=>{
  let sql = `CREATE TABLE type1(풀 INT, 불꽃 INT, 물 INT, 벌레 INT, 노말 INT)`
  connection.query(sql, (err, result)=>{
    if(err){
      console.log(err)
    }
    res.redirect("/")
  })
})

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, "login.html"))
})


app.post('/login',(req,res)=>{
  // let sql = 'insert into user (id , password) values("' + id + '", "' + password + '")'
  let isLogin = false;
  let body = req.body;
  console.log(body)
  connection.query(sql, (err, result)=>{
    if(err){
      console.log(err)
    }
    isLogin = result.map((item)=>{
      if(item.no === body.no && item.name === body.name){
        return true
      }
    })
    if(isLogin){
      res.sendFile(path.join(__dirname, "loginWin.html"));
    }
  })
})

app.get('/users', (req, res)=>{
  let sql = "select * from pokemon;"
  connection.query(sql, (err, result)=>{
    if(err){
      console.log(err)
    }
    res.send(result);
  })
})






app.listen(app.get("port"), ()=>{
  console.log('Express and MySql http://localhost:' + app.get("port"))
})



