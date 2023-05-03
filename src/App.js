import './App.css';
import React, { useEffect, useState } from "react";
import Card from './Card';


// Card-related helper funcitons
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'K', 'Q', 'A'];
const url = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1';
const cardBack = 'https://deckofcardsapi.com/static/img/back.png';
const tempCard = {
  val: 'X',
  image: cardBack
};

const getCardFromAPI = async () => {
  const res = await fetch(url);
  const data = await res.json();
  let card = {
    val: data.cards[0].code[0],
    image: data.cards[0].image
  };
  return card;
}



function handValue(hand) {
  var sum = 0;
  var aces = 0;
  for (let index in hand) {
    let card = hand[index].val
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
    output.push(<Card image={hand[index].image} key={index}></Card>); 
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
    setDealer([tempCard, tempCard]);
    setPlayer([tempCard, tempCard]);
    setPlayable(true);
    setHidden(true);
    setStanding(false);
  }

  const hitPlayer = () => {
    let hitted = [...playerHand];
    hitted.push(tempCard);
    setPlayer(hitted);
  }

  const hitDealer = () => {
    let hitted = [...dealerHand];
    hitted.push(tempCard);
    setDealer(hitted);
  }

  const stand = () => {
    setPlayable(false);
    setHidden(false);
    setStanding(true);
  }
  // end intents


  const loadCards = async () => {
    var newPlayer = [...playerHand];
    for (let index in newPlayer) {
      let card = newPlayer[index];
      if (card.val === 'X') {
        const res = await fetch(url);
        const data = await res.json();
        newPlayer[index] = {
          val: data.cards[0].code[0],
          image: data.cards[0].image
        };
      }
    }
    var newDealer = [...dealerHand];
    for (let index in newDealer) {
      let card = newDealer[index];
      if (card.val === 'X') {
        const res = await fetch(url);
        const data = await res.json();
        newDealer[index] = {
          val: data.cards[0].code[0],
          image: data.cards[0].image
        };
      }
    }
    console.log(newPlayer);
    setPlayer(newPlayer);
    setDealer(newDealer);
  }
  
  // Effect: load unknown cards
  useEffect(() => {
    loadCards();
  }, []);
  

  // Effect: check for player loss
  useEffect(() => {
    let val = handValue(playerHand);
    if (val > 21) {
      setPlayable(false);
      setHidden(false);
      setTimeout(() => { alert('Sorry, you lose! :('); }, 1000);
    }
  }, [playerHand]);

  // Effect: check for endgame by standing
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
  }, [standing, dealerHand]);

  
  var dealerCards = handMap(dealerHand);
  let playerCards = handMap(playerHand);
  if (dealerCards.length > 1) {
    dealerCards[0] = <Card key={0} image={cardBack} hidden={dealerHidden} alt="Unknown Card"></Card>;
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
