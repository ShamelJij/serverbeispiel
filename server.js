import express from 'express';
import fetch from 'node-fetch';
import { parseString } from 'xml2js';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<html lang="en"><head> <!-- Required meta tags --> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <!-- Bootstrap CSS --> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/yeti/bootstrap.min.css"> --> <link rel="stylesheet" href="styles.css"> <title>new tab</title></head><body> <script src="app.js"></script> <!-- Option 2: jQuery, Popper.js, and Bootstrap JS --> <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script> <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script> <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script></body></html>`);


// Access the window and document objects
const { window } = dom;
const { document } = window;

// Now you can perform DOM operations using the document object
const div = document.createElement('div');
div.textContent = 'Hello, World! beispiel';
document.body.appendChild(div);

// Access the serialized HTML
const serializedHTML = dom.serialize();
console.log(serializedHTML);
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const redditUrl = 'https://www.reddit.com/r/worldnews/.rss';

  try {
    const response = await fetch(redditUrl);
    const xmlData = await response.text();
    const titles = await extractTitles(xmlData);

    // Display the first 5 titles in a simple table
    const tableHTML = `
      <table border="1">
        <tr><th>Title</th></tr>
        ${titles.slice(0, 20).map(title => `<tr><td>${title}</td></tr>`).join('')}
      </table>
    `;

    res.send(serializedHTML);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to extract titles from XML using xml2js
function extractTitles(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { strict: false, ignoreAttrs: true }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        try {
          const items = result.FEED?.ENTRY || [];
          const titles = items.map(item => item.TITLE?.[0]);
          resolve(titles);
          console.log(titles);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
