let deck = [];
let hand = [];
let cardWidth = 120;
let cardHeight = 200;
let cardSpacing = 20;  // Spacing between cards
let startY = 600;  // Y position where cards should be displayed

window.drawCard = function() {
    if (deck.length === 0) {
        console.log("No more cards in the deck");
        return;
    }

    let newCard = deck.reduce((lowestCard, currentCard) => {
        if (currentCard.instVars.id < lowestCard.instVars.id && !hand.includes(currentCard)) {
            return currentCard;
        } else {
            return lowestCard;
        }
    }, deck[0]);

    hand.push(newCard);
    deck = deck.filter(card => card !== newCard);

    updateCardPositions();
}


function updateCardPositions() {
    // Calculate the starting position based on the number of cards in the hand.
    let startX = (hand.length - 1) * cardWidth;
	startX = startX + 365
    // Loop over each card in the hand and set its position.
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];

        // Check if the card is being dragged
        if (card && !card.instVars.isBeingDragged) {
            card.x = startX - i * cardWidth;
            card.y = 625;
        }
    }
}

window.removeCardFromHand = function(uid) {
    let cardToRemove = hand.find(card => card.UID === uid);
    console.log("Removing card:", cardToRemove);
    hand = hand.filter(card => card.UID !== uid);
    updateCardPositions();
};


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.getDeckSize = function() {
    return deck.length;
};





runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
    fetch('game.json')
        .then(response => response.json())
        .then(data => {
            let cards = data.cards;
            let ids = Array.from({length: cards.length}, (_, i) => i + 1);
            shuffleArray(ids);

            cards.forEach((cardData, index) => {
                let cardInstance = runtime.objects.Card.createInstance(0,0,0);

                cardInstance.instVars.name = cardData.name;
                cardInstance.instVars.image_url = cardData.image_url;
                cardInstance.instVars.rarity = cardData.rarity;
                cardInstance.instVars.mp_cost = cardData.mp_cost;
                cardInstance.instVars.targets = cardData.targets;
                cardInstance.instVars.id = ids[index];

                deck.push(cardInstance);
            });
        })
        .catch(error => console.error('Error:', error));
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
   
    
    updateCardPositions();
}
