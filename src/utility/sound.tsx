export class Sound {
    private audio = new Audio();

    public constructor(filename: string) {
        this.audio = new Audio(process.env.PUBLIC_URL + "/audio/" + filename);
    }

    public play() {
        if (this.audio.paused)
            this.audio.play();
        else
            this.audio.currentTime = 0;
    }
}