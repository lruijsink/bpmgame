import {GameSettings} from './gameSettings'

/**
 * A row in a scores table.
 */
export interface ScoresRow {
    /**
     * The name of the player who earned the score.
     */
    name: string;

    /**
     * The score that the player earned.
     */
    score: number;
}

/**
 * Helper static class for storing and retrieving leaderboard scores. Scores
 * are sorted by game setting. Uses the built-in localStorage feature of the
 * browser to store the scores.
 */
export class Scores {
    /**
     * Fetches all scores for a given game setting.
     * 
     * @param settings The game settings to fetch the scores for.
     * @return         The relevant scores.
     */
    public static select(settings: GameSettings): ScoresRow[] {
        let serialized = localStorage.getItem(Scores.settingsToKey(settings));
        return serialized === null
             ? []
             : JSON.parse(serialized);
    }

    /**
     * Inserts a new score into for a given game setting.
     * 
     * @param row      The row to insert.
     * @param settings The game setting to insert the row for.
     */
    public static insert(row: ScoresRow, settings: GameSettings): void {
        let current = Scores.select(settings);
        current.push(row);
        current.sort((x, y) => y.score - x.score);
        localStorage.setItem(Scores.settingsToKey(settings), JSON.stringify(current));
    }

    /**
     * Converts a game setting to the relevant key under which scores for that
     * setting are stored.
     * 
     * @param settings The setting to get the key for.
     * @return         The key for the setting.
     */
    private static settingsToKey(settings: GameSettings): string {
        return "scores" 
             + "_" + settings.timeSignature.beatCount
             + "_" + settings.timeSignature.beatLength.units
             + "_" + settings.bpm
             + "_" + settings.barsToPlay;
    }
}
