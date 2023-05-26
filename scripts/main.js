let deck = [];
let hand = [];
let cardWidth = 120;
let cardHeight = 200;
let cardSpacing = 5;  // Spacing between cards
let startY = 600;  // Y position where cards should be displayed
let startX = 875;

window.drawCard = function() {
    console.log("Drawing a card...");
    if (deck.length === 0) {
        console.log("No more cards in the deck");
        return;
    }

    if (hand.length >= 5) {
        console.log("Hand is full");
        return;
    }

    let newCard = deck.reduce((lowestCard, currentCard) => {
        if (currentCard.instVars.id < lowestCard.instVars.id && !hand.includes(currentCard)) {
            return currentCard;
        } else {
            return lowestCard;
        }
    }, deck[0]);

    // Find the first available empty slot
    let emptySlots = Array.from({length: 5}, (_, i) => i).filter(i => !hand.some(card => card.instVars.slot === i));
    
    // If there are no empty slots available, set the slot of the new card as the next slot
    if (emptySlots.length === 0) {
        newCard.instVars.slot = hand.length;
    } else {
        newCard.instVars.slot = emptySlots[0];
    }

    console.log(`Drawn card ${newCard.instVars.name} assigned to slot ${newCard.instVars.slot}`);
    
    hand.push(newCard);
    deck = deck.filter(card => card !== newCard);

    updateCardPositions();
};

window.removeCardFromHand = function(uid) {
    let cardToRemove = hand.find(card => card.UID === uid);
    if (!cardToRemove) {
        console.log(`Card with UID ${uid} not found in hand.`);
        return;
    }

    console.log("Removing card:", cardToRemove);
    cardToRemove.isDestroyed = true;
    cardToRemove.isRemoved = true;
    // Reset the slot value of the removed card
    cardToRemove.instVars.slot = undefined;
    
       hand = hand.filter(card => card.UID !== uid);
    reorderCards(); // call it here

    // Destroy the card here instead of in the event sheet
    cardToRemove.destroy();

    updateCardPositions();  // Update card positions after removing a card
};

function reorderCards() {
    console.log("Reordering cards...");
    // Sort the cards based on their slot value
    hand.sort((cardA, cardB) => cardA.instVars.slot - cardB.instVars.slot);

    // Reassign slot values based on their new position
    for (let i = 0; i < hand.length; i++) {
        hand[i].instVars.slot = i;
    }

    console.log("Cards reordered, new order:", hand.map(card => `${card.instVars.name}:${card.instVars.slot}`).join(", "));
    
    updateCardPositions();
}

function updateCardPositions() {
 //  console.log("Updating card positions...");
   hand.sort((a, b) => a.instVars.slot - b.instVars.slot);

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];

        if (!card) continue;

        if (!card.instVars.isBeingDragged) {
            card.x = startX - i * (cardWidth + cardSpacing);
            card.y = startY;
        }
    }

//    console.log("Card positions updated.");
}


function shuffleArray(array) {
    console.log("Shuffling array...");
    for (let i =  array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    console.log("Array shuffled.");
}

window.getDeckSize = function() {
    return deck.length;
};

window.cleanupHand = function() {
    console.log("Cleaning up hand...");
    hand = hand.filter(card => !card.isDestroyed);
    console.log("Hand cleaned up.");
};

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {
    console.log("Project starting...");

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

            console.log("Deck created.");
        })
        .catch(error => console.error('Error:', error));

    runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime) {
  //  console.log("Running game tick...");

    hand = hand.filter(card => !card.isRemoved);
    updateCardPositions();
}