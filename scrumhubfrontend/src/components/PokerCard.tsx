import "./PokerCard.css";
export const PokerCard = (props:any)=>{
          const cardValue = props.value;
          const cardClasses = ['pokerCard'];
          
          return  (<div className={cardClasses.join(' ')}>
            <div className="left-icon">{"Story Points"}</div>   
    <div className="center-icon">{cardValue}</div>   
    <div className="right-icon">{cardValue}</div>  
            </div>);
 };

 export const StoryPointPokerCard = (props:any)=>{
  const cardValue = props.value;
  const cardClasses = ['pokerCard col-lg-4'];
  
  return  (<div className={cardClasses.join(' ')}>
    <div className="left-icon">{cardValue}</div>
    <div className="center-icon">{cardValue}</div>  
    <div className="below-center-icon">{"Story Points"}</div>   
    <div className="right-icon">{cardValue}</div>    
    </div>);
};

/*var Deck = React.createClass({  
    render() {  
    var cardsValue = [ "0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89","∞" ];
    var cards = [];
   
    for (var i = 0; i < cardsValue.length; i++) {
        cards.push(<Card value={cardsValue[i]} isSeletedCard={false} key={i}></Card>);
    }
    return (
      <div className="col-lg-12">
        {cards}
       </div>
    );
  }
 });

ReactDOM.render(
<Deck value="4"></Deck> ,
document.getElementById('containerDeck')
);*/