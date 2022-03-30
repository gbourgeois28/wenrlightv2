import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'

export const humanWeight = (v) => {
	const [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'g']
			: v < 1000
			? [v, 'kg']
			: [v / 1000, 'tonnes']
	return [raw, unit]
}
export default ({ nodeValue }) => {
	const foldedSteps = useSelector((state) => state.simulation?.foldedSteps),
		simulationStarted = foldedSteps && foldedSteps.length

	return (
		<span>
			{!simulationStarted ? (
				<em>{emoji('')} </em>
			) : (
				<em></em>
			)}

		</span>
	)
}

export const humanValueAndUnit = (possiblyNegativeValue) => {
	let v = Math.abs(possiblyNegativeValue),
		[raw, unit] = humanWeight(v),
		value = raw.toFixed(1) * (1)
	return { value, unit }
}

export const HumanWeight = ({ nodeValue }) => {
	const { value, unit } = humanValueAndUnit(nodeValue)
	return (
		<div>
			<strong
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				{value}&nbsp;{unit}
			</strong>{' '}
			<UnitSuffix />
		</div>
	)
}

export const UnitSuffix = () => (
	<span>
		de <strong>CO₂</strong>e / an
	</span>
)
