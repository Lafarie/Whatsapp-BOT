const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, Buttons } = require("whatsapp-web.js");
const greating = ["hi","hii","hiii","hey", "hello", "whatsup", "ado"];
const badWords = ["hutto", "pakko", "kariyo", "hutti", "fuck"];

let numbers = [];
let alreadyP = 0;
let successCount = 0;
let errorNumbers = [];
let noWhatsapp = [];
let myGroupName = "";
let groupLink = "";
let temp = "";
let myNumber = "947761234567@c.us"; // enter your number here

const axios = require("axios");

//meme
// const options = {
//   method: "GET",
//   url: "https://ronreiter-meme-generator.p.rapidapi.com/images",
//   headers: {
//     "X-RapidAPI-Key": "c152e18ad2mshdb04cdc6e367685p19b59ajsn44f7320e91f4",
//     "X-RapidAPI-Host": "ronreiter-meme-generator.p.rapidapi.com",
//   },
// };

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (message) => {
  let check = message.body;
  let group = await message.getChat();
  let text = await message.getContact();
  console.log(
    check +
      "\n" +
      text.number +
      " " +
      text.name +
      " " +
      text.pushname +
      " " +
      group.name +
      "\n"
  );
});

// welcome
client.on("ready", () => {
  client.on("message_create", async (message) => {
    const chat = message.getChat();
    if (!chat.isGroup) {
      if (greating.includes(message.body.toLowerCase())) {
        message.reply(
          "HI, I'm Farhad's Chat bot.If you need more help type help "
        );
      }
    }
  });
});


// other
client.on("ready", () => {
  client.on("message_create", async (message) => {

    const check = message.body;
    const chat = message.getChat();
    if (!chat.isGroup) {
      if (check.toLowerCase().includes("delete this")) {
          message.reply("ok ok ") 
      }
      if (check.toLowerCase().includes("delete")) {
          message.reply("ok ok, I shared you because its looks cute 😒")
      }
    }
  });
});

//send user menu
client.on("message_create", async (message) => {
  if (message.body.toLowerCase() === "help" || message.body.toLowerCase() === "!help") {
    message.reply(
      `Commands\n1. !joke - Get joke comment\n2. !add - add users to group\n3. Comming soon.`
    );
    return;
  }
});

//send meme jokes
client.on("message_create", async (message) => {
  const check = message.body;
  try {
    if (
      check.toLowerCase() === "!joke" ||
      check.toLowerCase() === "joke"
    ) {
      const joke = await axios(
        "https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?safe-mode"
      ).then((res) => res.data);
      const jokeMsg = await message.reply(joke.setup || joke.joke);
      if (joke.delivery)
        setTimeout(function () {
          jokeMsg.reply(joke.delivery);
        }, 5000);
    }
  } catch (error) {
    console.error(error);
    return "Sorry, I could not fetch a joke at this time."; // handle error and return a default message
  }
});

// //ping pong game
// client.on("message_create", async (message) => {
//   const check = message.body;
//   if (
//     check.toLowerCase() === "!ping" ||
//     check.toLowerCase() === "ping"
//   ) {
//     message.reply("pong");
//   }
//   if (
//     check.toLowerCase() === "!pong" ||
//     check.toLowerCase() === "pong"
//   ) {
//     message.reply("ping");
//   }
// });

// client.on("message", async (message) => {
//   if (message.body === "😂") {
//     message.reply("What funny about it.");
//   }
// });

// bad words
// client.on("message", async (message) => {
//   if (badWords.includes(message.body.toLowerCase())) {
//     message.reply(
//       "We know you can say " + message.body + ". but shut the fkup"
//     );
//   }
// });

// client.on("message", async (message) => {
//   if (message.body.toLowerCase().includes("!link")) {
//     const temp = message.body;
//     message.reply(temp.substring(6));
//   }
// });

client.on("message_create", async (message) => {
  const check = message.body;
  if (check.toLowerCase() === "!admin") {
    let text = await message.getContact();
    console.log(text.isMe);
    if (text.isMe) {
      const great = message.reply("Hey boss whats up");
      message.reply("admin comands still not available but some following\n1.");
    } else {
      message.reply("Nice try you almost got me haha your not admin.");
    }
  }
});

//add user part
client.on("message_create", async (message) => {
  const check = message.body;
  if (check.toLowerCase() === "!add" || check.toLowerCase() === "add") {
    const temp = await message.reply(
      "Add your Numbers to this link: \nhttps://docs.google.com/spreadsheets/d/1uppXgyuMYAtA7QgzDhWkEmHdN7yvuG1QhJoRCs3db1s/edit?usp=sharing \n\nMake sure I'm in that group and should have permison to add participants."
    );
    temp.reply(
      `After adding the numbers to that link\nNow use following format to add users\n\nExample :\n\n*!add Group Name* ♥\n\nAnd make sure to input the group name without any mistakes(include if has emojis)`
    );
    console.log("it came here 1111");
  }
});

// Waiting for the ready state
client.on("ready", () => {
  console.log("Client is ready!");

  // Checking whether the message is asking to add participants
  client.on("message_create", async (message) => {
    const check = message.body;
    if (check.toLowerCase().startsWith("!add") && check.length > 9) {
      successCount = 0;
      alreadyP = 0;
      errorNumbers = [];
      noWhatsapp = [];
      numbers = [];
      temp = message.body; //!add https://hwasdwadasdasd.com Temp group was now changed
      let spaceIndices = []; //{4,10,14}

      if (temp[0] === " ") {
        client.sendMessage(
          message.from,
          "Please no space in start I'm lazy to validate them"
        );
        return; // Stop further execution
      }

      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === " ") {
          spaceIndices.push(i);
        }
      }

      groupLink = "https://sheetdb.io/api/v1/n5of53ejptco6";
      // groupLink = temp.slice(spaceIndices[0] + 1, spaceIndices[1]); // used -1 for get 1 index back from space
      myGroupName = temp.slice(spaceIndices[0] + 1);
      try {
        // Get all chats
        const getChats = await client.getChats();
        const check = getChats.find((chat) => chat.name === myGroupName);

        //check if its a group or not
        if (check.isGroup) {
          const participant = check.groupMetadata.participants.find(
            (participant) => participant.id._serialized === myNumber
          );
          // check am i admin in that group
          if (
            participant.id._serialized === myNumber &&
            participant.isAdmin === false
          ) {
            message.reply(`I'm not admin in this ${myGroupName} group` );
            message.reply(
              "Make sure to give me admin to add participents. Remove later if you want"
            );
            console.log(`I'm not admin this ${myGroupName}`);
            return;
          }
        } else {
          message.reply(
            "Group not found, Make sure to add me to that group and check the spellings"
          );
          console.log("somebody found your contact");
          return;
        }
        // Return the array of group name
      } catch (error) {
        console.log(error);
        message.reply(
          "Group not found, Make sure to add me to that group and check the spellings"
        );
        console.log(
          "Group not found, Make sure to add me to that group and check the spellings"
        );
        return; // handle error and return a default message
      }
      if (!isValidURL(groupLink)) {
        message.reply(message.from, "Error url wrong");
        return; // Stop further execution
      }
      try {
        fetch(groupLink)
          .then((response) => response.json())
          .then((data) => {
            if (data.includes("404")) {
              message.reply(message.from, "Error 404 google sheet not found");
              return;
            }
            data.forEach((item) => {
              let tempNum = item.Number;
              let result = tempNum.replace(/\s/g, "");
              if (result[0] === "0") {
                result = "94" + result.slice(1);
              }
              if (result[0] === "7") {
                result = "94" + result;
              }
              numbers.push(`${result}@c.us`);
            });
            console.log(numbers);
          });
      } catch (error) {
        console.log(error);
        message.reply("Error getting data try again in few morments");
        return;
      }
      setTimeout(async function () {
        try {
          const chats = await client.getChats();
          const myGroup = chats.find((chat) => chat.name === myGroupName);

          if (!myGroup) {
            console.log(
              "Group not found, Make sure to add me to that group and check the spellings"
            );
            return;
          }

          if (numbers.length !== 0) {
            for (let i = 0; i < numbers.length; i++) {
              try {
                let checkContact = await client.getContactById(`${numbers[i]}`);
                let checkParticipant =
                  await myGroup.groupMetadata.participants.find(
                    (participant) => participant.id._serialized === numbers[i]
                  );
                console.log(checkContact);
                console.log(checkParticipant);
                if (checkContact.isWAContact) {
                  if (
                    !checkParticipant ||
                    checkParticipant.id._serialized !== numbers[i]
                  ) {
                    await myGroup.addParticipants([`${numbers[i]}`]);
                    successCount += 1;
                  } else {
                    alreadyP += 1;
                  }
                } else {
                  noWhatsapp.push(numbers[i]);
                }
              } catch (error) {
                errorNumbers.push(numbers[i]);
                console.error("Error:", error);
              }
            }
          } else {
            console.log("Nothing to add");
            message.reply("Nothing to add");
            return;
          }
        } catch (error) {
          console.error("Error:", error);
        }

        // after work done
        // add values to backup google sheet for issues incase
        // Fetch data from the source sheet
        try {
          fetch("https://sheetdb.io/api/v1/n5of53ejptco6")
            .then((response) => response.json())
            .then((data) => {
              // Modify the retrieved data and add id and date
              const modifiedData = data.map((entry) => ({
                Id: "INCREMENT",
                Date: new Date().toISOString(), // Current date and time
                Name: entry.Name || "No name",
                Number: entry.Number,
              }));

              // Assuming you have the endpoint of the target sheet where you want to paste the values
              const pasteEndpoint = "https://sheetdb.io/api/v1/bwzepplqnn59m";

              // Create a new fetch request to paste the values to the target sheet
              fetch(pasteEndpoint, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: modifiedData }),
              })
                .then((response) => response.json())
                .then((result) =>
                  console.log("Values copied successfully:", result)
                )
                .catch((error) =>
                  console.error("Error copying values:", error)
                );
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });

          //delete the after work done
          fetch("https://sheetdb.io/api/v1/n5of53ejptco6/all", {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
        } catch (error) {
          console.log(error);
          message.reply("My erorr 502 ");
        }
      }, 5000);

      // After the loop completes, display the counts
      setTimeout(function () {
        if (numbers.length !== 0) {
          client.sendMessage(
            message.from,
            `Total numbers counted: ${numbers.length}`
          );
          client.sendMessage(
            message.from,
            `Participants added successfully: ${successCount}`
          );

          client.sendMessage(message.from, `Already participants: ${alreadyP}`);

          //Error number lenght
          if (errorNumbers.length !== 0) {
            client.sendMessage(
              message.from,
              `Errors count when adding: ${errorNumbers.length}`
            );

            client.sendMessage(
              message.from,
              `Errors numbers:  ${errorNumbers}`
            );
          }
          //no whatsapp
          if (noWhatsapp.length !== 0) {
            client.sendMessage(
              message.from,
              `No whatsaap count:  ${noWhatsapp.length}`
            );
            client.sendMessage(
              message.from,
              `No whatsaap numbers:  ${noWhatsapp}`
            );
          }
          //error numbers
          if (errorNumbers.length >= 1) {
            
            client.sendMessage(
              message.from,
              `2 reason why error can be \n 1. Above errors numbers not correct\n 2.The User is not using whatsapp`
            );
          }
          //final output
          const final = message.getChat();
          if (final.isGroup) {
            message.reply(
              message.from,
              "All the information sent to you privately"
            );
          }

          console.log("Participants added successfully:", successCount);
          console.log("Errors encountered:", errorNumbers.length);
          return;
        }
      }, 15000);
    }
  });
});

// function isValidURL(url) {
//   const urlPattern = /^https:\/\/sheetdb\.io\//i;
//   return urlPattern.test(url);
// }
function isValidURL(url) {
  return url.includes("https://sheetdb.io/");
}

//check im a admin
// const groupChat = msg.getChat();
// const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
// if (botChatObj.isAdmin){
// 	console.log("I am admin in this group");
// }

client.initialize();
