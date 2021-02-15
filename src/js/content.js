import splitText from './utils/splitText';
import gsap from 'gsap';

export default class Content {
	constructor () {
		gsap.config({
			force3D: false,
		});

	}

	open() {
		this.$h2 = document.querySelector('.project h2');
		this.$h2.textContent = 'The Square Project';

		this.splitH2 = new splitText({
			target: '.project h2',
			split: 'chars',
			hide: 'chars',
		});


		gsap.to(this.splitH2.getChars(), 1, {
			x: 0,
			ease: "power3.easeOut",
			// stagger: {
			// 	amount: 0.25,
			// },
		});

	}

	close() {
		gsap.to(this.splitH2.getChars(), 1, {
			x: '110%',
			ease: "power3.easeOut",
			// stagger: {
			// 	amount: 0.25,
			// },
			onComplete: () => {
				this.splitH2.getElement().innerHTML = '';
				this.$h2 = document.querySelector('.project h2');
			}
		});
	}

	closeOpen(){

		//close
		gsap.to(this.splitH2.getChars(), 1, {
			x: '110%',
			ease: "power3.easeOut",
			// stagger: {
			// 	amount: 0.25,
			// },
			onComplete: () => {
				this.splitH2.getElement().innerHTML = '';
				this.$h2 = document.querySelector('.project h2');
				this.open();
			}
		});

	}
}