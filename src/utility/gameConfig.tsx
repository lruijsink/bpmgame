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

/**
 * The game uses setTimeout/setInterval for timing, which is not very accurate.
 * To compensate for this, there is this compensation factor, which offsets the
 * player's tapping time by this factor. Value in milliseconds.
 * 
 * To calibrate, run the game with the browser console open. Tap as accurately
 * as you can and watch the values printed to the console. This factor should
 * hover around the average of those values. See also README.md
 */
export const TapCompensationFactor = 100;

/**
 * Calculates the score that the player earns for a tap.
 * 
 * @param tapTime   Time value (Date.now()) when the tap occured.
 * @param beatTime  Time value when the beat occured.
 * @param msPerBeat How many milliseconds between beats.
 * @return          The score that the player earns for the tap.
 */
export function getScore(tapTime: number, beatTime: number, msPerBeat: number): number {
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

/**
 * Calculates the total score for a given game.
 * 
 * @param scorePerBeat The scores earned per beat
 * @return             The total score earned
 */
export function calculateScore(scorePerBeat: number[]): number {
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
export function playClickSound(accented: boolean): void {
    (accented ? AccentedClickSound : ClickSound).play();
}

//=============================================================================
// Images
//=============================================================================
export const NoteLengthToImage = new Map([
    [Measures.Note.Whole.units,     process.env.PUBLIC_URL + "/svg/WholeNote.png"],
    [Measures.Note.Half.units,      process.env.PUBLIC_URL + "/svg/HalfNote.png"],
    [Measures.Note.Quarter.units,   process.env.PUBLIC_URL + "/svg/QuarterNote.png"],
    [Measures.Note.Eighth.units,    process.env.PUBLIC_URL + "/svg/EighthNote.png"],
    [Measures.Note.Sixteenth.units, process.env.PUBLIC_URL + "/svg/SixteenthNote.png"]
]);