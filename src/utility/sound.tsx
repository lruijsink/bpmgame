/**
 * Helper class for playing audio.
 */
export class Sound {
    /**
     * The underlying Audio object.
     */
    private audio = new Audio();

    /**
     * Constructs the Sound object for a given audio file. Always look for the
     * file in the public/audio folder.
     * 
     * @param filename The filename of the audio file.
     */
    public constructor(filename: string) {
        this.audio = new Audio(process.env.PUBLIC_URL + "/audio/" + filename);
    }

    /**
     * Plays the audio file, or restarts it from the beginning if it was still
     * playing.
     */
    public play(): void {
        if (this.audio.paused)
            this.audio.play();
        else
            this.audio.currentTime = 0;
    }
}
