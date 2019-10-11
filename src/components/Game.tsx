import React from 'react';
import styled from 'styled-components';

import GameControls from './GameControls';
import GameBoard from './GameBoard';
import LeaderBoard from './LeaderBoard';

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

interface GameProps {
}

interface GameState {
    /**
     * The game settings, eg. time signature, BPM and bars to play.
     */
    settings: GameSettings;

    /**
     * Whether the game is currently in play, also true when counting down.
     */
    playing: boolean;

    /**
     * The most recent beat that was played
     */
    currentBeat: number;

    /**
     * Whether the game is counting down/countdown pane is shown.
     */
    countingDown: boolean;

    /**
     * The score per beat that the player has scored. Should be values of
     * GameConfig.Score
     */
    scorePerBeat: number[];

    /**
     * Whether the leaderboard is currently being shown.
     */
    showLeaderBoard: boolean;
}

/**
 * Main game component that manages game state, and passes that state onto the
 * UI components accordingly.
 * 
 * The event chain for a game goes as follows:
 * 1. onPlay (play button pressed)
 * 2. onCountDown (for every count down tick)
 * 3. onStart (count down ended, game started)
 * 4. onBeat (for every beat ticked)
 * 5. onFinish (right as the last beat plays)
 * 
 * The event chain can be interrupted at any point, which calls onStop.
 */
export default class Game extends React.Component<GameProps, GameState> {

    //=========================================================================
    // Properties
    //=========================================================================

    private ticker: Async.Ticker | undefined = undefined;
    private beatTimes: number[] = [];

    //=========================================================================
    // Constructor
    //=========================================================================

    public constructor(props: GameProps) {
        super(props);
        this.state = {
            settings: GameConfig.DefaultGameSettings,
            playing: false,
            currentBeat: 0,
            countingDown: false,
            scorePerBeat: [],
            showLeaderBoard: false,
        };
    }

    //=========================================================================
    // Methods
    //=========================================================================

    /**
     * Sets a beat score via the React setState function, so React can properly
     * deal with the state change. A beat score cannot be overridden once set,
     * except through reset(), which resets all scores.
     * 
     * @param beat  The beat number to set the score for
     * @param score The score to set the beat to, if it has no score set yet
     */
    private setBeatScore(beat: number, score: number): void {
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

    /**
     * Resets the game state to the beginning state, or to the start of
     * countdown.
     * 
     * @param countDown Whether to start countdown after resetting
     */
    private reset(countDown: boolean = false): void {
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

    /**
     * Triggered when the settings change, via the game controls.
     * 
     * @param newSettings The new game settings
     */
    private onSettingsChange(newSettings: GameSettings): void {
        this.reset();
        this.setState({ settings: newSettings });
    }

    /**
     * Triggered when the play button is toggled, via the game controls.
     */
    private onTogglePlay(): void {
        this.setState((prevState, props) => ({
            playing: !prevState.playing
        }));
    }

    /**
     * Triggered when the player taps, eg. clicks.
     */
    private onTap(): void {
        if (!this.state.playing || this.state.countingDown)
            return;

        let tapTime = Date.now();
        let beatTime = this.beatTimes[this.state.currentBeat];
        this.setBeatScore(this.state.currentBeat, GameConfig.getScore(tapTime, beatTime, this.state.settings.getMsPerBeat()));

        // Log the difference for calibration purposes, see README.md
        console.log(tapTime - beatTime);
    }

    /**
     * Triggered when the game is started by the player. Starts countdown.
     */
    private onLeaderBoardClose(): void {
        this.setState({playing: false, showLeaderBoard: false});
    }

    //=========================================================================
    // Game event handlers
    //=========================================================================

    /**
     * Triggered when the game is started by the player. Starts countdown.
     */
    private onPlay(): void {
        this.reset(true);

        this.ticker = new Async.Ticker({
            onTick: this.onCountDown.bind(this),
            onFinish: this.onStart.bind(this),
            interval: this.state.settings.getMsPerBeat(),
        });
        this.ticker.start(this.state.settings.timeSignature.beatCount);
    }

    /**
     * Triggered when the game is stopped by the player.
     */
    private onStop(): void {
        this.reset();
        if (this.ticker !== undefined)
            this.ticker.stop();
    }

    /**
     * Triggered for every countdown beat.
     */
    private onCountDown(counter: number): void {
        GameConfig.playClickSound(counter === 1);
        this.setState({currentBeat: counter});
    }

    /**
     * Triggered when the game actually starts, right as the last countdown
     * beat ticks.
     */
    private onStart(): void {
        // Delay hiding the countdown pane until the first game beat.
        setTimeout(() => {this.setState({countingDown: false})}, this.state.settings.getMsPerBeat());

        this.ticker = new Async.Ticker({
            onTick: this.onBeat.bind(this),
            onFinish: this.onFinish.bind(this),
            interval: this.state.settings.getMsPerBeat(),
        });
        this.ticker.start(this.state.settings.getBeatsToPlay());
    }

    /**
     * Triggered when a beat is played.
     * 
     * @param counter The current beat counter value, eg. which beat this is.
     */
    private onBeat(counter: number): void {
        GameConfig.playClickSound((counter - 1) % this.state.settings.timeSignature.beatCount === 0);

        this.setState({currentBeat: counter});
        this.beatTimes[counter] = Date.now();

        // Mark the beat as missed if no tap is received in time
        setTimeout(
            () => { this.setBeatScore(counter, GameConfig.Score.Miss); },
            this.state.settings.getMsPerBeat() / 2
        );
    }

    /**
     * Triggered right as the last beat is played.
     * Note: not triggered by the stop button.
     */
    private onFinish(): void {
        setTimeout(() => {this.setState({showLeaderBoard: true})}, this.state.settings.getMsPerBeat());
    }

    //=========================================================================
    // React overloads
    //=========================================================================

    public componentDidUpdate(prevProps: GameProps, prevState: GameState): void {
        if (this.state.playing !== prevState.playing) {
            if (this.state.playing)
                this.onPlay();
            else
                this.onStop();
        }
    }

    public render(): React.ReactNode {
        let leaderBoard;
        if (this.state.showLeaderBoard) {
            leaderBoard = (
                <LeaderBoard
                    settings={this.state.settings}
                    score={GameConfig.calculateScore(this.state.scorePerBeat)}
                    onClose={this.onLeaderBoardClose.bind(this)}
                />
            );
        }

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
                {leaderBoard}
            </Container>
        )
    }
}
