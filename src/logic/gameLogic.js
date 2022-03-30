// Adds card to temporary stack of cards to be played
export function placeCard(card, hand, setHand, inPlay, setInPlay, setTopOfStack) {
  inPlay.push(card);
  setInPlay(inPlay);
  setTopOfStack(card);
  // remove 1 element at the index of the card
  hand.splice(hand.indexOf(card), 1);
  setHand(hand);
}

// Checks player's entire hand and grays out nonplayable cards
export function checkHand(hand, lastCardPlayed, inPlay, direction, setDirection) {
  let newHand = [];
  for (let i = 0; i < hand.length; i++) {
    //if the last card put down is rainbow, you can't put down any new cards.
    // rainbow cards are put down solo. They can't be part of a streak.
    if (inPlay.length > 0 && inPlay[inPlay.length - 1].color === "rainbow") {
      const toAdd = { color: hand[i].color, value: hand[i].value, gray: true }
      newHand.push(toAdd);
    }
    else {
      const result = checkSingleCard(hand[i], lastCardPlayed, inPlay, direction, setDirection);
      const toAdd = { color: hand[i].color, value: hand[i].value, gray: !result }
      newHand.push(toAdd);
    }
  }
  return newHand;
}

export function calculateCanPlaceCard(hand, lastCardPlayed, inPlay) {
  let i = 0;
  while (i < hand.length) {
    if (checkSingleCard(hand[i], lastCardPlayed, inPlay, "none")[0]) {
      return true;
    }
    i++;
  }
  return false;
}

// Drops one card at a time
function checkSingleCard(toConsider, lastCardPlayed, inPlay, direction, setDirection) {
  if (inPlay.length === 0) {
    return isValidFirstCard(toConsider, lastCardPlayed);
  }
  else {
    const result = isValidAdditionalCard(toConsider, inPlay[inPlay.length - 1], direction, setDirection);
    return result;
  }
}

const isSpecialCard = (card) => {
  return card.color === 'rainbow' || card.value === '+2' || card.value === 'reverse' || card.value === 'skip';
};

// toConsider is the card whose eligibility is being considered
// lastCard is the last card that was put down
export const isValidFirstCard = (toConsider, lastCard) => {
  if (toConsider.value === lastCard.value || toConsider.color === lastCard.color) {
    return true;
  }
  return isSpecialCard(toConsider);
};

// direction denotes the direction that the additional cards are going in
//   - direction = "increasing" if the user is increasing
//   - direction = "decreasing" if the user is decreasing
//   - direction = "none" if neither
// returns an array containing first if the additional card is valid, and second, the direction
// in which it's increasing or decreasing
export const isValidAdditionalCard = (toConsider, lastCard, direction, setDirection) => {
  if (isSpecialCard(toConsider)) {
    return false;
  }
  if (toConsider.value === lastCard.value) {
    return true;
  }
  if (isValidDecreasingCard(toConsider, lastCard)) {
    if (direction !== "increasing") {
      if (direction === "none") {
        setDirection("decreasing");
      }
      return true;
    }
  }
  else if (isValidIncreasingCard(toConsider, lastCard)) {
    if (direction !== "decreasing") {
      if (direction === "none") {
        setDirection("increasing");
      }
      return true;
    }
  }
  return false;
};

//used for sorting
const isLessThan = (cardA, cardB) => {
  if (!isSpecialCard(cardA) && !isSpecialCard(cardB)) {
    return Number(cardA) < Number(cardB);
  }
  return false;
};

//used for sorting
const isGreaterThan = (cardA, cardB) => {
  if (!isSpecialCard(cardA) && !isSpecialCard(cardB)) {
    return Number(cardA) > Number(cardB);
  }
  return false;
};

// The card being put down must be a special card or be greater than by one or be of the same value
// TODO
const isValidIncreasingCard = (card, topOfInPlay) => {
  return Number(card.value) === Number(topOfInPlay.value) + 1 || (Number(card.value) === 0 && Number(topOfInPlay.value) === 9);
};

// The card being put down must be a special card or be less than by one or be of the same value
// TODO
const isValidDecreasingCard = (card, topOfInPlay) => {
  return Number(card.value) === Number(topOfInPlay.value) - 1 || (Number(card.value) === 9 && Number(topOfInPlay.value) === 0);
};

export const addCardToPlayer = (players, playerId, addCount) => {
  players.map(player => {
    if (player.id === playerId) {
      player.cardCount = player.cardCount + addCount;
    }
    return player;
  });
};

export const addCardToMyHand = (hand, card) => {
  hand.push(card);
  return sortCards(hand);
};

export const subtractCard = (players, playerId, subtractCount) => {
  players.map(player => {
    if (player.id === playerId) {
      player.cardCount = player.cardCount - subtractCount;
    }
    return player;
  });
};

export const isGameOver = (players) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].cardCount <= 0) {
      return true;
    }
  }
  return false;
};

export const reset = (players) => {
  return players.map(player => {
    player.cardCount = 0;
    return player;
  });
};

function compareByColor(cardA, cardB) {
  const colors = ["red", "yellow", "green", "blue"];
  if (colors.indexOf(cardA.color) < colors.indexOf(cardB.color)) {
    return -1;
  }
  if (colors.indexOf(cardA.color) > colors.indexOf(cardB.color)) {
    return 1;
  }
  return 0;
}

function compareByValue(cardA, cardB) {
  if (isLessThan(cardA, cardB)) {
    return -1;
  }
  if (isGreaterThan(cardA, cardB)) {
    return 1;
  }
  return 0;
}

// sort by color then number
export const sortCards = (cards) => {
  cards.sort(compareByColor);
  cards.sort(compareByValue);
  return cards;
};

// draws a random card. we're not keeping track of what cards are actually in the deck
// A UNO deck consists of 108 cards, of which there are 76 Number cards, 24 Action cards and 8 Wild cards.
export const drawCard = () => {
  const rand = Math.random() * 27;
  if (rand < 19) {
    return chooseRandomNumberCard();
  }
  else if (rand < 25) {
    return chooseRandomActionCard();
  }
  else {
    return chooseRandomWildCard();
  }
};

const WildColorCard = {
  color: "rainbow",
  value: "wild"
};

const WildDraw4Card = {
  color: "rainbow",
  value: "draw4"
};

const chooseRandomNumberCard = () => {
  return {
    color: chooseRandomColor(),
    value: Math.floor(Math.random() * 10)
  };
};

const chooseRandomActionCard = () => {
  const rand = Math.floor(Math.random() * 3);
  let value = "";
  if (rand < 1)
    value = "Draw 2";
  else if (rand < 2)
    value = "Reverse";
  else
    value = "Skip";
  return {
    color: chooseRandomColor(),
    value: value
  };
};

const chooseRandomWildCard = () => {
  const rand = Math.floor(Math.random() * 2);
  if (rand < 1)
    return WildColorCard;
  else
    return WildDraw4Card;
};

const chooseRandomColor = () => {
  const rand = Math.random() * 4;
  if (rand < 1)
    return "red";
  else if (rand < 2)
    return "green";
  else if (rand < 3)
    return "blue";
  else return "yellow";
};
