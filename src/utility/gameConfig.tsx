import * as Measures from './measures';
import {GameSettings} from './gameSettings';
import {Sound} from './sound';

//=============================================================================
// Defaults
//=============================================================================

export const DefaultBarsToPlay = 4;
export const DefaultBPM = 120;
export const DefaultTimeSignature = new Measures.TimeSignature(4, Measures.Note.Quarter);
export const DefaultGameSettings = new GameSettings({
	barsToPlay: DefaultBarsToPlay,
	bpm: DefaultBPM,
	timeSignature: DefaultTimeSignature,
});

//=============================================================================
// Game settings options
//=============================================================================

export const BPMOptions = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240];
export const TimeSignatureCountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const TimeSignatureLengthOptions = [1, 2, 4, 8, 16];

//=============================================================================
// Scoring
//=============================================================================

export enum Score {
	Perfect = 10,
	Good = 5,
	Miss = 0,
	Unknown = -1,
};

export const TapCompensationFactor = 100;
export function getScore(tapTime: number, beatTime: number, msPerBeat: number) {
	tapTime -= TapCompensationFactor;
	
	let perfectTimeWindow = Math.min(msPerBeat * 0.2, 60);
	let goodTimeWindow = Math.min(msPerBeat * 0.3, 100);
	
	let timeDifference = Math.abs(tapTime - beatTime);
	if (timeDifference < perfectTimeWindow)
		return Score.Perfect;
	else if (timeDifference < goodTimeWindow)
		return Score.Good;
	else
		return Score.Miss;
}

export function calculateScore(scorePerBeat: number[]) {
	scorePerBeat[0] = 0;
	let total = scorePerBeat.reduce((x, y) => x + y, 0);
	let max = (scorePerBeat.length - 1) * Score.Perfect;
	return Math.round(100 * total / max);
}

//=============================================================================
// Audio
//=============================================================================

export const ClickSound = new Sound("click.wav");
export const AccentedClickSound = new Sound("click_accented.wav");
export function playClickSound(accented: boolean) {
	(accented ? AccentedClickSound : ClickSound).play();
}