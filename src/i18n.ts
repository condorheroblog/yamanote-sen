import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
	en: {
		translation: {
			outerLoop: "Outer Loop",
			innerLoop: "Inner Loop",
			previous: "Previous station",
			next: "Next station",
			play: "Play",
			pause: "Pause",
			settings: "Settings",
			close: "Close",
			appearance: "Appearance",
			light: "Light",
			dark: "Dark",
			stationNames: "Station names",
			langEn: "EN",
			langJp: "JP",
			offlinePlayback: "Offline playback",
			offlineDescription: "Audio is cached on demand as you listen. Tap the install button to use this site offline.",
			about: "About",
			aboutP1: "These evocative soundscapes combine the station melodies, announcements, door chimes and train sounds of the Yamanote Line to create a complete auditory experience of Tokyo's favourite railway loop.",
			aboutP2: "Each direction has its own distinct set of station melodies, so your journey sounds different whether you travel clockwise on the outer loop or anticlockwise on the inner loop.",
			aboutP3: "Travelling twice the speed of the real Yamanote line, you can travel around the virtual loop in just 30 minutes.",
			aboutNote: "Note: many of the 30 stations share the same handful of melodies — shared ones are marked in green below.",
			theMelodies: "The melodies",
			station: "Station",
			showAll: "Show all 30 stations",
			hideAll: "Hide stations",
			loading: "Loading…",
			ready: "Ready",
			menu: "Menu",
			audioSrc: "Audio streamed from yamanote.fun",
			noAudio: "Audio unavailable",
			by: "Powered by the open data at yamanote.fun",
		},
	},
	jp: {
		translation: {
			outerLoop: "外回り",
			innerLoop: "内回り",
			previous: "前の駅",
			next: "次の駅",
			play: "再生",
			pause: "一時停止",
			settings: "設定",
			close: "閉じる",
			appearance: "外観",
			light: "ライト",
			dark: "ダーク",
			stationNames: "駅名表示",
			langEn: "英",
			langJp: "日",
			offlinePlayback: "オフライン再生",
			offlineDescription: "音声は再生時にオンデマンドでキャッシュされます。インストールボタンからオフラインでご利用いただけます。",
			about: "このサイトについて",
			aboutP1: "このサイトは山手線の駅メロ・案内放送・ドアチャイム・走行音を組み合わせ、東京の環状線の乗車体験全体を再現します。",
			aboutP2: "内回りと外回りでは駅メロが異なり、乗車する方向によって体験が変わります。",
			aboutP3: "実車の2倍の速度で、仮想一周は約30分で完了します。",
			aboutNote: "30駅中多くが同じ数曲のメロを共有しています。共有されているものは下の表で緑色で表示されます。",
			theMelodies: "駅メロ一覧",
			station: "駅",
			showAll: "30駅を表示",
			hideAll: "閉じる",
			loading: "読み込み中…",
			ready: "準備完了",
			menu: "メニュー",
			audioSrc: "音声は yamanote.fun からストリーミング",
			noAudio: "音声を読み込めません",
			by: "yamanote.fun のオープンデータを利用",
		},
	},
};

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		supportedLngs: ["en", "jp"],
		detection: {
			order: ["localStorage", "navigator"],
			lookupLocalStorage: "yamanote-sen.lang",
			caches: ["localStorage"],
		},
		interpolation: { escapeValue: false },
	});

export default i18n;
