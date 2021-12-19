window.addEventListener('load', loadData);

const displayOrder = ['ENG 1', 'ENG 2', 'FRA 1', 'GER 1', 'ESP 1', 'ITA 1', 'BEL 1', 'MEX 1', 'MLS', 'CHN 1', 'NED 1',
    'TUR 1', 'SAU 1', 'POR 1', 'LIB', 'SUD', 'ARG 1', 'AUS 1', 'AUT 1', 'CRO 1', 'CYP 1', 'CZE 1', 'DEN 1', 'ENG 3', 'ENG 4',
    'ESP 2', 'FRA 2', 'GER 2', 'GER 3', 'GRE 1', 'HUN 1', 'IND 1', 'IRL 1', 'ITA 2', 'JPN 1', 'KOR 1', 'NOR 1', 'POL 1', 'ROM 1',
    'RSA 1', 'RUS 1', 'SPFL', 'SUI 1', 'SWE 1', 'UKR 1'];

const playerPositionGroups = {
    'GK': ['GK'],
    'RB': ['RB, RWB'],
    'LB': ['LB, LWB'],
    'CB': ['CB'],
    'CM': ['CDM, CM, CAM'],
    'RM': ['RM, RW'],
    'LM': ['LM, LW'],
    'ST': ['ST, CF']
}

function loadData() {
    chrome.storage.local.get(['futPlayersDB'], function (result) {
        const localDB = result.futPlayersDB || {};
        const htmlBlocks = {};
        const leagueNames = Object.keys(localDB);
        for (var idx = 0; idx < leagueNames.length; idx++) {
            var key = leagueNames[idx];
            var newHtml = `<div class="league">
            <h3>${key}</h3>
            <table>
            <th>Club</th>
            <th>Bronze</th>
            <th>Silver</th>
            <th>Gold</th>
            <th>Total</th>
            ${renderLeague(localDB[key])}
            </table></div>`;

            htmlBlocks[displayOrder.indexOf(key)] = newHtml;
        }

        const html = Object.keys(htmlBlocks).reduce(function (prev, curr) {
            return prev + htmlBlocks[curr];
        }, "");

        var myDiv = document.createElement("div");
        myDiv.id = 'tableData';
        myDiv.innerHTML = html;
        document.getElementById("content").appendChild(myDiv);
    });
}

function renderLeague(league) {
    var html = "";
    var clubNames = Object.keys(league);
    for (var idx = 0; idx < clubNames.length; idx++) {
        var key = clubNames[idx];
        html += `<tr><td>${key}</td>${renderClub(league[key])}</tr>`;
    }

    const bronzes = Object.keys(league).map(function (clubName) {
        return Object.keys(league[clubName]).filter(function (playerName) { return !league[clubName][playerName].isSpecial && league[clubName][playerName].quality == 0; }).length
    }).reduce(function (prev, curr) { return prev + curr; }, 0);

    const silver = Object.keys(league).map(function (clubName) {
        return Object.keys(league[clubName]).filter(function (playerName) { return !league[clubName][playerName].isSpecial && league[clubName][playerName].quality == 1; }).length
    }).reduce(function (prev, curr) { return prev + curr; }, 0);

    const gold = Object.keys(league).map(function (clubName) {
        return Object.keys(league[clubName]).filter(function (playerName) { return !league[clubName][playerName].isSpecial && league[clubName][playerName].quality == 2; }).length
    }).reduce(function (prev, curr) { return prev + curr; }, 0);

    const total = bronzes + silver + gold;

    html += `<tr><td>TOTAL</td><td>${bronzes}</td><td>${silver}</td><td>${gold}</td><td class="highlight-${total}")}>${total}</td>`;
    return html;
}

function renderClub(_club) {
    var club = Object.values(_club);
    const bronzes = club.filter(function (player) { return !player.isSpecial && player.quality == 0; }).length;
    const silver = club.filter(function (player) { return !player.isSpecial && player.quality == 1; }).length;
    const gold = club.filter(function (player) { return !player.isSpecial && player.quality == 2; }).length;
    const total = bronzes + silver + gold;
    return `<td>${bronzes}</td><td>${silver}</td><td>${gold}</td><td class="highlight-${total}")}>${total}</td>`;
}

document.getElementById("resetDB").addEventListener("click", resetDB);
function resetDB(){
    chrome.runtime.sendMessage({ type: 'clubPlayer.clear' });
}