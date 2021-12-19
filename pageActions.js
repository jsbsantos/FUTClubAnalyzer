'use strict';

if (window.PageActions) {
    delete window.PageActions;
}
var maxRetries = 5;

window.PageActions = {
    'My Club Players': function (retries) {
        const players = document.getElementsByClassName("small player item ut-item-loaded");
        if (players.length < 20 && retries < maxRetries) {
            setTimeout(PageActions['My Club Players'].bind(null, retries +1), 250);
        }
        else if (players.length > 0) {
            var playerData = [];
            for (var idx = 0; idx < players.length; idx++) {
                const playerElement = players[idx];
                const playerCardElements = playerElement.getElementsByClassName("ut-item-view--bio ut-item-view");

                if (playerCardElements.length > 0) {
                    const playerCardDetailsElement = playerCardElements[0];
                    const playerCardDetailsElementData = playerCardDetailsElement.getElementsByClassName("ut-item-row-label--right ut-item-row-label");
                    const isRare = playerElement.classList.contains("rare");
                    const isSpecial = playerElement.classList.contains("specials");

                    const playerCardRatingElement = playerElement.getElementsByClassName("strength-header")[0];
                    const playerRating = playerCardRatingElement.getElementsByClassName("playRating")[0].textContent;
                    const playerPosition = playerCardRatingElement.getElementsByClassName("preferredPosition")[0].textContent;

                    const name = playerElement.parentElement.getElementsByClassName("name")[0].textContent;

                    const messageData = {
                        name: name,
                        rating: playerRating,
                        playerPosition: playerPosition,
                        isRare: isRare,
                        quality: playerRating < 65 ? 0 : (playerRating < 75 ? 1 : 2),
                        isSpecial: isSpecial,
                        nationality: playerCardDetailsElementData[0].textContent,
                        league: playerCardDetailsElementData[1].textContent,
                        club: playerCardDetailsElementData[2].textContent,
                    };

                    playerData.push(messageData);
                }
            }
            chrome.runtime.sendMessage({ type: 'clubPlayer.add', data: playerData });
        }
    }
};
