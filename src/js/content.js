import splitText from './utils/splitText';
import gsap from 'gsap';
import data from '../store/data.json';

export default class Content {
	constructor () {
		gsap.config({
			force3D: false,
		});

		this.projects = data.projects;

	}

	open(i) {
		this.$h2 = document.querySelector('.project h2');
		this.$h2.textContent = data.projects[i].name;

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

	closeOpen(i){

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
				this.open(i);
			}
		});

	}
}