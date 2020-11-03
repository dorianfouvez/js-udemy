function setDateTime(){
    let divDate = document.getElementById("dateTime");
    let dateOfTheDay = new Date();
    let week = new Array("Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi");
    divDate.innerText = "Nous somme le " + week[dateOfTheDay.getDay()] + " " + dateOfTheDay.getDate() 
    + "/" + (dateOfTheDay.getMonth()+1) + "/" + dateOfTheDay.getFullYear();
}

// named export
export {setDateTime};