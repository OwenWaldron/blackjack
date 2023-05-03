import './App.css';
import React, { useEffect, useState } from "react";
import Hand from './Hand';
import Swal from "sweetalert2";


function handValue(hand) {
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'K', 'Q', 'A'];
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
// end helper function

function App() {
  const [dealerHand, setDealer] = useState([]);
  const [playerHand, setPlayer] = useState([]);
  const [dealerHidden, setHidden] = useState(true);
  const [playable, setPlayable] = useState(false);
  const [standing, setStanding] = useState(false);
  const [deckID, setDeckID] = useState('new');

  // Player intents
  const getCardsFromAPI = async (count) => {
    let res = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`);
    let data = await res.json();
    setDeckID(data.deck_id);
    return data.cards.map((card) => {
      return {
        val: card.code[0],
        image: card.image
      };
    });
  }

  const newGame = async () => {
    getCardsFromAPI(4).then((newCards) => {
      setPlayer([newCards[0], newCards[1]]);
      setDealer([newCards[2], newCards[3]]);
      setPlayable(true);
      setHidden(true);
      setStanding(false);
    })
  }

  const hitPlayer = () => {
    getCardsFromAPI(1).then((cards) => {
      let hitted = [...playerHand];
      hitted.push(cards[0]);
      setPlayer(hitted);
    })
  }

  const hitDealer = () => {
    getCardsFromAPI(1).then((cards) => {
      let hitted = [...dealerHand];
      hitted.push(cards[0]);
      setDealer(hitted);
    })
  }

  const stand = () => {
    setPlayable(false);
    setHidden(false);
    setStanding(true);
  }
  // end intents


  const Alert = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Okay'
    })
  };

  

  // Effect: check for player loss
  useEffect(() => {
    let val = handValue(playerHand);
    if (val > 21) {
      setPlayable(false);
      setHidden(false);
      setTimeout(() => { Alert('Too Many!', 'Sorry, you lose! :(', 'error'); }, 1000);
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
      setTimeout(() => { Alert('Nice!', 'Congrats, you win! :)', 'success'); }, 1000);
    } else if (dealer === player) {
      setTimeout(() => { Alert('Could be worse', 'You tied :/', 'question'); }, 1000);
    } else {
      setTimeout(() => { Alert('Not Enough...', 'Sorry, you lose! :(', 'error'); }, 1000);
    }
  }, [standing, dealerHand]);


  var actions = <div>
    <button onClick={hitPlayer}> Hit </button>
    <button onClick={stand}> Stand </button>
  </div>;
  if (!playable) {
    actions = '';
  }
  var dealerTitle = <h3>Dealer's Hand</h3>;
  var playerTitle = <h3>Your Hand</h3>;
  if (dealerHand.length === 0) {
    dealerTitle = null;
    playerTitle = null;
  }
  

  return (
    <div className="App">
      <h1> BLACKJACK </h1>
      <div className='board'>
        {dealerTitle}
        <Hand cards={dealerHand} hidden={dealerHidden}></Hand>
        {playerTitle}
        <Hand cards={playerHand}></Hand>
        <div className='container'>
          <button onClick={newGame}> New Game </button>
          {actions}
        </div>
      </div>
    </div>
  );
}


export default App;
