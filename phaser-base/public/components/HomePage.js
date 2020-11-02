let homePage = `<p>Welcome to MyCMS...</p>`;

let page = document.querySelector("#page");

const HomePage = () => {
  return (page.innerHTML = homePage);
};

export default HomePage;
