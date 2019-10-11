/**
 * Represents a rhythmic timespan that is independent of BPM. For example: an
 * eighth note, 3 half notes or a bar are all cases of rhythmic timespans.
 */
export class TimeSpan {
    /**
     * How many times TimeUnit fits in the timespan
     */
    readonly units: number;

    /**
     * The timespan should be expressed in terms of TimeUnit; the smallest
     * possible timespan.
     * 
     * @param units    How many times TimeUnit fits in the timespan
     */
    constructor(units: number) {
        this.units = units;
    }

    /**
     * Converts the timespan in units of TimeUnit to seconds, given a BPM and
     * what the note length of a beat should be.
     * 
     * @param beatsPerMinute    The BPM to convert to
     * @param beatNoteLength    The note length of a beat
     * @return                  The timespan converted to seconds
     */
    toSeconds(beatsPerMinute: number,
              beatNoteLength: TimeSpan = Note.Quarter): number {
        let beatsPerSecond: number = beatsPerMinute / 60;
        return this.units / (beatsPerSecond * beatNoteLength.units);
    }

    /**
     * Converts the timespan in units of TimeUnit to milliseconds, given a BPM
     * and what the note length of a beat should be. Unlike toSeconds, which
     * returns a float, this function will round to an integer.
     * 
     * @param beatsPerMinute    The BPM to convert to
     * @param beatNoteLength    The note length of a beat
     * @return                  The timespan converted to milliseconds
     */
    toMilliseconds(beatsPerMinute: number,
                   beatNoteLength: TimeSpan = Note.Quarter): number {
        return Math.round(1000 * this.toSeconds(beatsPerMinute, beatNoteLength));
    }
}

/**
 * Represents a note length, as in whole note, half note, quarter note, etc.
 * The numeric value is how many times TimeUnit goes into the beat length.
 */
export const Note = {
    Whole: new TimeSpan(16),
    Half: new TimeSpan(8),
    Quarter: new TimeSpan(4),
    Eighth: new TimeSpan(2),
    Sixteenth: new TimeSpan(1),
}

/**
 * The unit to use for time measures; the smallest possible interval that can
 * be expressed in the application.
 */
export const Unit: TimeSpan = Note.Sixteenth;

/**
 * Represents a rhythmic time signature like 4/4 (common time), 6/8, etc.
 */
export class TimeSignature {
    /**
     * The number of beats per bar
     */
    readonly beatCount: number;

    /**
     * The note length of a beat
     */
    readonly beatLength: TimeSpan;

    /**
     * Constructs a new time signature. Count and length are the delimiter and
     * denominator of the signature respectively. For example, 3/4 time
     * (waltzes etc.) would be 3 (count) beats of quarter notes (length).
     * 
     * @param count  The number of beats per bar
     * @param length The note length of a beat
     */
    public constructor(count : number,
                       length : TimeSpan) {
        this.beatCount = count;
        this.beatLength = length;
    }

    /**
     * Tests for equality against another time signature.
     * 
     * @param other    The time signature to test against
     * @return boolean Whether this time signature equals the other
     */
    public equals(other: TimeSignature): boolean {
        return this.beatCount  === other.beatCount
            && this.beatLength === other.beatLength;
    }
}
