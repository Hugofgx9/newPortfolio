import Emitter from './utils/emitter';
import gsap from 'gsap';

export default class Loader {
	constructor(sceneCtx) {
		this.emitter = new Emitter;
		this.sceneCtx = sceneCtx;
		
		this.$text = document.querySelector('.loader p'); 
		this.$loader = document.querySelector('.loader');
		this.counter = {value: 10};

		this.bindEvents();
	}

	emit(event, argument) {
		this.emitter.emit(event, argument);
	}

	bindEvents() {
		this.emitter.on('progress', (e) => this.onProgress(e) );
		this.emitter.on('loaded', () => this.onLoad() );
	}

	onProgress(value) {
		//actions
		gsap.to(this.counter, 4, {
			value: Math.ceil( (1 - value) * 10),
			snap: 'value',
			ease: 'power3.out',
			onUpdate: () => {
				this.$text.textContent = this.counter.value;
			},
			onComplete: () => {
				this.$text.textContent == 0 && this.close();
			}
		});
	}

	onLoad() {

		
	}
	
	close() {
		this.$loader.style.display = 'none';
		this.$loader.remove();
		this.sceneCtx.Planes.introAnim();
	}
}