import React from 'react';
import styled from 'styled-components';

import NoteGraphic from './NoteGraphic'

import {GameSettings} from './../utility/gameSettings';

const Container = styled.div`
    width: 29.4em;
    height: 5em;
    margin: 0.3em;
    margin-top: 0;
    background: var(--panel-bg-color);
    border: none;
    border-radius: 0.5em;
`

const CountDown = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 1em;
`

const CountDownMessage = styled.div`
`

const CountDownCounter = styled.div`
`

const Board = styled.div`
    padding: 0.5em;
    padding-left: 0;
    padding-right: 0;
`

const BarsOuter = styled.div`
    display: table;
    width: 100%;
    height: 4em;
`

const BarsInner = styled.div`
    display: table-row;
`

const Bar = styled.div`
    display: table-cell;
    text-align: center;
    border-left: 0.1em solid var(--control-border-color);

    :first-child {
        border-color: transparent;
    }
`

const BeatsOuter = styled.div`
    display: table;
    width: 100%;
    height: 3em;
`

const BeatsInner = styled.div`
    display: table-row;
`

const Beat = styled.span`
    display: table-cell;
    padding-top: 0.8em;
`

interface GameBoardProps {
    /**
     * The current game settings, as passed down by Game.
     */
    settings: GameSettings;

    /**
     * The most recent beat that was played.
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
}

interface GameBoardState {
}

/**
 * Game board component that displays either the game board (a musical staff
 * with bars and notes to represent beats), or a countdown pane.
 */
export default class GameBoard extends React.Component<GameBoardProps, GameBoardState> {

    //=========================================================================
    // React overloads
    //=========================================================================

    public render(): React.ReactNode {
        let content;
        if(this.props.countingDown) {
            content = (
                <CountDown>
                    <CountDownMessage>Counting down, get ready!</CountDownMessage>
                    <CountDownCounter>{this.props.currentBeat > 0 ? this.props.currentBeat : ""}</CountDownCounter>
                </CountDown>
            );
        }
        else {
            content = (
                <Board>
                    <BarsOuter>
                        <BarsInner>
                            {new Array(this.props.settings.barsToPlay).fill(null).map(
                                (_, barIndex) => this.renderBar(barIndex)
                            )}
                        </BarsInner>
                    </BarsOuter>
                </Board>
            );
        }

        return (
            <Container>
                {content}
            </Container>
        );
    }

    //=========================================================================
    // Helper functions
    //=========================================================================

    private renderBar(barIndex: number): React.ReactNode {
        return (
            <Bar key={"bar" + barIndex}>
                <BeatsOuter>
                    <BeatsInner>
                        {new Array(this.props.settings.timeSignature.beatCount).fill(null).map(
                            (_, beatIndex) => this.renderBeat(barIndex, beatIndex)
                        )}
                    </BeatsInner>
                </BeatsOuter>
            </Bar>
        );
    }

    private renderBeat(barIndex: number, beatIndex: number): React.ReactNode {
        let beatNumber = barIndex * this.props.settings.timeSignature.beatCount + beatIndex;
        return (
            <Beat key={"beat" + beatNumber}>
                <NoteGraphic
                    beatLength={this.props.settings.timeSignature.beatLength}
                    played={this.props.currentBeat > beatNumber}
                    score={this.props.scorePerBeat[beatNumber + 1]}
                />
            </Beat>
        );
    }
}
