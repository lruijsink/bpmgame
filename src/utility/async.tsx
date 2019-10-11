/**
 * The properties that should be passed to Ticker's constructor.
 */
interface TickerProperties {
    /** 
     * Callback to call when a tick occurs.
     */
    onTick: (count: number) => void;

    /**
     * Callback to call when the ticker has finished.
     */
    onFinish?: () => void;

    /**
     * The interval to aim for between ticks. Value in milliseconds.
     */
    interval: number;
}

/**
 * Helper class for setting up a ticker, which ticks a given number of times at
 * set intervals, and calls a callback on every tick.
 */
export class Ticker {

    //=========================================================================
    // Constants
    //=========================================================================

    /**
     * How close to the target time the measured time should be, to consider a
     * tick as having occured. Value in milliseconds.
     */
    private static tolerance: number = 4;

    /**
     * How long to sleep for in between checking whether a tick has occured.
     * Value in milliseconds.
     */
    private static sleepTime: number = 4;

    //=========================================================================
    // Properties
    //=========================================================================

    /**
     * Whether the ticker is currently set to run. Used to stop the ticking
     * loop in case stop() is called.
     */
    private running: boolean = true;

    /**
     * The properties as passed to the constructor.
     */
    private props: TickerProperties;

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: TickerProperties) {
        this.props = props;
    }

    //=========================================================================
    // Methods
    //=========================================================================

    /**
     * Starts the ticker for a given number of ticks.
     * 
     * @param countTo How many ticks to tick.
     */
    public start(countTo: number): void {
        this.running = true;
        this.run(countTo);
    }

    /**
     * Stops the ticker without waiting for it to finish. Does not call the
     * onFinish callback set by the properties.
     */
    public stop(): void {
        this.running = false;
    }

    //=========================================================================
    // Private methods
    //=========================================================================

    /**
     * Triggered when the ticker is done ticking.
     */
    private onFinish(): void {
        this.running = false;
        if (this.props.onFinish !== undefined)
            this.props.onFinish();
    }

    /**
     * Runs the ticker in an asynchronous thread. This will continuously sleep
     * for small periods, wake up and check if the next tick has occured yet.
     * 
     * @param countTo How many ticks to perform in total.
     */
    private async run(countTo: number) {
        let counter: number = 0;
        let nextTick = Date.now() + this.props.interval;
        while(counter < countTo && this.running) {
            if(nextTick - Date.now() < Ticker.tolerance) {
                counter++;
                this.props.onTick(counter);
                nextTick = Date.now() + this.props.interval;
            }
            await this.sleep(Ticker.sleepTime);
        }
        if(this.running) {
            this.onFinish();
        }
    }

    /**
     * Sleeps the thread for a given number of milliseconds... roughly.
     * setTimeout is not particularly accurate.
     * 
     * @param ms How many milliseconds to sleep for.
     */
    private async sleep(ms: number) {
        let promise = new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
        await promise;
    }
}
