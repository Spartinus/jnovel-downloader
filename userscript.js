// ==UserScript==
// @name         J-Novel Downloader
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Downloads the content from their awful reader; just hit 'G'
// @author       Adakenko
// @include      /^https:\/\/j-novel\.club\/c\/(.+)\/read*/
// @grant        none
// ==/UserScript==

(function() {

	'use strict';

	// GET CONTENTS OF READER AS STRING
	function getReaderContents() {
		let readerChildrenArray = Array.from(document.querySelector("#root ._1zL8fpy6UQ5YbHbsuUOngG").children);

		var result = "";
		for (let child of readerChildrenArray) {
			var cs = child.outerHTML;
			console.log(cs);
			if (!cs.includes("<img src=")) {
				cs = child.innerHTML;
				result += cs + "\r\n";
			}
			else {
				result += "[IMAGE PROVIDED] " + child.src + "\r\n";
			}
		}

		return result;
	};

	// DOWNLOAD TEXT (str) AS FILE WITH NAME (fileName)
	function downloadText(str, fileName) {
		var a = document.createElement("a");
		a.setAttribute("href", "data:text/plain;charset=utf-16," + encodeURIComponent(str));
		a.setAttribute("download", fileName)
		a.style.display = "none";

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// SETUP FUNCTION
	window.downloadReaderContents = function () {
		var readerContents = getReaderContents();
		if (readerContents) {
			const regex = /https:\/\/j-novel\.club\/c\/(.+)\/read/gm;
			downloadText(readerContents, regex.exec(window.location.href)[1] + ".txt");
		}
	};

	// EXECUTE FUNCTIONALITY
	window.onload = function() {
        document.onkeypress = function (e) {
            e = e || window.event;
            if (e.keyCode == 103) {
                window.downloadReaderContents();
            }
        };
	};

})();
