'use strict';

const FUTBasicAnalyzer = (function () {
    function analyze(league) {
        const analysis = {
            name: league.name,
            summary: {
                bronze: 0,
                silver: 0,
                gold: 0,
                special: 0,
                total: 0
            },
            data: []
        };

        const clubNames = Object.keys(league.clubs);
        for (let idx = 0; idx < clubNames.length; idx++) {
            const key = clubNames[idx];
            const club = analyzeClub(league.clubs[key]);
            club.name = key;
            analysis.data.push(club);

            analysis.summary.bronze += club.bronze;
            analysis.summary.silver += club.silver;
            analysis.summary.gold += club.gold;
            analysis.summary.special += club.special;
            analysis.summary.total += club.total;
        }

        return analysis;
    }

    function analyzeClub(club) {
        const players = Object.values(club);
        const bronze = players.filter(function (player) { return !player.isSpecial && player.quality == 0; }).length;
        const silver = players.filter(function (player) { return !player.isSpecial && player.quality == 1; }).length;
        const gold = players.filter(function (player) { return !player.isSpecial && player.quality == 2; }).length;
        const special = players.filter(function (player) { return player.isSpecial }).length;
        const total = bronze + silver + gold + special;

        return {
            bronze: bronze,
            silver: silver,
            gold: gold,
            special: special,
            total: total
        }
    }

    return {
        name: 'basicAnalyzer',
        title: '# Players',
        analyze: function (league) {
            return analyze(league);
        },
        render: function (league) {
            const analysis = this.analyze(league);
            let rows = "";

            analysis.data.forEach(function (club) {
                rows += `<tr>
                    <td>${club.name}</td>
                    <td>${club.bronze}</td>
                    <td>${club.silver}</td>
                    <td>${club.gold}</td>
                    <td>${club.special}</td>
                    <td class="highlight-${club.total}")}>${club.total}</td>
                </tr>`;
            });

            const table = `<div class="league">
            <h3>${analysis.name}</h3>
            <table>
            <th>Club</th>
            <th>Bronze</th>
            <th>Silver</th>
            <th>Gold</th>
            <th>Special</th>
            <th>Total</th>
            ${rows}
            <tr>
                <td>TOTAL</td>
                <td>${analysis.summary.bronze}</td>
                <td>${analysis.summary.silver}</td>
                <td>${analysis.summary.gold}</td>
                <td>${analysis.summary.special}</td>
                <td class="highlight-${analysis.summary.total}")}>${analysis.summary.total}</td>
            </tr>
            </table></div>`;

            return table;
        }
    };
})();