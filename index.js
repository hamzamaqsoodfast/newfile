const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const express = require('express');
const app = express();
const fs = require('fs');

const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://airo-email-extractor-default-rtdb.firebaseio.com"
});

const WebSocket = require('ws'); // Move the WebSocket import here
function capitalizeFirstLetter(inputString) {
  if (inputString.length === 0) {
    return inputString;
  }

  // Capitalize the first letter and concatenate it with the rest of the string
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}


// Define routes and middleware
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});
const wss = new WebSocket.Server({ port: 8080 }); // Set the desired port

// Define routes and middleware
app.get('/scrap', async (req, res) => {
  try {
    var moreresults=0;
    var breakloop=0;
    const text = req.query.text;
    const text1 = req.query.text1;// Convert text1 to lowercase
    const text2 = req.query.text2;
    const text3 = req.query.text3;
    const text4 = req.query.text4;
    console.log(text);
    console.log(text1);
    console.log(text2);
    console.log(text3);

    // Set up Chrome options to run in incognito mode and with a proxy
    const options = new chrome.Options()
   //   .addArguments('--incognito')

    // Create a new instance of the WebDriver
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    if (text4 === 'Google') {
      await driver.get('https://www.google.com/');

      // Find the search input element, enter the search query, and hit Enter
      const searchInput = await driver.findElement(By.xpath('//*[@id="APjFqb"]'));
      if(text3=='gmail')
      {
      var message =  text + ' ' + text2 +' '+'('+ '"@gmail.com "'+')'+ ' AND '+ 'site:' + text1;
      }
      if(text3=='yahoo')
      {
        var message =  text + ' ' + text2 +' '+'('+ '"@yahoo.com "'+')'+ ' AND '+ 'site:' + text1;
      }
      if(text3=='hotmail')
      {
        var message =  text + ' ' + text2 +' '+'('+ '"@hotmail.com "'+')'+ ' AND '+ 'site:' + text1;
      }
      if(text3=='outlook')
      {
        var message =  text + ' ' + text2 +' '+'('+ '"@outlook.com "'+')'+ ' AND '+ 'site:' + text1;
      }
      if(text3=='all')
      {
        var message =  text + ' ' + text2 +' '+'('+ '"@gmail.com " OR "@yahoo.com" OR "@hotmail.com" OR "@outlook.com" '+')'+ ' AND '+ 'site:' + text1;
      }
      if(text3=='business')
      {
        var message =  text + ' ' + text2 +' '+ 'AND '+ 'site:' + text1;
      }
      await searchInput.sendKeys(message, Key.RETURN);
      while (true && breakloop==0) {
      // Wait for the search results to load
      await driver.wait(until.elementLocated(By.css('div.g')), 1000000);
      const hamza = await driver.findElements(By.css('div.kvH3mc'));
const page=await driver.findElement(By.id('cnt'));
  const searchresults = await driver.findElements(By.css('div.g'));
 for(let i=0; i<searchresults.length; i++)
 {
if(moreresults==1 && i+1==searchresults.length)
{
  breakloop=1;
  break;
}
  const meta_description = await searchresults[i].findElement(By.css('div.VwiC3b span')).catch(() => null);
  const meta_title = await searchresults[i].findElement(By.css('h3')).catch(() => null);
  const anchorElement = await searchresults[i].findElement(By.css('div.yuRUbf a')).catch(() => null);



  // Check if the elements were found before extracting data
  const anchorHref = anchorElement ? await anchorElement.getAttribute('href') : 'N/A';
  if(text3=='gmail')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
const emailRegex = /\b[\w\.-]+@gmail\.com\b/g;
var gmailAddresses = description.match(emailRegex) || [];

  }
  if(text3=='yahoo')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
const emailRegex = /\b[\w\.-]+@yahoo\.com\b/g;
var gmailAddresses = description.match(emailRegex) || [];

  }
  if(text3=='hotmail')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
const emailRegex = /\b[\w\.-]+@hotmail\.com\b/g;
var gmailAddresses = description.match(emailRegex) || [];

  }
  if(text3=='outlook')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
const emailRegex = /\b[\w\.-]+@outlook\.com\b/g;
var gmailAddresses = description.match(emailRegex) || [];

  }
  if(text3=='all')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
    const emailRegex = /\b[\w\.-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)\b/g;
    var gmailAddresses = description.match(emailRegex) || [];
    
  }
  if(text3=='business')
  {
    const description = meta_description ? await meta_description.getText() : 'N/A';
const emailRegex = /[\w\.-]+@(?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)\w+\.\w+/g;
var gmailAddresses = description.match(emailRegex) || [];

// Now, allEmailAddresses will contain all email addresses except those with gmail.com, yahoo.com, outlook.com, and hotmail.com domains.

    
  }
const title = meta_title ? await meta_title.getText() : 'N/A';

wss.clients.forEach((client) => {
  if (gmailAddresses.length > 0) {
    gmailAddresses.forEach((phoneNumber) => {
      const response = {
        anchortag: anchorHref,
        desc: gmailAddresses,
        title: title,
        platform : capitalizeFirstLetter(text1)

      };
      client.send(JSON.stringify(response));
    });
  } else {
    const response = {
      anchortag: anchorHref,
      desc: 'No Email address found',
      title: title,
      platform : capitalizeFirstLetter(text1)

    };
    client.send(JSON.stringify(response));
  }
});

  // console.log(`Search result: ${i}`);
  // console.log(`Anchor Href: ${anchorHref}`);
  // console.log(`Meta Description: ${description}`);
  // console.log(`Meta Title: ${title}`);
  // console.log(`---------------------------- `);


  }
  
  try {
    const nextButton = await driver.findElement(By.id('pnnext'));
    await nextButton.click();
  } catch (error) {
    const div = await driver.findElement(By.css('div.GNJvt.ipz2Oe'));

    // Check if the element is found
    if (div) {
     for (let i = 0; i < 1500; i++) {
    await driver.executeScript('window.scrollBy(0, 500);');
  
    try {
      const div = await driver.findElement(By.css('div.GNJvt.ipz2Oe'));
      await div.click();
    } catch (error) {
      // Handle the error (div not found) here or simply continue scrolling
      console.log("Div not found, continuing scrolling...");
    }
  
    // Check for the presence of the <p> element with id "ofr" without raising an error
    const ofrElement = await driver.findElement(By.id('ofr')).catch(() => null);
  
    if (ofrElement) {
      moreresults=1;
      console.log("terminated the loop");

      break; // Exit the loop when 'ofr' element is found
    }
  }
    } else {
      break;    
    }



    }  
  }
  
  
  


}

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error opening WhatsApp web');
  }
});


app.get('/vallog', async (req, res) => {
  try {
    const email1 = req.query.email;
    const purchasekey1 = req.query.purchasekey;
console.log(email1);
console.log(purchasekey1);
    const database = admin.database();
    const usersRef = database.ref('users');
    let loginstatus = "";
    let useremail="";
    // Create a response object
   
    usersRef.once('value', (snapshot) => {
      const users = snapshot.val();
      const validUser = Object.values(users).find(
        (user) => user.email === email1 && user.purchasekey === purchasekey1 && user.status!='active'
      );

      if (validUser) {
        fs.writeFile(__dirname + '/cls/amash/files2/response.txt', '1', (err) => {
          if (err) {
            console.log('Error writing to file');
          } else {
            // Find the user with the specified email
database.ref('users')
.orderByChild('email')
.equalTo(email1)
.once('value')
.then((snapshot) => {
  // Loop through the matching users (there might be multiple users with the same email)
  snapshot.forEach((childSnapshot) => {
    const userId = childSnapshot.key;
    
    // Update the status to "sent" for the found user
    database.ref('users').child(userId).update({ status: 'active' })
      .then(() => {
    //    console.log(`Status updated to "sent" for user with email: ${email1}`);
      })
      .catch((error) => {
    //    console.error("Error updating status:", error);
      });
  });
})
.catch((error) => {
 // console.error("Error searching for user with email:", error);
});

          //  console.log('Redirecting you to Software Dashboard');
            loginstatus = "Validated";
            const response = {
              loginstatus: loginstatus,
              email:email1
            };
            wss.clients.forEach((client) => {
              client.send(JSON.stringify(response));
            });
            console.log(loginstatus);
          }
        });
      } else {
     //   console.log('Invalid email or password');
        loginstatus = "Incorrect Login email or purchase key or account already in use!";
        const response = {
          loginstatus: loginstatus

        };
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(response));
        });
      console.log(loginstatus);
      }
      
    
  //console.log(loginstatus);
      // Send the response to the connected clients via WebSocket
     
    });
  } catch (error) {
  //  console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/trial', async (req, res) => {
  try {
    const email = req.query.email;
    console.log('Error writing to file');

    const database = admin.database();
    const usersRef = database.ref('users');
    let blockage="";
    // Create a response object
   
    usersRef.once('value', (snapshot) => {
      const users = snapshot.val();
      const validUser = Object.values(users).find(
        (user) => user.email === email && user.status!='active'
      );

      if (validUser) {
        fs.writeFile(__dirname + '/cls/amash/files2/response.txt', '1', (err) => {
          if (err) {
            console.log('Error writing to file');
          } else {
            // Find the user with the specified email
database.ref('users')
.orderByChild('email')
.equalTo(email)
.once('value')
.then((snapshot) => {
  // Loop through the matching users (there might be multiple users with the same email)
  snapshot.forEach((childSnapshot) => {
    const userId = childSnapshot.key;
     
    // Update the status to "sent" for the found user
    database.ref('users').child(userId).update({ status: 'inactive' })
      .then(() => {
       console.log(`Status updated to "sent" for user with email: ${email}`);
      })
      .catch((error) => {
    //    console.error("Error updating status:", error);
      });
  });
})
.catch((error) => {
 // console.error("Error searching for user with email:", error);
});

          //  console.log('Redirecting you to Software Dashboard');
            blockage = "block";
            const response = {
              blockage: blockage,
            };
            wss.clients.forEach((client) => {
              client.send(JSON.stringify(response));
            });
         
          }
        });
      } else {
     //   console.log('Invalid email or password');
     blockage = "notblock";
        const response = {
          blockage: blockage

        };
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(response));
        });
     //  console.log(blockage);
      }
      
    
  //console.log(loginstatus);
      // Send the response to the connected clients via WebSocket
     
    });
  } catch (error) {
  //  console.error('Error:', error);
  }
});
















// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

