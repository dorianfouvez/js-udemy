import Game from "./Game.js";

let homePage = `<p>Whant to play ??</p>`;

let page = document.querySelector("#page");

const HomePage = () => {

  Game();

  return (page.innerHTML = homePage);
};

export default HomePage;
