import React, { MouseEvent, useEffect, useState } from 'react'

type ElementContentProps = {
	contents?: any
}

export function SliderElement (props: ElementContentProps): JSX.Element {
	return (
		<div className="slider-element">
			{ props.contents }
		</div>
	)
}

export function HorizontalSlider (props: ElementContentProps): JSX.Element {
	const [elements, setElements] = useState<any[]>([])
	if (elements.length === 0 && props.contents !== undefined) setElements(props.contents)

	useEffect(function (){
		offsetSlides(getSlides())
	}, [elements])

	function handleSlide (e: MouseEvent<HTMLButtonElement>): void {
		e.preventDefault()
		const slides = getSlides()
		console.log(e.target)
		if (slides.length > 0) {
			let elementWidth = (slides[0] as HTMLDivElement).offsetWidth + 1.94 + 16
			if ((e.target as HTMLButtonElement).classList.contains('slider-right')) {
				elementWidth = -elementWidth
			}
			slides.forEach(function(slide){
				const offset = Number((slide as HTMLDivElement).style.transform.replace('translateX(', '').replace('px)', ''));
				(slide as HTMLDivElement).style.transform = `translateX(-${ elementWidth - offset }px)`
			})
		}
	}
	
	function getSlides(): Element[] {
		return Array.from(document.getElementsByClassName('slider-element'))
	}
	
	function offsetSlides(slides: Element[]): void {
		if (slides.length > 0) {
			const elementWidth = (slides[0] as HTMLDivElement).offsetWidth * .94
			slides.forEach(function(slide){
				(slide as HTMLDivElement).style.transform = `translateX(-${ elementWidth }px)`
			})
		}
	}

	return (
		<section className='slider-container'>
			<div className="horizontal-stack inset-container">
				{
					!elements ? null : elements.map(function (el, i) {
						return (
							<SliderElement
								key={`slider-el-${i}`}
								contents={el}
							/>
						)
					})
				}
			</div>
			<button type='button' className="slider-btn slider-left" onClick={handleSlide}>{ '<' }</button>
			<button type='button' className="slider-btn slider-right" onClick={handleSlide}>{ '>' }</button>
		</section>
	)
}