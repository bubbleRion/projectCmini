import mysql from "mysql"
import conn from "./myCON.js"



let connection = mysql.createConnection(conn)
connection.connect();

let sql = "desc pokemon;"

connection.query(sql, (err, results, fields)=>{
  if(err){
    console.log(err);
  }
  console.log(results);
})