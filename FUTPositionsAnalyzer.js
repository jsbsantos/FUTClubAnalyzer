'use strict';

const FUTPositionsAnalyzer = (function () {
    const playerPositionGroups = {
        'GK': ['GK'],
        'RB': ['RB', 'RWB'],
        'LB': ['LB', 'LWB'],
        'CB': ['CB'],
        'CM': ['CDM', 'CM', 'CAM'],
        'RM': ['RM', 'RW', 'RF'],
        'LM': ['LM', 'LW', 'LF'],
        'ST': ['ST', 'CF']
    }

    function analyze(league) {
        const analysis = {
            name: league.name,
            summary: {
            },
            data: []
        };
        const clubNames = Object.keys(league.clubs);
        for (let idx = 0; idx < clubNames.length; idx++) {
            const key = clubNames[idx];
            const club = analyzeClub(league.clubs[key]);
            club.name = key;
            analysis.data.push(club);

            Object.keys(playerPositionGroups).forEach(function (position) {
                analysis.summary[position] = (analysis.summary[position] || 0) + (club[position] || 0);
            });
        }

        return analysis;
    }

    function analyzeClub(club) {
        const players = Object.values(club);
        const playerPositionGroupsKeys = Object.keys(playerPositionGroups);

        const data = {};

        playerPositionGroupsKeys.forEach(function (positionKey) {
            const positions = playerPositionGroups[positionKey] || [];
            data[positionKey] = players.filter(function (player) { return positions.indexOf(player.position) > -1; }).length
        });

        return data;
    }

    return {
        name: 'positionAnalyzer',
        title: 'Players by position',
        analyze: function (league) {
            return analyze(league);
        },
        render: function (league) {
            const analysis = analyze(league);
            const positions = Object.keys(playerPositionGroups);

            let rows = "";
            let summary = "<td>TOTAL</td>";
            let header = "<th>Club</th>";

            positions.forEach(function (position) {
                header += `<th>${position}</th>`;
                summary += `<td>${analysis.summary[position] || 0}</td>`;
            });

            analysis.data.forEach(function (club) {
                let columns = "";
                positions.forEach(function (position) {
                    columns += `<td>${club[position] || 0}</td>`
                });

                rows += `<tr>
                    <td>${club.name}</td>
                    ${columns}
                </tr>`;
            });

            const table = `<div class="league">
            <h3>${analysis.name}</h3>
            <table>
            ${header}
            ${rows}
            <tr>${summary}</tr>
            </table>
            </div>`;

            return table;
        }
    };
})();