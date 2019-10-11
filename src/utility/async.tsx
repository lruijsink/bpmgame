interface TickerProperties {
    onTick: (count: number) => void;
    onFinish?: () => void;
    interval: number;
}

export class Ticker {
    private tolerance: number = 4;
    private running: boolean = true;
    private props: TickerProperties;

    constructor(props: TickerProperties) {
        this.props = props;
    }

    start(countTo: number) {
        this.running = true;
        this.run(countTo);
    }

    stop() {
        this.running = false;
    }

    onFinish() {
        this.running = false;
        if (this.props.onFinish !== undefined)
            this.props.onFinish();
    }

    private async run(countTo: number) {
        let counter: number = 0;
        let nextTick = Date.now() + this.props.interval;
        while(counter < countTo && this.running) {
            if(nextTick - Date.now() < this.tolerance) {
                counter++;
                this.props.onTick(counter);
                nextTick = Date.now() + this.props.interval;
            }
            await this.sleep(4);
        }
        if(this.running) {
            this.onFinish();
        }
    }

    private async sleep(ms: number) {
        let promise = new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
        await promise;
    }
}
