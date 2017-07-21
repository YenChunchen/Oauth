var mysql = new require("mysql");
var mydb  = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "" //loclhost name
  });
module.exports = mydb;
