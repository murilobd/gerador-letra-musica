import jsdom from "jsdom";
import fs from "fs";
import { inherits, promisify } from "util";
const { JSDOM } = jsdom;
import urls from "./discography-urls.json";

const SONGS_FOLDER = "../disc-songs";

const scrapAndSaveRecipeUrl = async (url, filename) => {
	const { window } = await JSDOM.fromURL(url);
	const { document } = window;

	// create song folder inside songs
	const folder = `${SONGS_FOLDER}/${filename}`;
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}

	// lyric
	const lyric = document.querySelector(".cnt-letra.p402_premium").innerHTML;
	const formattedLyric = lyric
		.replace(/<p>/gi, "")
		.replace(/(<\/p>|<br>)/gi, "\n")
		.trim();

	fs.writeFile(
		`${folder}/formatted-${filename}.txt`,
		formattedLyric,
		(err) => {
			if (err) {
				console.error(`Failed saving formatted song ${filename}`, err);
				throw err;
			}
		}
	);

	fs.writeFile(`${folder}/${filename}.txt`, lyric, (err) => {
		if (err) {
			console.error(`Failed saving song ${filename}`, err);
			throw err;
		}
	});

	fs.appendFile(
		`${SONGS_FOLDER}/all-formatted.txt`,
		formattedLyric,
		(err) => {
			if (err) {
				console.error(`Failed appending song ${filename}`, err);
				throw err;
			}
		}
	);
};

async function init() {
	if (!fs.existsSync(SONGS_FOLDER)) {
		fs.mkdirSync(SONGS_FOLDER);
	}
	if (!fs.existsSync(`${SONGS_FOLDER}/all-formatted.txt`)) {
		fs.writeFileSync(`${SONGS_FOLDER}/all-formatted.txt`, "");
	}

	for (const url of urls) {
		const filename = function (url) {
			const split = url.split("/");
			return split[split.length - 2];
		};

		await scrapAndSaveRecipeUrl(url, filename(url));
	}
}

init();
