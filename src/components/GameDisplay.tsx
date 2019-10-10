import React from 'react';
import styled from 'styled-components';
import NumericSelector from './NumericSelector';
import * as Measures from './../utility/measures';
import {StyledButton} from './StyledButton';

const Container = styled.div`
    width: 30em;
    height: 7em;
    display: table;
    table-layout: fixed;
    border-spacing: 0.3em;
`

const InnerContainer = styled.div`
    display: table-row;
    table-layout: fixed;
`

const Panel = styled.div`
    display: table-cell;
    table-layout: fixed;
    background: var(--panel-bg-color);
    border: none;
    border-radius: 0.5em;
`

const BPMPanel = styled(Panel)`
    width: 25%;
`

const TimeSignaturePanel = styled(Panel)`
    width: 25%;
`

const ButtonsPanel = styled(Panel)`
    width: 50%;
`

const PanelLabel = styled.div`
    font-size: 0.7em;
    height: 1.7em;
    padding-top: 0.3em;
    color: var(--label-font-color);
`

const PanelContent = styled.div`
    width: 100%;
    height: 5em;
    vertical-align: middle;
`

const PanelContentContainer = styled.div`
    margin: 0 auto;
    display: inline-block;
`

const PlayButton = styled(StyledButton)`
    font-size: inherit;
    border-radius: 50%;
    border-width: 0.2em;
    height: 4em;
    width: 4em;
`

interface GameControlsProperties {
    disabled: boolean;
}

interface GameControlsState {
    timeSignature: Measures.TimeSignature;
    bpm: number;
}

export default class GameControls extends React.Component<GameControlsProperties, GameControlsState> {
    public static defaultProps = {
        disabled: false
    };

    constructor(props: GameControlsProperties) {
        super(props);

        this.state = {
            timeSignature: new Measures.TimeSignature(4, Measures.Note.Quarter),
            bpm: 120
        };
    }

    updateTimeSignatureCount(newCount: number) {
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(newCount, state.timeSignature.beatLength)
        }));
    }

    updateTimeSignatureLength(newValue: number) {
        let newLength = new Measures.TimeSpan(Measures.Note.Whole.units / newValue);
        this.setState((state, props) => ({
            timeSignature: new Measures.TimeSignature(state.timeSignature.beatCount, newLength)
        }));
    }

    updateBPM(newBPM: number) {
        this.setState((state, props) => ({
            bpm: newBPM
        }));
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        return (
            <Container>
                <InnerContainer>
                    <BPMPanel>
                        <PanelLabel>
                            BPM
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <NumericSelector
                                    value={120}
                                    options={[50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]}
                                    disabled={this.props.disabled}
                                    onChange={this.updateBPM.bind(this)} />
                            </PanelContentContainer>
                        </PanelContent>
                    </BPMPanel>
                    <TimeSignaturePanel>
                        <PanelLabel>
                            Time signature
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <NumericSelector
                                    value={4}
                                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                                    disabled={this.props.disabled}
                                    onChange={this.updateTimeSignatureCount.bind(this)} />
                                <NumericSelector
                                    value={4}
                                    options={[1, 2, 4, 8, 16]}
                                    disabled={this.props.disabled}
                                    onChange={this.updateTimeSignatureLength.bind(this)} />
                            </PanelContentContainer>
                        </PanelContent>
                    </TimeSignaturePanel>
                    <ButtonsPanel>
                        <PanelLabel>
                            Controls
                        </PanelLabel>
                        <PanelContent>
                            <PanelContentContainer>
                                <PlayButton>Play</PlayButton>
                            </PanelContentContainer>
                        </PanelContent>
                    </ButtonsPanel>
                </InnerContainer>
            </Container>
        )
    }
}
