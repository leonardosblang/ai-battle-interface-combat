let deck = [];
let hand = [];
let cardWidth = 120;
let cardHeight = 200;
let cardSpacing = 5;  // Spacing between cards
let startY = 600;  // Y position where cards should be displayed
let startX = 875;



function shuffleArray(array) {
    console.log("Shuffling array...");
    for (let i =  array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    console.log("Array shuffled.");
}



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

  
}