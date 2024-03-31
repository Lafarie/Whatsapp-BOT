//add values to backup google sheet for issues incase
fetch("https://sheetdb.io/api/v1/n5of53ejptco6")
.then((response) => response.json())
.then((data) => {
  // Add 'id' and 'date' fields to each entry
  const modifiedData = data.map((entry) => ({
    id: "INCREMENT",
    date: new Date().toISOString(), // Current date and time
    ...entry, // Spread existing entry properties
  }));

  // Read the values and store them in an array or perform any desired operations
  const values = modifiedData.map((entry) => [
    entry.id,
    entry.date,
    entry.Name,
    entry.Number,
  ]);

  // Assuming you have another sheet endpoint where you want to paste the values
  const pasteEndpoint = "https://sheetdb.io/api/v1/bwzepplqnn59m";

  // Create a new fetch request to paste the values to the other sheet
  fetch(pasteEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Values copied successfully:", result);
    })
    .catch((error) => {
      console.error("Error copying values:", error);
    });
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
