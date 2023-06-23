let deck = [];
let hand = [];
let cardWidth = 120;
let cardHeight = 200;
let deckpacing = 5;  // Spacing between deck
let startY = 600;  // Y position where deck should be displayed
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
            let deck = data.deck;
            let ids = Array.from({length: deck.length}, (_, i) => i + 1);
            shuffleArray(ids);

            deck.forEach((cardData, index) => {
                let cardInstance = runtime.objects.Card.createInstance(0,0,0);

                cardInstance.instVars.name = cardData.name;
                cardInstance.instVars.image_url = cardData.image_url;
                cardInstance.instVars.rarity = cardData.rarity;
                cardInstance.instVars.mp_cost = cardData.mp_cost;
                cardInstance.instVars.targets = cardData.targets;
                cardInstance.instVars.id = ids[index];
				
				cardData.effects.forEach(effect => {
                    if (effect.order === 1) {
                        cardInstance.instVars.effect_1 = effect.id;
                    } else if (effect.order === 2) {
                        cardInstance.instVars.effect_2 = effect.id;
                    }
                });

                deck.push(cardInstance);
            });

            console.log("Deck created.");
        })
        .catch(error => console.error('Error:', error));
		
	fetch('game.json')
    .then(response => response.json())
    .then(data => {
        // Get the Player and Monster image URLs
        let playerImageURL = data.classes[0].class1;
        let monsterImageURL = data.monsters[0].monster1;
		let backgroundImageURL = data.backgrounds[0].background1;

        // Assuming playerInstance and monsterInstance are already created
        // and accessible in this scope
		let playerInstance = runtime.objects.player.getFirstInstance();
		let monsterInstance = runtime.objects.monster.getFirstInstance();
		let backgroundInstance = runtime.objects.background.getFirstInstance();
        playerInstance.instVars.image_url = playerImageURL;
        monsterInstance.instVars.image_url = monsterImageURL;
		backgroundInstance.instVars.image_url = backgroundImageURL;
    })
    .catch(error => console.error('Error:', error));

    runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime) {
  //  console.log("Running game tick...");

  
}