"use strict";

const FILE_PATH = __dirname + "/users.json";

class User {
  constructor(username, email, password) {
    this.id = nextId();
    this.username = username;
    this.email = email;
    this.password = password;
    this.highScore = null;
  }

  save() {   
    let userList = getUserListFromFile(FILE_PATH);
    userList.push({ id:this.id, username:this.email, email: this.email, password: this.password, highScore: this.highScore });
    saveUserListToFile(FILE_PATH, userList);
  }

  checkCredentials(email, password) {
    if (!email || !password) return false;
    let userFound = User.getUserFromList(email);
    console.log("User::checkCredentials:", userFound);
    if (!userFound) return false;
    return userFound.password === password;   
  }

  static get list() {   
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  static isUser(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isUser:",userFound);
    return userFound!==undefined;   
  }

  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

  static getHighScore(id){
    let userList = getUserListFromFile(FILE_PATH);
    return userList.find((user) => user.id == id).highScore;
  }

  static getAllHighScores(){
    let userList = getUserListFromFile(FILE_PATH);
    let plop = userList.map((user) => user.highScore);
    //console.log(plop);
    return plop;
  }

}

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

function nextId(){
  let userList = getUserListFromFile(FILE_PATH);
  if(userList.length == 0) return 1;

  return userList[userList.length-1].id+1;
}

module.exports = User;
