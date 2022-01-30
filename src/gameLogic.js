// toConsider is the card whose eligibility is being considered
// lastCard is the last card that was put down
const isValidFirstCard = (toConsider, lastCard) => {
  if (toConsider.v == lastCard.v || toConsider.c == lastCard.c) {
    return true;
  }
  const specialCards = ["2+", "4+", "wildcard", "🚫", "↩️"];
  for (let i=0; i<specialCards; i++)
  if (toConsider.v === specialCards[i]) {
    return true;
  }
  return false;
}

// direction denotes the direction that the additional cards are going in
//   - direction = "increasing" if the user is increasing
//   - direction = "decreasing" if the user is decreasing
//   - direction = "none" if neither
const isValidAdditionalCard = (toConsider, lastCard, direction) => {
  if (toConsider.v == lastCard.v) {
    return [true, direction];
  }
  if (isLessThan(toConsider.v, lastCard.v)) {
    if (direction === "increasing") {
      return [false, direction];
    }
    else {
      return [true, "increasing"];
    }
  }
}

const isLessThan = (cardA, cardB) => {
  return true; //TODO
}

const isGreaterThan(cardA, cardB) {
  return true; //TODO
}
