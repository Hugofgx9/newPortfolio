import gsap from 'gsap';
import Scene from './scene.js';

new Scene;

// let angle = 12;

// let tl = gsap.timeline({
// 	delay: 1,
// 	onComplete: () => wavyInitPos(100),
// });

// tl.to('#container .item', 1, {
// 	width: '7vw',
// });
// tl.to('#container .item', .5, {
// 	skewX: `-${angle}deg`,
// }, '>-.5');
// tl.to('#container .item', 1, {
// 	marginLeft: '4vw',
// }, '<');

// let position = 0,
// speed = 0,
// time = 0,
// container = document.querySelector("#container");
// let items = [];

// window.addEventListener('wheel', (o) => {
// 	speed += o.deltaY * 0.04;
// });


// function wavyInitPos(amplitude) {
// 	for (let el of document.querySelectorAll('.item') ) {
// 		items.push({$el: el, x: el.getBoundingClientRect().x});
// 	}

// 	for (let index in items) {
// 		let value = Math.cos(index * (Math.PI/2) );
// 		value *= amplitude;
// 		gsap.to(items[index].$el, 0.5, {
// 			y: value,
// 			x: ( value / Math.tan( degToRad(90 + angle) ) ), //trigo
// 		})
// 	}
// 	raf();
// }

// function raf () {
// 	position += speed;
// 	speed *= 0.85;
// 	time += 1;

// 	wavyScrollPos(50, position);
// 	//flotting(time);

// 	window.requestAnimationFrame(raf);
// }

// function degToRad (degree) {
//  return degree * Math.PI / 180;
// }

// function wavyScrollPos(amplitude, scroll) {
// 	container.style.transform = `translate3d(${scroll * 0.6}px, 0, 0)`;

// 	let offset = scroll * 0.005;

// 	for (let index in items) {
// 		let value = Math.cos( (index) * (Math.PI/2) + offset ) * amplitude;
// 		gsap.set(items[index].$el, {
// 			y: value,
// 			x: ( (value / Math.tan( degToRad(90 + angle) )) ), //trigo
// 		})
// 	}
// }