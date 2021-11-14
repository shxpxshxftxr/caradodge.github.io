/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let cafeCounter = document.getElementById("coffee_counter");
  cafeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);

  for (let i = 0; i < data.producers.length; i++) {
    if (!data.producers[i].unlocked) {
      data.producers[i].unlocked = false;
    }
  }
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.filter((prodObj) => {
    if (prodObj.unlocked === false && coffeeCount >= prodObj.price / 2) {
      prodObj.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter((obj) => {
   if (obj.unlocked === true){
     return obj
   }
  });
}

function makeDisplayNameFromId(id) {
  id = id.replaceAll("_", " ");
  let titledId = id[0].toUpperCase();

  for (let i = 1; i < id.length; i++) {
    id[i - 1] === " " ? (titledId += id[i].toUpperCase()) : (titledId += id[i]);
  }
  return titledId;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let producerContainer = document.getElementById("producer_container");
  deleteAllChildNodes(producerContainer);

  unlockProducers(data.producers, data.coffee);
  let producers = getUnlockedProducers(data);

  for (let i = 0; i < producers.length; i++) {
    producerContainer.appendChild(makeProducerDiv(producers[i]));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let prods = data.producers;

  let myHell = prods.filter((prod) => {
    if (prod.id === producerId) {
      return prod;
    }
  });
  return myHell[0];
}

function canAffordProducer(data, producerId) {
  let playerProd = getProducerById(data, producerId);
  if (playerProd.price <= data.coffee) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  let cpsElem = document.getElementById("cps");
  cpsElem.innerText = cps;
  return cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let prods = data.producers;

  if (canAffordProducer(data, producerId)) {
    let index = prods.indexOf(getProducerById(data, producerId));
    let myGuy = prods[index];
    myGuy.qty++;
    data.coffee -= myGuy.price;
    myGuy.price = updatePrice(myGuy.price);
    data.totalCPS = updateCPSView(myGuy.cps);
    return true;
  }

  return false;
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    let prodId = event.target.id.slice(4);

    if (canAffordProducer(data, prodId)) {
      attemptToBuyProducer(data, prodId);
      data.coffee--;
      clickCoffee(data);
    } else {
      return window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  data.coffee--;
  clickCoffee(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
