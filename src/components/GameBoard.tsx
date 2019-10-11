import React from 'react';
import styled from 'styled-components';

import NoteGraphic from './NoteGraphic'

import * as Measures from './../utility/measures';
import * as Async from './../utility/async';

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
    padding: 1em;
`

const BarsOuter = styled.div`
    display: table;
    width: 100%;
    height: 3em;
    border-left: 0.1em solid black;
`

const BarsInner = styled.div`
    display: table-row;
`

const Bar = styled.div`
    display: table-cell;
    text-align: center;
    border-right: 0.1em solid black;
    border-top: none;
    border-bottom: none;
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
    padding-top: 0.7em;
`

interface GameBoardProperties {
    timeSignature: Measures.TimeSignature;
    barsToPlay: number;
    currentBeat: number;
    countingDown: boolean;
    scorePerBeat: number[];
    onClick: () => void;
}

interface GameBoardState {
}

export default class GameBoard extends React.Component<GameBoardProperties, GameBoardState> {

    //=========================================================================
    // React overloads
    //=========================================================================

    public render() {
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
                            {new Array(this.props.barsToPlay).fill(null).map(
                                (_, barIndex) => this.renderBar(barIndex)
                            )}
                        </BarsInner>
                    </BarsOuter>
                </Board>
            );
        }

        return (
            <Container onClick={this.props.onClick}>
                {content}
            </Container>
        );
    }

    //=========================================================================
    // Helper functions
    //=========================================================================

    private renderBar(barIndex: number) {
        return (
            <Bar>
                <BeatsOuter>
                    <BeatsInner>
                        {new Array(this.props.timeSignature.beatCount).fill(null).map(
                            (_, beatIndex) => this.renderBeat(barIndex, beatIndex)
                        )}
                    </BeatsInner>
                </BeatsOuter>
            </Bar>
        );
    }

    private renderBeat(barIndex: number, beatIndex: number) {
        return (
            <Beat>
                <NoteGraphic
                    beatLength={this.props.timeSignature.beatLength}
                    played={this.props.currentBeat > barIndex * this.props.timeSignature.beatCount + beatIndex}
                />
            </Beat>
        );
    }
}
