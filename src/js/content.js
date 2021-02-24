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
    this.$h2 = document.querySelector('.project .title h2');
    this.$h2.textContent = data.projects[i].name;

    this.$year = document.querySelector('.project .title .year');
    this.$year.textContent = `//${data.projects[i].year}`;

    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    this.splitH2 = new splitText({
      target: '.project .title h2',
      split: 'chars',
      hide: 'chars',
    });

    this.splitYear = new splitText({
      target: '.project .title .year',
      split: 'lines', 
      hide: 'lines',
    })

    tl.to(this.splitH2.getChars(), 1, {
      x: 0,
      ease: 'power3.easeOut',
      // stagger: {
      // 	amount: 0.25,
      // },
    });

    tl.to(this.splitYear.getLines(), 0.8, {
      y: 0,
      opacity: 1,
      ease: 'power3.easeOut',
    }, '<');
  }

  close() {
    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    tl.to(this.splitH2.getChars(), 1, {
      x: '110%',
      ease: 'power3.easeOut',
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
      },
    });

    tl.to(this.splitYear.getLines(), 0.7, {
      y: '-110%',
      opacity: 0.2,
      ease: 'power3.easeOut',
      onComplete: () => {
        this.splitYear.getElement().innerHTML = '';
      },
    },'<');
  }

  closeOpen(i) {
    if (this.currentTl) this.currentTl.kill();

    let tl = gsap.timeline({
      onComplete: () => this.open(i),
    });
    this.currentTl = tl;

    //close
    tl.to(this.splitH2.getChars(), 1, {
      x: '110%',
      ease: 'power3.easeOut',
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
      },
    });

    tl.to(this.splitYear.getLines(), 0.7, {
      y: '-110%',
      opacity: 0.2,
      ease: 'power3.easeOut',
      onComplete: () => {
        this.splitYear.getElement().innerHTML = '';
      },
    }, '<');
  }
}
