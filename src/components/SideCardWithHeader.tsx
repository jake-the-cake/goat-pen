// import React from 'react'

type ComponentCardProps = {
	title: string
	body: string | JSX.Element
	badge?: JSX.Element[] | JSX.Element
}
export function SideCardWithHeader (props: ComponentCardProps): JSX.Element {
	const { body, title, badge } = props
	return (
		<section className='side-card'>
			<div className='card-header'>
				<h3 className='card-title'>{ title }</h3>
			</div>
			<div className='card-body'>
				{ body }
			</div>
			{ !badge ? null : (
				<div className="card-badge">{ badge }</div>
			)}
		</section>
	)
}