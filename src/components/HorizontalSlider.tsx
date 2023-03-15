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
	}, [])

	function handleSlide (e: MouseEvent<HTMLButtonElement>): void {
		e.preventDefault()
		const newElementList = []
		const slides = getSlides()
		if (slides.length > 0) {
			let slideDistance = (slides[0] as HTMLDivElement).offsetWidth + 16
			if ((e.target as HTMLButtonElement).classList.contains('slider-left')) {
				slideDistance *= -1
				newElementList.push(...slides.slice(1), slides[0])
				// const [firstSlide, ...otherSlides] = slides
				console.log(newElementList)
			}
			slides.forEach(function(slide){
				const currentOffset = Number((slide as HTMLDivElement).style.transform.replace('translateX(', '').replace('px)', ''));
				(slide as HTMLDivElement).style.transform = `translateX(${(currentOffset + slideDistance).toFixed(1)}px)`
			})
			const finalElementList: any[] = []
			newElementList.forEach(function(item){
				finalElementList.push(<SliderElement
					contents={ item.textContent }
				/>)
			})
			setElements(Array.from(finalElementList))
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