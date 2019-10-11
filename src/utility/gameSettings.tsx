import * as Measures from './measures';

/**
 * The properties that should be passed to GameSettings's constructor.
 */
interface GameSettingsProperties {
    /**
     * How many bars to play for a game.
     */
    barsToPlay: number;

    /**
     * The BPM for a game.
     */
    bpm: number;

    /**
     * The time signature for a game.
     */
    timeSignature: Measures.TimeSignature;
}

/**
 * Stores game settings, which the player can change through the game controls.
 */
export class GameSettings {

    //=========================================================================
    // Properties (see GameSettingsProperties)
    //=========================================================================
    
    public readonly barsToPlay: number;
    public readonly bpm: number;
    public readonly timeSignature: Measures.TimeSignature;

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: GameSettingsProperties) {
        this.barsToPlay = props.barsToPlay;
        this.bpm = props.bpm;
        this.timeSignature = props.timeSignature;
    }

    //=========================================================================
    // Methods
    //=========================================================================

    /**
     * Compares this GameSettings against another for equality.
     * 
     * @param  other The other settings to compare against.
     * @return       Whether these settings equal the other.
     */
    public equals(other: GameSettings): boolean {
        return this.barsToPlay === other.barsToPlay
            && this.bpm === other.bpm
            && this.timeSignature.equals(other.timeSignature);
    }

    /**
     * Calculates how many beats should be played for these settings.
     * 
     * @return How many beats to play
     */
    public getBeatsToPlay(): number {
        return this.timeSignature.beatCount * this.barsToPlay;
    }

    /**
     * Calculates the milliseconds between beats for these settings.
     * 
     * @return How many milliseconds between beats
     */
    public getMsPerBeat(): number {
        return this.timeSignature.beatLength.toMilliseconds(this.bpm);
    }
}
