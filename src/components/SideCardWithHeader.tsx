// import React from 'react'

type ComponentCardProps = {
	title: string
	body: string | JSX.Element
}
export function SideCardWithHeader (props: ComponentCardProps): JSX.Element {
	const { body, title } = props
	return (
		<section className='side-card'>
			<h3 className='card-header'>{ title }</h3>
			<div className='card-body'>
				{ body }
			</div>
		</section>
	)
}