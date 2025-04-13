const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const logDir = '/home/nexonstu/public_html/healthchecks';
const getDateEndpoint = 'https://api.nexonstudio.pl/uuid/v4';
const postDiscordEndpoint = 'https://api.nexonstudio.pl/discord';

const connection = mysql.createConnection({
  host: '65.21.194.246',
  user: 'nexonstu',  // Podaj swoją nazwę użytkownika
  password: 'Maka0803#',  // Podaj swoje hasło
  database: 'nexonstu_status'  // Podaj nazwę swojej bazy danych
});

function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są liczone od 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const services = [
  {
    id: 1,
    url: "https://api.nexonstudio.pl/uuid/v4",
    service_name: "api.nexonstudio.pl/uuid/v4",
    // service_name: "uuid-generator",
    application: "endpoint",
  },
  {
    id: 2,
    url: "https://nexonstudio.pl/",
    service_name: "nexonstudio.pl",
    application: "endpoint",
  },
  {
    id: 3,
    url: "https://poland.payu.com/",
    service_name: "poland.payu.com",
    application: "strona",
  },
  {
    id: 4,
    url: "https://przelewy24.pl/",
    service_name: "przelewy24.pl",
    application: "strona",
  },
  {
    id: 4,
    url: "https://przelewy24.pl/",
    service_name: "przelewy24.pl",
    application: "strona",
  },
  {
    id: 5,
    url: "https://panel.przelewy24.pl/",
    service_name: "panel.przelewy24.pl",
    application: "strona"
  }

  //   {
  //     "url":"https://api.nexonstudio.pl/logbook-backend-healthcheck",
  //     "service_name": "logbook-backend-healthcheck",
  //     "application":"endpoint"
  //  }
];
async function main() {
  for (i = 0; i < services.length; i++) {
    await checkEndpoint(services[i].id,services[i].url, services[i].service_name, services[i].application)
  }
  connection.end(); // Zamknięcie połączenia z bazą danych po zakończeniu operacji
}
async function checkEndpoint(id,url, service_name, application) {

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const successMessage = `[${getFormattedDate()}] - Poprawna komunikacja z endpointem ${url}.\n`;
      fs.appendFile(
        path.join(logDir, "success.txt"),
        successMessage,
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );

      connection.query(`UPDATE status SET status=1,last_update='${getFormattedDate()}' WHERE service_name = '${service_name}'`, (error, results) => {
        if (error) {
          console.error('Błąd w zapytaniu:', error);
          return;
        }
      });

    }
  } catch (error) {
    const website_error = error.message;
    const errorMessage = `[${getFormattedDate()}] - Błąd podczas komunikacji z endpointem ${getDateEndpoint}: ${error.message}\n`;

    connection.query(`UPDATE status SET status=0,last_update='${getFormattedDate()}',last_failure ='${getFormattedDate()}' WHERE service_name = '${service_name}'`, (error, results) => {
      if (error) {
        console.error('Błąd w zapytaniu:', error);
        return;
      }
    });

    connection.query(`INSERT INTO logs (service_id,failure_date,additional) VALUES(${id},'${getFormattedDate()}','${website_error}');`, (error, results) => {
      if (error) {
        console.error('Błąd w zapytaniu:', error);
        return;
      }
    });

    fs.appendFile(path.join(logDir, 'error.txt'), errorMessage, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    await sendPostToDiscordEndpoint(application, url);
  }
}

async function sendPostToDiscordEndpoint(application, url) {
  try {
    const response = await axios.post(postDiscordEndpoint, { application: `${application}`, profile: `${service_name}` });
    if (response.status === 200) {
      console.log('Post request to Discord endpoint was successful.');
    }
  } catch (error) {
    console.error('Failed to send post request to Discord endpoint:', error.message);
  }
}

main();