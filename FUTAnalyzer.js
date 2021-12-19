'use strict';

const FUTAnalyzer = (function () {
    const analyzers = []

    function tabOnClick(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var tabId = target.dataset.tabid || target.parentElement.dataset.tabid;
        changeTab(tabId);
    }

    function changeTab(tabId) {
        var tabNavs = document.getElementById('tabNav').children;
        for (let i = 0; i < tabNavs.length; i++) {
            const tab = tabNavs[i];
            tab.classList.remove("active");
            if (tab.dataset.tabid == tabId) {
                tab.classList.add("active");
            }
        };

        var tabs = document.getElementById('tabContainer').children;
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.classList.add("hide");
            if (tab.id == tabId) {
                tab.classList.remove("hide");
            }
        };
    }

    return {
        add: function (analyzer) {
            analyzers.push(analyzer);
        },
        render: function (clearAll) {
            if (clearAll) {
                document.getElementById('tabContainer').innerHTML = '';
                document.getElementById('tabNav').innerHTML = '';
            }

            chrome.storage.local.get(['futPlayersDB'], function (result) {
                const localDB = result.futPlayersDB || {};
                const htmlBlocks = {};

                for (let idx = 0; idx < displayOrder.length; idx++) {
                    const key = displayOrder[idx];
                    const clubs = localDB[key];
                    if (clubs) {
                        analyzers.forEach(function (analyzer) {
                            const data = analyzer.render({
                                name: key,
                                clubs: clubs
                            });

                            htmlBlocks[analyzer.name] = (htmlBlocks[analyzer.name] || "") + data;
                        });
                    }
                }

                analyzers.forEach(function (analyzer) {
                    const tabId = `tab-${analyzer.name}`;
                    const myTabLI = document.createElement("li");
                    myTabLI.innerHTML = `<span>${analyzer.title}</span>`;
                    myTabLI.dataset.tabid = tabId;
                    myTabLI.onclick = tabOnClick;
                    document.getElementById('tabNav').appendChild(myTabLI);

                    const myDiv = document.createElement("div");
                    myDiv.innerHTML = htmlBlocks[analyzer.name] || "NO DATA";
                    myDiv.id = `${tabId}`;
                    document.getElementById('tabContainer').appendChild(myDiv);
                });

                changeTab(`tab-${analyzers[0].name}`);
            });
        }
    }
})();
