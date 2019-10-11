import React from 'react';
import styled from 'styled-components';

import GameControls from './GameControls';
import GameBoard from './GameBoard';

import * as Measures from './../utility/measures';
import * as Async from './../utility/async';
import {GameSettings} from './../utility/gameSettings';
import * as GameConfig from './../utility/gameConfig';

const Container = styled.div`
    background-color: var(--main-bg-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: var(--main-font-color);

    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    -o-user-select:none;
    user-select:none;
`

interface GameProperties {
}

interface GameState {
    settings: GameSettings;
    playing: boolean;
    currentBeat: number;
    countingDown: boolean;
    scorePerBeat: number[];
}

export default class Game extends React.Component<GameProperties, GameState> {

    //=========================================================================
    // Properties
    //=========================================================================

    private ticker: Async.Ticker | undefined = undefined;
    private beatTimes: number[] = [];

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: GameProperties) {
        super(props);
        this.state = {
            settings: GameConfig.DefaultGameSettings,
            playing: false,
            currentBeat: 0,
            countingDown: false,
            scorePerBeat: [],
        };
    }

    //=========================================================================
    // Methods
    //=========================================================================

    private setBeatScore(beat: number, score: number) {
        // Update state.scorePerBeat array, but via setState so React can
        // properly deal with the state change
        this.setState((prevState, props) => ({
            scorePerBeat: prevState.scorePerBeat.map(
                (v, i) => prevState.playing && i === beat && v === GameConfig.Score.Unknown
                        ? score
                        : v
            )
        }));
    }

    private reset(countDown: boolean = false) {
        this.beatTimes = new Array<number>(this.state.settings.getBeatsToPlay() + 1).fill(0);

        this.setState((prevState, props) => ({
            currentBeat: 0,
            countingDown: countDown,
            scorePerBeat: new Array<number>(this.state.settings.getBeatsToPlay() + 1).fill(GameConfig.Score.Unknown)
        }));
    }

    //=========================================================================
    // Event handlers
    //=========================================================================

    private onSettingsChange(newSettings: GameSettings) {
        this.reset();
        this.setState({ settings: newSettings });
    }

    private onTogglePlay() {
        this.setState((prevState, props) => ({
            playing: !prevState.playing
        }));
    }

    private onStop() {
        this.reset();
        if (this.ticker !== undefined)
            this.ticker.stop();
    }

    private onPlay() {
        this.reset(true);

        this.ticker = new Async.Ticker({
            onTick: this.onCountDown.bind(this),
            onFinish: this.onStart.bind(this),
            interval: this.state.settings.getMsPerBeat(),
        });
        this.ticker.start(this.state.settings.timeSignature.beatCount);
    }

    private onCountDown(counter: number) {
        GameConfig.playClickSound(counter === 1);
        this.setState({currentBeat: counter});
    }

    private onStart() {
        setTimeout(() => {this.setState({countingDown: false})}, this.state.settings.getMsPerBeat());

        this.ticker = new Async.Ticker({
            onTick: this.onBeat.bind(this),
            onFinish: this.onFinish.bind(this),
            interval: this.state.settings.getMsPerBeat(),
        });
        this.ticker.start(this.state.settings.getBeatsToPlay());
    }

    private onBeat(counter: number) {
        GameConfig.playClickSound((counter - 1) % this.state.settings.timeSignature.beatCount === 0);

        this.setState({currentBeat: counter});
        this.beatTimes[counter] = Date.now();

        // Mark the beat as missed if no tap is received in time
        setTimeout(
            () => { this.setBeatScore(counter, GameConfig.Score.Miss); },
            this.state.settings.getMsPerBeat() / 2
        );
    }

    private onFinish() {
        setTimeout(() => {this.setState({playing: false})}, this.state.settings.getMsPerBeat());
    }

    private onTap() {
        if (!this.state.playing || this.state.countingDown)
            return;

        let tapTime = Date.now();
        let beatTime = this.beatTimes[this.state.currentBeat];
        this.setBeatScore(this.state.currentBeat, GameConfig.getScore(tapTime, beatTime, this.state.settings.getMsPerBeat()));

        // Log the difference for calibration purposes, see README.md
        console.log(tapTime - beatTime);
    }

    //=========================================================================
    // React overloads
    //=========================================================================

    public componentDidUpdate(prevProps: GameProperties, prevState: GameState) {
        if (this.state.playing !== prevState.playing) {
            if (this.state.playing)
                this.onPlay();
            else
                this.onStop();
        }
    }

    public render() {
        return (
            <Container onClick={this.onTap.bind(this)}>
                <GameControls
                    playing={this.state.playing}
                    onSettingsChange={this.onSettingsChange.bind(this)}
                    onTogglePlay={this.onTogglePlay.bind(this)}
                />
                <GameBoard
                    settings={this.state.settings}
                    currentBeat={this.state.currentBeat}
                    countingDown={this.state.countingDown}
                    scorePerBeat={this.state.scorePerBeat}
                />
            </Container>
        )
    }
}
