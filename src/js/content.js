import splitText from './utils/splitText';
import gsap from 'gsap';
import data from '../store/data';

export default class Content {
  constructor() {
    gsap.config({
      force3D: false,
    });

    this.projects = data.projects;
    this.currentTl = null;
  }

  open(i) {
    this.$h2 = document.querySelector('.project h2');
    this.$h2.textContent = data.projects[i].name;

    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    this.splitH2 = new splitText({
      target: '.project h2',
      split: 'chars',
      hide: 'chars',
    });

    tl.to(this.splitH2.getChars(), 1, {
      x: 0,
      ease: 'power3.easeOut',
      // stagger: {
      // 	amount: 0.25,
      // },
    });
  }

  close() {
    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    tl.to(this.splitH2.getChars(), 1, {
      x: '110%',
      ease: 'power3.easeOut',
      // stagger: {
      // 	amount: 0.25,
      // },
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
      },
    });
  }

  closeOpen(i) {
    if (this.currentTl) this.currentTl.kill();

    let tl = gsap.timeline();
    this.currentTl = tl;

    //close
    tl.to(this.splitH2.getChars(), 1, {
      x: '110%',
      ease: 'power3.easeOut',
      // stagger: {
      // 	amount: 0.25,
      // },
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
        this.open(i);
      },
    });
  }
}
