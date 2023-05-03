import './App.css';
import React, { useEffect, useState } from "react";
import Card from './Card';


// Card-related helper funcitons
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'K', 'Q', 'A'];

const pickCard = () => {
  return cards[Math.floor(Math.random() * 13)];
}

function handValue(hand) {
  var sum = 0;
  var aces = 0;
  for (let index in hand) {
    let card = hand[index]
    if (card === 'A') {
      aces++;
    } else {
      var value = 2 + cards.indexOf(card);
      if (value > 10) value = 10;
      sum += value;
    }
  }
  while (aces > 0) {
    if (sum + aces + 10 <= 21) {
      sum += 11;
    } else {
      sum += 1;
    }
    aces--;
  }
  return sum;
}

function handMap(hand) {
  var output = [];
  for (let index in hand) {
    output.push(<Card value={hand[index]} key={index}></Card>);
  }
  return output;
}
// end helper function

function App() {
  const [dealerHand, setDealer] = useState([]);
  const [playerHand, setPlayer] = useState([]);
  const [dealerHidden, setHidden] = useState(true);
  const [playable, setPlayable] = useState(false);
  const [standing, setStanding] = useState(false);

  // Player intents
  const newGame = () => {
    setDealer([pickCard(), pickCard()]);
    setPlayer([pickCard(), pickCard()]);
    setPlayable(true);
    setHidden(true);
    setStanding(false);
  }

  const hitPlayer = () => {
    let hitted = [...playerHand];
    hitted.push(pickCard());
    setPlayer(hitted);
  }

  const hitDealer = () => {
    let hitted = [...dealerHand];
    hitted.push(pickCard());
    setDealer(hitted);
  }

  const stand = () => {
    setPlayable(false);
    setHidden(false);
    setStanding(true);
  }
  // end intents

  useEffect(() => {
    let val = handValue(playerHand);
    if (val > 21) {
      setPlayable(false);
      setHidden(false);
      setTimeout(() => { alert('Sorry, you lose! :('); }, 1000);
    }
  }, [playerHand]);

  useEffect(() => {
    if (!standing) {
      return;
    }
    if (handValue(dealerHand) < 17) {
      setTimeout(() => hitDealer(), 1000);
      return;
    }
    let player = handValue(playerHand);
    let dealer = handValue(dealerHand);
    if (dealer > 21 || dealer < player) {
      setTimeout(() => { alert('Congrats, you win! :)'); }, 1000);
    } else if (dealer === player) {
      setTimeout(() => { alert('You tied :/'); }, 1000);
    } else {
      setTimeout(() => { alert('Sorry, you lose!'); }, 1000);
    }
  }, [standing, dealerHand])

  var dealerCards = handMap(dealerHand);
  let playerCards = handMap(playerHand);
  if (dealerCards.length > 1) {
    dealerCards[0] = <Card key={0} value={dealerHand[0]} hidden={dealerHidden}></Card>;
  }
  var actions = <div>
    <button onClick={hitPlayer}> Hit </button>
    <button onClick={stand}> Stand </button>
  </div>;
  if (!playable) {
    actions = '';
  }

  return (
    <div className="App">
      <h1>BlackJack</h1>
      <div className='board'>
        <div className='container'>
          {dealerCards}
        </div>
        <div className='container'>
          {playerCards}
        </div>
        <div className='container'>
          <button onClick={newGame}> New Game </button>
          {actions}
        </div>
      </div>
    </div>
  );
}


export default App;
