import GreatCircle from 'great-circle'
import { take } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import Highlighter from 'react-highlight-words'
import Worker from 'worker-loader!./SearchAirports.js'
import { FormDecorator } from '../FormDecorator'
import SendButton from '../SendButton'

const worker = new Worker()

export default FormDecorator('select')(
	class SelectTwoAirports extends React.Component {
		componentDidMount() {
			worker.onmessage = ({ data: { results, which } }) =>
				this.setState({ [which]: { ...this.state[which], results } })
		}
		state = {
			depuis: { inputValue: '' },
			vers: { inputValue: '' },
			validated: false
		}
		renderOptions = (whichInput, { results = [], inputValue }) =>
			!this.state.validated && (
				<ul>
					{take(5, results.map(this.renderOption(whichInput)(inputValue)))}
				</ul>
			)

		renderOption = whichInput => inputValue => option => {
			let { nom, ville, pays } = option,
				inputState = this.state[whichInput],
				choice = inputState && inputState.choice

			let { setFormValue, submit } = this.props

			return (
				<li
					key={nom}
					css={`
						padding: 0.2rem 0.6rem;
						border-radius: 0.3rem;
						${choice && choice.nom === nom
							? 'background: var(--color); color: var(--textColor)'
							: ''};
					`}
					onClick={() => {
						let state = {
							...this.state,
							[whichInput]: { ...this.state[whichInput], choice: option }
						}
						let distance = this.computeDistance(state)
						if (distance) {
							setFormValue(distance)
						}
						this.setState(state)
					}}
				>
					<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
					<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
						<Highlighter
							searchWords={[inputValue]}
							textToHighlight={ville + ' - ' + pays}
						/>
					</span>
				</li>
			)
		}

		render() {
			let { depuis, vers } = this.state
			let placeholder = 'Aéroport ou ville '
			let distance = this.computeDistance(this.state)

			return (
				<>
					<div
						css={`
							label {
								display: flex;
								justify-content: space-around;
								align-items: center;
								margin: 1em;
							}
							input {
								width: 9em !important;
								font-size: 130% !important;
							}
							label > span {
								display: inline-block;
								margin-right: 0.3rem;
							}
							ul {
								border-left: 1px solid #333;
								max-width: 30em;
							}
						`}
					>
						<div>
							<label>
								<span>Départ {emoji('🛫')}</span>
								<input
									type="text"
									value={depuis.inputValue}
									placeholder={placeholder}
									onChange={e => {
										let v = e.target.value
										this.setState({
											depuis: { ...this.state.depuis, inputValue: v },
											validated: false
										})
										if (v.length > 2)
											worker.postMessage({ input: v, which: 'depuis' })
									}}
								/>
							</label>
							{depuis.results && this.renderOptions('depuis', depuis)}
						</div>
						<div>
							<label>
								<span>Arrivée {emoji('🛬')}</span>
								<input
									type="text"
									value={vers.inputValue}
									placeholder={placeholder}
									onChange={e => {
										let v = e.target.value
										this.setState({
											vers: { ...this.state.vers, inputValue: v },
											validated: false
										})
										if (v.length > 2)
											worker.postMessage({ input: v, which: 'vers' })
									}}
								/>
							</label>
							{vers.results && this.renderOptions('vers', vers)}
						</div>
					</div>
					{distance && (
						<div
							css={`
								margin: 1rem 0;
							`}
						>
							Distance {emoji('📏')} : &nbsp;<strong>{distance + ' km'}</strong>
						</div>
					)}
					{distance && !this.state.validated && (
						<SendButton
							{...{ submit: () => this.setState({ validated: true }) }}
						/>
					)}
				</>
			)
		}
		computeDistance({ depuis, vers }) {
			return (
				depuis.choice &&
				vers.choice &&
				Math.round(
					GreatCircle.distance(
						depuis.choice.latitude,
						depuis.choice.longitude,
						vers.choice.latitude,
						vers.choice.longitude,
						'KM'
					)
				)
			)
		}
	}
)
