let page = document.querySelector("#page");

const ErrorPage = (err) => {
  let errorPage;
  if (!err) errorPage = `<p>There was an error.</p>`;
  else if (!err.message) errorPage = `<p>${err}</p>`;
  else errorPage = `<p>${err.message}</p>`;
  return (page.innerHTML = errorPage);
};

export default ErrorPage;
