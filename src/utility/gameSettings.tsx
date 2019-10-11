import * as Measures from './measures';

interface GameSettingsProperties {
    barsToPlay: number;
    bpm: number;
    timeSignature: Measures.TimeSignature;
}

export class GameSettings {
    public readonly barsToPlay: number;
    public readonly bpm: number;
    public readonly timeSignature: Measures.TimeSignature;

    public constructor(props: GameSettingsProperties) {
        this.barsToPlay = props.barsToPlay;
        this.bpm = props.bpm;
        this.timeSignature = props.timeSignature;
    }

    public equals(other: GameSettings): boolean {
        return this.barsToPlay === other.barsToPlay
            && this.bpm === other.bpm
            && this.timeSignature.equals(other.timeSignature);
    }

    public getBeatsToPlay(): number {
        return this.timeSignature.beatCount * this.barsToPlay;
    }

    public getMsPerBeat(): number {
        return this.timeSignature.beatLength.toMilliseconds(this.bpm);
    }
}
