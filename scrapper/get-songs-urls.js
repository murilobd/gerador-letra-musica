import jsdom from "jsdom";
import fs from "fs";
const { JSDOM } = jsdom;

const MAIN_URL = "https://www.letras.mus.br/anitta/discografia/";

async function getURLs() {
	try {
		const { window } = await JSDOM.fromURL(MAIN_URL);
		const selectors = window.document.querySelectorAll("a.bt-play-song");

		const urls = new Set();
		for (const selector of selectors) {
			const href = selector.href.split("#");
			urls.add(href.slice(0, href.length - 1).join(""));
		}
		return [...urls];
	} catch (error) {
		console.error("Failed scraping", error.message);
		throw error;
	}
}

async function init() {
	const links = await getURLs();
	fs.writeFile(
		`discography_urls.json`,
		JSON.stringify([...links], null, 2),
		(err) => {
			if (err) {
				console.error(`Failed saving links`, err);
				throw err;
			}
		}
	);
}

init();
