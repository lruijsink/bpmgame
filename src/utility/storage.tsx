import {GameSettings} from './gameSettings'

export interface ScoresRow {
	name: string;
	score: number;
}

export class Scores {
	public static select(settings: GameSettings): ScoresRow[] {
		let serialized = localStorage.getItem(Scores.settingsToKey(settings));
		return serialized === null
		     ? []
		     : JSON.parse(serialized);
	}

	public static insert(row: ScoresRow, settings: GameSettings) {
		let current = Scores.select(settings);
		current.push(row);
		current.sort((x, y) => y.score - x.score);
		localStorage.setItem(Scores.settingsToKey(settings), JSON.stringify(current));
	}

	private static settingsToKey(settings: GameSettings) {
		return "scores" 
		     + "_" + settings.timeSignature.beatCount
		     + "_" + settings.timeSignature.beatLength.units
		     + "_" + settings.bpm
		     + "_" + settings.barsToPlay;
	}
}
