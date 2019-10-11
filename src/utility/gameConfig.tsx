import * as Measures from './measures';

export enum Score {
	Perfect = 10,
	Good = 5,
	Miss = 0,
	Unknown = -1,
};

export enum TimeWindowMultiplier {
	Perfect = 0.1,
	Good = 0.2,
};

export const BarsToPlay = 4;

export const DefaultBPM = 120;
export const DefaultTimeSignature = new Measures.TimeSignature(4, Measures.Note.Quarter);

export const BPMOptions = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];
export const TimeSignatureCountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const TimeSignatureLengthOptions = [1, 2, 4, 8, 16];
