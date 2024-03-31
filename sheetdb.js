const Numbers = [];

async function fetchNumbers() {
  const response = await fetch('https://sheetdb.io/api/v1/n5of53ejptco6');
  const data = await response.json();
  
  data.forEach((item) => {
    Numbers.push(`${item.Number}@c.us`);
  });
  console.log(Numbers);
  // console.log(Numbers[0]);
  
  if(true){
    console.log(Numbers[0]);
    console.log(":");
  }
}

fetchNumbers();
