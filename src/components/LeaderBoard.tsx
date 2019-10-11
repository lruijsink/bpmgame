import React from 'react';
import styled from 'styled-components';

import {GameSettings} from './../utility/gameSettings';
import * as GameConfig from './../utility/gameConfig';
import * as Measures from './../utility/measures';

const Container = styled.div`
	z-index: 1;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: var(--modal-overlay-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: var(--main-font-color);
`

const Modal = styled.div`
	width: 20em;
	height: 10em;
	margin-top: -8em;
	background: var(--panel-bg-color);
	border-radius: 0.5em;
	box-shadow: 0 0 0.5em var(--modal-shadow-color);
	padding: 0.5em 1em 0.5em 1em;
`

const ModalHeader = styled.div`
`

const ModalSettingsLabel = styled.div`
	float: right;
	margin-top: 0.2em;
	font-size: 0.7em;
	color: var(--label-font-color);
`

const ModalDescription = styled.div`
	font-size: 0.7em;
`

const ScoreTable = styled.div`
	display: table;
	table-layout: fixed;
	width: 100%;
	font-size: 0.7em;
	margin-top: 1em;
`

const ScoreRow = styled.div`
	display: table-row;
`

const ScoreCell = styled.div`
	display: table-cell;
	border-bottom: 0.1em solid var(--control-border-color);
	padding: 0.2em 0 0.2em 0;
`

const ScoreName = styled(ScoreCell)`
	width: 10em;
`

const ScoreValue = styled(ScoreCell)`
	border-bottom: 0.1em solid var(--control-border-color);
`

const PlayerScoreName = styled(ScoreName)`
	border-color: var(--label-font-color);
	:hover {
		border-color: var(--hovered-control-border-color);
	}
`

const ScoreInput = styled.input`
	font-size: inherit;
	height: 100%;
	width: 9em;
	border: none;
`

interface LeaderBoardProps {
	settings: GameSettings;
	score: number;
	onClose: () => void;
}

interface LeaderBoardState {
	name: string;
}

export default class LeaderBoard extends React.Component<LeaderBoardProps, LeaderBoardState> {
	
	public constructor(props: LeaderBoardProps) {
		super(props);
		this.state = {name: ""};
	}

	private onNameChange(event: React.FormEvent<HTMLInputElement>) {
		if (event.target === null)
			return;
		this.setState({name: event.currentTarget.value});
	}

	private onSubmit() {
		this.onClose();

		if (this.state.name === "")
			return;

		console.log(this.state.name);
	}

	private onClose() {
		this.props.onClose();
	}

	public render() {
		let settings = this.props.settings.timeSignature.beatCount
		             + "/"
		             + Measures.Note.Whole.units / this.props.settings.timeSignature.beatLength.units
		             + ", " + this.props.settings.bpm + " BPM";

		return (
			<Container onClick={this.onClose.bind(this)}>
				<Modal onClick={(e) => {e.stopPropagation();}}>
					<ModalSettingsLabel>
						{settings}
					</ModalSettingsLabel>
					<ModalHeader>
						You scored {this.props.score}%
					</ModalHeader>
					<ModalDescription>
						Enter your name below to save your score
					</ModalDescription>
					<ScoreTable>
						<ScoreRow>
							<PlayerScoreName>
								<form onSubmit={this.onSubmit.bind(this)}>
									<ScoreInput
										type="textbox"
										onChange={this.onNameChange.bind(this)}
										autoFocus
										placeholder="Your name"
									/>
								</form>
							</PlayerScoreName>
							<ScoreValue>{this.props.score}%</ScoreValue>
						</ScoreRow>
						<ScoreRow>
							<ScoreName>&nbsp;</ScoreName>
							<ScoreValue>&nbsp;</ScoreValue>
						</ScoreRow>
						<ScoreRow>
							<ScoreName>&nbsp;</ScoreName>
							<ScoreValue>&nbsp;</ScoreValue>
						</ScoreRow>
						<ScoreRow>
							<ScoreName>&nbsp;</ScoreName>
							<ScoreValue>&nbsp;</ScoreValue>
						</ScoreRow>
						<ScoreRow>
							<ScoreName>&nbsp;</ScoreName>
							<ScoreValue>&nbsp;</ScoreValue>
						</ScoreRow>
					</ScoreTable>
				</Modal>
			</Container>
		);
	}
}
