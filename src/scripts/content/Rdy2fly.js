// ==UserScript==
// @name         Rdy2fly
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add red color to rdy fleet
// @author       zero
// @match        https://original.xwars.net/index.php*
// @icon         none
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var allColumns = document.querySelectorAll('td');

    allColumns.forEach(function(column) {
        if (column.textContent.includes("verändern")) {
            column.style.color = 'red';
        }
    });
})();