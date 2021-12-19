'use strict';

const displayOrder = ['ENG 1', 'ENG 2', 'FRA 1', 'GER 1', 'ESP 1', 'ITA 1', 'BEL 1', 'MEX 1', 'MLS', 'CHN 1', 'NED 1',
    'TUR 1', 'SAU 1', 'POR 1', 'LIB', 'SUD', 'ARG 1', 'AUS 1', 'AUT 1', 'CRO 1', 'CYP 1', 'CZE 1', 'DEN 1', 'ENG 3', 'ENG 4',
    'ESP 2', 'FRA 2', 'GER 2', 'GER 3', 'GRE 1', 'HUN 1', 'IND 1', 'IRL 1', 'ITA 2', 'JPN 1', 'KOR 1', 'NOR 1', 'POL 1', 'ROM 1',
    'RSA 1', 'RUS 1', 'SPFL', 'SUI 1', 'SWE 1', 'UKR 1'];

window.addEventListener('load', function () {
    FUTAnalyzer.add(FUTBasicAnalyzer);
    FUTAnalyzer.add(FUTPositionsAnalyzer);

    FUTAnalyzer.render();
});

document.getElementById("resetDB").addEventListener("click", resetDB);
function resetDB() {
    chrome.runtime.sendMessage({ type: 'clubPlayer.clear' },
        function () {
            FUTAnalyzer.render(true);
        });
}