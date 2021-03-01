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

    this.linksArrow();
  }

  open(i) {
    this.$h2 = document.querySelector('.content .title h2');
    this.$h2.textContent = data.projects[i].name;

    this.$year = document.querySelector('.content .title .year');
    this.$year.textContent = `//${data.projects[i].year}`;

    this.$description = document.querySelector('.content .description');
    this.$description.textContent = `${data.projects[i].description}`;

    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    this.splitH2 = new splitText({
      target: '.content .title h2',
      split: 'chars',
      hide: 'chars',
    });

    this.splitYear = new splitText({
      target: '.content .title .year',
      split: 'lines', 
      hide: 'lines',
    })

    tl.to(this.splitH2.getChars(), 1, {
      x: 0,
      ease: 'power3.out',
      // stagger: {
      // 	amount: 0.25,
      // },
    });

    tl.to(this.splitYear.getLines(), 0.8, {
      y: 0,
      opacity: 1,
      ease: 'power3.out',
    }, '<');

    tl.set(this.$description, {
      y: '5vh',
    }, '<');

    tl.to(this.$description, 0.8, {
      y: 0,
      opacity: 1,
      ease: 'power3.out',
      //color: `hsl(${data.projects[i].color * 360}, 100%, 50%)`,
    }, '<');

  }

  close() {
    if (this.currentTl) this.currentTl.kill();
    let tl = gsap.timeline();
    this.currentTl = tl;

    tl.to(this.splitH2.getChars(), 1, {
      x: '110%',
      ease: 'power3.out',
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
      },
    });

    tl.to(this.splitYear.getLines(), 0.7, {
      y: '-110%',
      opacity: 0.2,
      ease: 'power3.out',
      onComplete: () => {
        this.splitYear.getElement().innerHTML = '';
      },
    },'<');

    tl.to(this.$description, 0.6, {
      y: '-5vh',
      opacity: 0,
      ease: 'power3.inOut',
      onComplete: () => {
        this.$description.textContent = '';
      },
    }, '<');


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
      ease: 'power3.out',
      onComplete: () => {
        this.splitH2.getElement().innerHTML = '';
      },
    });

    tl.to(this.splitYear.getLines(), 0.7, {
      y: '-110%',
      opacity: 0.2,
      ease: 'power3.out',
      onComplete: () => {
        this.splitYear.getElement().innerHTML = '';
      },
    }, '<');

    tl.to(this.$description, 0.7, {
      y: '-5vh',
      opacity: 0,
      ease: 'power3.inOut',
      onComplete: () => {
        this.$description.innerHTML = '';
      },
    }, '<');
  }

  linksArrow(){
    //document.querySelector('.links').addEventListener('mousemove', (e) => console.log(e.clientY));
    let $svg = document.querySelector('.links svg');
    let $li = document.querySelectorAll('.links li a');
    let currentPos = 0;


    let height = $li[0].clientHeight;

    window.addEventListener('resize', () => {
      height = $li[0].clientHeight;
      gsap.set($svg ,{
          y: currentPos * height,  
        });
    });


    $li.forEach( (el, index) => {
      el.addEventListener('mouseover', () => {
        gsap.to($svg, 0.2, {
          y: index * height,  
          delay: 0.2,
          ease: 'power1.out',
          onComplete: () => {
            currentPos = index;
          }
        });
      });
    })
  }

  introAnim() {
    let tl = gsap.timeline();

    tl.to('.content .links', {
      opacity: 1,
      ease: 'power2.inOut',
      duration: 1,
    });

    tl.to('.content h1', {
      opacity: 1,
      ease: 'power2.inOut',
      duration: 1,
    },'<');

    tl.to('.content .intership', {
      opacity: 1,
      ease: 'power2.inOut',
      duration: 1,
    }, '<');
  }
}
