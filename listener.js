'use strict';
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case 'clubPlayer.clear':
                chrome.storage.local.set({ futPlayersDB: {} });
                chrome.action.setBadgeText({ text: "<no data>" });
                break;
            case 'clubPlayer.add':
                chrome.storage.local.get(['futPlayersDB'], function (result) {
                    const localDB = result.futPlayersDB || {};
                    
                    for (let idx = 0; idx < request.data.length; idx++) {
                        const player = request.data[idx];
                        localDB[player.league] = localDB[player.league] || {};
                        localDB[player.league][player.club] = localDB[player.league][player.club] || {};

                        const key = `${player.name}_${player.rating}_${player.position}`;
                        localDB[player.league][player.club][key] = player;
                    }

                    const count = Object.keys(localDB).map(function (league) {
                        return Object.keys(localDB[league]).map(function (club) {
                            return Object.keys(localDB[league][club]).length;
                        }).reduce(function (prev, current) { return prev + current; }, 0);
                    }).reduce(function (prev, current) { return prev + current; }, 0);

                    chrome.action.setBadgeText({ text: `${count}` });
                    chrome.storage.local.set({ futPlayersDB: localDB });
                });
                break;
        }
    }
);
