$(function () {
  class Weather {
    constructor(city, lat, lon, temp, sky, wind, humidity, id) {
      this.city = city;
      this.lat = lat;
      this.lon = lon;
      this.temp = temp;
      this.sky = sky;
      this.wind = wind;
      this.humidity = humidity;
      this.id = id;
    }

    getOurWeather() {
      $('#my-city h5').text(this.city)
      $('#my-city .temp').text(this.temp + ' F')
      $('#my-city .sky').text(this.sky)
      $('#my-city .wind').text(this.wind)
      $('#my-city .humidity').text(this.humidity + ' %')
    }
    getCityWeather(id) {
      $('.cards-adds').append('<div class="card card-city-add mt-2" id="' + id + '"><div class="card-body"><h5 class="card-title city">Dnipro</h5><ul class="list-group list-group-flush"><li class="list-group-item"><span><i class="fas fa-thermometer-full"></i></span><span class="temp data-item temp">23.58</span></li><li class="list-group-item"><span><i class="fab fa-skyatlas"></i></span><span class="data-item sky">23.58</span></li><li class="list-group-item"><span><i class="fas fa-wind"></i></span><span class="data-item wind">23.58</span></li><li class="list-group-item"><span><i class="fas fa-tint"></i></span><span class="data-item humidity">23.58</span></li></ul></div><button class="btn btn-danger delete-add-city">Delete</button></div>');
      console.log(`#${id} .temp`);
      $(`#${id} h5`).text(this.city)
      $(`#${id} .temp`).text(this.temp + ' F')
      $(`#${id} .sky`).text(this.sky)
      $(`#${id} .wind`).text(this.wind)
      $(`#${id} .humidity`).text(this.humidity + ' %')
    }

  }

  $(document).ready(function () {
    const items = [];
    const localCities = []
    let usd;
    let eur;
    let btc;

    getAPICurrency()
    getWeather()

    function getAPICurrency() {

      $.getJSON("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5", function (data) {
        $.each(data, function (key, val) {
          items.push(val);
        });

        usd = +items[0].buy
        eur = +items[1].buy
        btc = +items[3].buy

        $('#usd span').text(usd.toFixed(2));
        $('#eur span').text(eur.toFixed(2));
        $('#btc span').text(btc.toFixed(2));
      });


      setTimeout(() => {
        getAPICurrency()
        console.log('work');

      }, 1000 * 60 * 60);

    }



    function getWeather() {

      let weather;
      navigator.geolocation.getCurrentPosition(function (position) {

        let lat = position.coords.latitude
        let lon = position.coords.longitude
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=8f393667b958b91596e88150e845c716", function (data) {

          my_weather = new Weather(data.name, lat, lon, data.main.temp, data.weather[0].description, data.wind.speed, data.main.humidity)


          if (my_weather !== '') {

            my_weather.getOurWeather()
            $('#my-city').addClass('d-block')
          } else {
          }
        });
      });

    }


    function getLocalCities() {
      for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
        console.log(value);


        $('.cards-adds').append('<div class="card card-city-add mt-2" id="' + value.id + '"><div class="card-body"><h5 class="card-title city">Dnipro</h5><ul class="list-group list-group-flush"><li class="list-group-item"><span><i class="fas fa-thermometer-full"></i></span><span class="temp data-item temp">23.58</span></li><li class="list-group-item"><span><i class="fab fa-skyatlas"></i></span><span class="data-item sky">23.58</span></li><li class="list-group-item"><span><i class="fas fa-wind"></i></span><span class="data-item wind">23.58</span></li><li class="list-group-item"><span><i class="fas fa-tint"></i></span><span class="data-item humidity">23.58</span></li></ul></div><button class="btn btn-danger delete-add-city">Delete</button></div>');
        $(`#${value.id} h5`).text(value.city)
        $(`#${value.id} .temp`).text(value.temp + ' F')
        $(`#${value.id} .sky`).text(value.sky)
        $(`#${value.id} .wind`).text(value.wind)
        $(`#${value.id} .humidity`).text(value.humidity + ' %')
      }



    }


    getLocalCities()
    function web_storage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }

    function deleteLocalCities() {
      $('.delete-add-city').click(function (e) {
        e.preventDefault();
        $(e.target.offsetParent).fadeOut(400);
        setTimeout(() => {
          $(e.target.offsetParent).remove();
        }, 300);
        console.log(e.target.parentElement.id);

        localStorage.removeItem('city' + e.target.parentElement.id)

      })
    }
    deleteLocalCities()


    $('.delete-my-city').click(function (e) {
      e.preventDefault();
      $(e.target.offsetParent).fadeOut(400);
      setTimeout(() => {
        $(e.target.offsetParent).remove();
      }, 300);
      delete my_weather
    });



    if ($('#search-city').val() === '') {

      $('#search').submit(function () {
        var th = $(this);
        console.log(th[0][0].value);

        $.ajax({
          type: "GET",
          dataType: 'json',
          url: "http://api.openweathermap.org/data/2.5/weather?q=" + th[0][0].value + "&APPID=8f393667b958b91596e88150e845c716", //Change
          beforeSend: function () {
            console.log('loading');
          }
        }).done(function (data) {
          console.log(data);
          th[0][0].value = ''
          function addCityWeather() {


            window['weather_city' + data.id] = new Weather(data.name, '', '', data.main.temp, data.weather[0].description, data.wind.speed, data.main.humidity, data.id);
            window['weather_city' + data.id].getCityWeather(data.id);



            if (web_storage()) {
              localStorage.setItem('city' + data.id, JSON.stringify(window['weather_city' + data.id]));
            } else {
              alert('Поставь нормальный браузер, упырь')
            }




          }
          addCityWeather()

        }).fail(function () {
          alert("City is not found");
          th[0][0].value = ''
        });
        return false;
      });

    } else {
      $('.input-group').addClass('error');
    }

  })
 
})