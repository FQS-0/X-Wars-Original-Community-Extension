// ==UserScript==
// @name         Koordinaten Dropdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add dropdown Koordinaten im Flottenmenü
// @author       zero
// @match        https://original.xwars.net/index.php*
// @icon         none
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Eingebettete Koordinatenliste
    const koordinatenListe = [
         { "coord": "1x", "name": "G1" },
    { "coord": "1x18x1", "name": "1x18x1 - simme" },
    { "coord": "1x21x4", "name": "1x21x4 - simme" },
    { "coord": "1x21x7", "name": "1x21x7 - Scari" },
    { "coord": "1x27x2", "name": "1x27x2 - Erthos" },
    { "coord": "1x27x5", "name": "1x27x5 - Corak " },
    { "coord": "1x27x6", "name": "1x27x6 - Wohl$tandsKind" },
    { "coord": "1x28x3", "name": "1x28x3 - Kuysen" },
    { "coord": "1x28x4", "name": "1x28x4 - TGun" },
    { "coord": "1x29x2", "name": "1x29x2 - Ray" },
    { "coord": "1x29x4", "name": "1x29x4 - ratz159" },
    { "coord": "1x29x5", "name": "1x29x5 - Erthos" },
    { "coord": "1x30x3", "name": "1x30x3 - Wohl$tandsKind" },
    { "coord": "1x30x6", "name": "1x30x6 - ray" },
    { "coord": "1x31x1", "name": "1x31x1 - Jonas" },
    { "coord": "1x31x3", "name": "1x31x3 - BadBlackMan" },
    { "coord": "1x31x4", "name": "1x31x4 - Jonas" },
    { "coord": "1x31x5", "name": "1x31x5 - Ook" },
    { "coord": "1x32x4", "name": "1x32x4 - Vrael" },
    { "coord": "1x35x2", "name": "1x35x2 - Wohl$tandsKind" },
    { "coord": "1x35x3", "name": "1x35x3 - simme" },
    { "coord": "1x35x4", "name": "1x35x4 - Scari" },
    { "coord": "1x36x3", "name": "1x36x3 - Pakmann" },
    { "coord": "1x36x4", "name": "1x36x4 - Ook" },
    { "coord": "1x37x4", "name": "1x37x4 - Panzke" },
    { "coord": "1x83x5", "name": "1x83x5 - zero" },
    { "coord": "1x84x1", "name": "1x84x1 - ratz159" },
    { "coord": "1x84x3", "name": "1x84x3 - Pille" },
    { "coord": "1x84x4", "name": "1x84x4 - Wohl$tandsKind" },
        { "coord": "2x", "name": "G2" },
    { "coord": "2x55x4", "name": "2x55x4 - ray" },
        { "coord": "17x", "name": "G17" },
    { "coord": "17x1x6", "name": "17x1x6 - Okki" },
    { "coord": "17x5x4", "name": "17x5x4 - TGun" },
    { "coord": "17x5x5", "name": "17x5x5 - Kuysen" },
    { "coord": "17x6x2", "name": "17x6x2 - Wohl$tandsKind" },
    { "coord": "17x6x3", "name": "17x6x3 - Ray" },
    { "coord": "17x6x5", "name": "17x6x5 - Ray" },
    { "coord": "17x9x1", "name": "17x9x1 - Okki" },
    { "coord": "17x10x4", "name": "17x10x4 - Ook" },
    { "coord": "17x10x5", "name": "17x10x5 - Ook" },
    { "coord": "17x12x1", "name": "17x12x1 - Wohl$tandsKind" },
    { "coord": "17x12x4", "name": "17x12x4 - Okki" },
    { "coord": "17x13x4", "name": "17x13x4 - zero" },
    { "coord": "17x13x5", "name": "17x13x5 - zero" },
    { "coord": "17x14x3", "name": "17x14x3 - zero" },
    { "coord": "17x14x4", "name": "17x14x4 - zero" },
    { "coord": "17x14x5", "name": "17x14x5 - Wohl$tandsKind" },
    { "coord": "17x16x2", "name": "17x16x2 - zero" },
    { "coord": "17x16x3", "name": "17x16x3 - TGun" },
    { "coord": "17x17x4", "name": "17x17x4 - Kuysen" },
    { "coord": "17x19x3", "name": "17x19x3 - Ook" },
    { "coord": "17x24x4", "name": "17x24x4 - Ook" },
    { "coord": "17x24x5", "name": "17x24x5 - zero" },
    { "coord": "17x24x6", "name": "17x24x6 - ray" },
    { "coord": "17x28x1", "name": "17x28x1 - DarkBASIC" },
    { "coord": "17x34x2", "name": "17x34x2 - ratz159" },
    { "coord": "17x35x1", "name": "17x35x1 - ratz159" },
    { "coord": "17x35x2", "name": "17x35x2 - ratz159" },
    { "coord": "17x36x4", "name": "17x36x4 - simme" },
    { "coord": "17x40x2", "name": "17x40x2 - simme" },
    { "coord": "17x43x1", "name": "17x43x1 - Blusdia" },
    { "coord": "17x43x2", "name": "17x43x2 - Blusdia" },
    { "coord": "17x43x3", "name": "17x43x3 - Blusdia" },
    { "coord": "17x46x3", "name": "17x46x3 - Panzke" },
    { "coord": "17x49x2", "name": "17x49x2 - Pille" },
    { "coord": "17x50x1", "name": "17x50x1 - Pille" },
    { "coord": "17x51x1", "name": "17x51x1 - BadBlackMan" },
    { "coord": "17x51x4", "name": "17x51x4 - Pille" },
    { "coord": "17x51x5", "name": "17x51x5 - Erthos" },
    { "coord": "17x52x5", "name": "17x52x5 - Olli" },
    { "coord": "17x52x6", "name": "17x52x6 - Erthos " },
    { "coord": "17x52x7", "name": "17x52x7 - BadBlackMan" },
    { "coord": "17x53x5", "name": "17x53x5 - Erthos " },
    { "coord": "17x57x1", "name": "17x57x1 - Olli" },
    { "coord": "17x57x3", "name": "17x57x3 - Olli" },
    { "coord": "17x59x1", "name": "17x59x1 - Olli" },
    { "coord": "17x59x4", "name": "17x59x4 - Olli" },
    { "coord": "17x61x3", "name": "17x61x3 - Erthos " },
    { "coord": "17x62x2", "name": "17x62x2 - ratz159" },
    { "coord": "17x64x3", "name": "17x64x3 - Olli" },
    { "coord": "17x64x4", "name": "17x64x4 - Bear" },
    { "coord": "17x64x5", "name": "17x64x5 - Pille" },
    { "coord": "17x65x1", "name": "17x65x1 - Kuysen" },
    { "coord": "17x66x1", "name": "17x66x1 - Pille" },
    { "coord": "17x68x4", "name": "17x68x4 - Panzke" },
    { "coord": "17x68x5", "name": "17x68x5 - Panzke" },
    { "coord": "17x69x3", "name": "17x69x3 - Panzke" },
    { "coord": "17x69x4", "name": "17x69x4 - Corak" },
    { "coord": "17x69x5", "name": "17x69x5 - simme" },
    { "coord": "17x73x1", "name": "17x73x1 - Kuysen" },
    { "coord": "17x73x4", "name": "17x73x4 - Panzke" },
    { "coord": "17x74x3", "name": "17x74x3 - Scari" },
    { "coord": "17x75x3", "name": "17x75x3 - Bear" },
    { "coord": "17x75x4", "name": "17x75x4 - Panzke" },
    { "coord": "17x76x4", "name": "17x76x4 - Okki" },
    { "coord": "17x77x1", "name": "17x77x1 - Okki" },
    { "coord": "17x77x6", "name": "17x77x6 - Pakmann" },
    { "coord": "17x79x3", "name": "17x79x3 - Scari" },
    { "coord": "17x80x3", "name": "17x80x3 - Pakmann" },
    { "coord": "17x81x7", "name": "17x81x7 - Pakmann" },
    { "coord": "17x85x3", "name": "17x85x3 - Vanitas" },
    { "coord": "17x86x2", "name": "17x86x2 - Vanitas" },
    { "coord": "17x86x3", "name": "17x86x3 - Vanitas" },
    { "coord": "17x86x5", "name": "17x86x5 - Vanitas" },
    { "coord": "17x87x3", "name": "17x87x3 - Vanitas" },
    { "coord": "17x88x6", "name": "17x88x6 - Corak " },
    { "coord": "17x90x2", "name": "17x90x2 - Bear" },
    { "coord": "17x93x6", "name": "17x93x6 - Corak" },
    { "coord": "17x94x1", "name": "17x94x1 - scari" },
    { "coord": "17x94x4", "name": "17x94x4 - Bear" },
    { "coord": "17x95x2", "name": "17x95x2 - ratz159" },
    { "coord": "17x95x3", "name": "17x95x3 - Corak" },
    { "coord": "17x95x4", "name": "17x95x4 - Corak" },
    { "coord": "17x96x1", "name": "17x96x1 - scari" },
    { "coord": "17x97x2", "name": "17x97x2 - jonas" },
    { "coord": "17x98x5", "name": "17x98x5 - Tgun" },
    { "coord": "17x98x6", "name": "17x98x6 - Bear" },
    ];

    // Füge Dropdown-HTML-Code direkt in das gewünschte Element ein
    const dropdownHTML = `
        <tr>
            <td colspan="3">
                <select id="koordinatenDropdown">
                    ${koordinatenListe.map(entry => `<option value="${entry.coord}">${entry.name}</option>`).join('')}
                </select>
            </td>
        </tr>
    `;

    const targetElement = document.evaluate('/html/body/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table[1]/tbody/tr[2]/td[1]/br[5]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Füge Dropdown-HTML direkt unter das gewünschte Element ein
    targetElement.insertAdjacentHTML('afterend', dropdownHTML);

    // Hole das Dropdown-Element
    const dropdown = document.getElementById('koordinatenDropdown');

    // Hole das Ziel-Eingabefeld
    const targetInput = document.querySelector('body > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > form:nth-child(12) > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > input:nth-child(2)');

    // Füge einen Event-Listener hinzu, um das ausgewählte Element in das Eingabefeld zu setzen
    dropdown.addEventListener('change', function() {
        // Setze die ausgewählte Koordinate im Eingabefeld
        targetInput.value = this.value;
    });
})();
