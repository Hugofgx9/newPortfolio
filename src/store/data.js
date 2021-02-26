import shoe3dImg from 'url:../img/3dShoe.png';
import louisePortfolioImg from 'url:../img/louisePortfolio.png';
import jeanGorinImg from 'url:../img/jeanGorin.png';
import glamoraImg from 'url:../img/glamora.png';
import hlmlImg from 'url:../img/hlml.png';
import makymaImg from 'url:../img/makyma.png';


const data = {
  projects: [
    {
      name: '3d Shoe',
      img: shoe3dImg,
      description: 'Interactive store concept, with Tom Soulie',
      year: '2021',
      link: 'https://3dshoe.netlify.app/',
      color: 0.05,
    },
    {
      name: 'Portfolio Louise',
      img: louisePortfolioImg,
      description: 'Portfolio for Louise Peredes Fantozzi, made with vue',
      year: '2020',
      link: 'https://www.louisefantozzi.com/',
      color: 0.45,
    },
    {
      name: 'The Square Project',
      img: jeanGorinImg,
      description: 'Interactive experience around the artist Jean Gaurin, school project',
      year: '2021',
      link: 'https://thesquareproject.netlify.app/',
      color: 0.6,
    },
    {
      name: 'Glamora',
      img: glamoraImg,
      description: 'Remake the front of a another website, to learn vue',
      year: '2020',
      link: 'https://glamoravue.hugofaugeroux.com/',
      color: 0.75,
    },
    {
      name: 'Makyma',
      img: makymaImg,
      description: 'Backend of a site offering ecological alternatives to everyday products and services, school project',
      year: '2020',
      link: 'https://www.makyma.org/',
      color: 0.8,
    },
    {
      name: 'Hard Love Motor Love',
      img: hlmlImg,
      description: 'Website of an Electronic Music Label',
      year: '2019',
      link: 'http://www.hardlovemotorlove.fr/',
      color: 1.0,
    },
  ],
};

export default data;
