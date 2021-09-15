let getData = async (cityName) => {
    let preeData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=7674da634845e7c2d8c53ab0a48b8e29`
    );
    let data = await preeData.json();
  
    let dom = document.getElementById("t");
  
    dom.innerHTML = `<img src="./icons/${data.weather[0].icon}.png" alt="">
  <h3>${data.name}</h3>
  <hr>
  <h1>${Math.floor(data.main.temp - 273.15)} *C</h1>
  <p>${data.weather[0].description}</p>`;
  };
  
  let dom = document.getElementById("form_input")
  dom.onsubmit = (e)=>{
    e.preventDefault();
    let key = dom.city.value
    getData(key)
  }