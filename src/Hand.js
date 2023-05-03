import React from "react";


export default function Hand(props) {
    const cardBack = 'https://deckofcardsapi.com/static/img/back.png';
    const tempCard = <img src={cardBack} alt='Unknown Card' key='??' className="card"></img>;

    var Cards = [];
    for (var i = 0; i < props.cards.length; i++) {
        let card = props.cards[i];
        Cards.push(<img src={card?.image || cardBack} alt={card?.val || '??'} key={i} className="card"></img>)
    }

    if (props.hidden && Cards.length > 0) {
        Cards[0] = tempCard;
    }

    return(
        <div className='container'>
            {Cards}
        </div>
    );
}
