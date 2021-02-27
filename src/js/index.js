import Scene from './scene';
import mobileWarn from 'src/html/mobile';

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
  document.body.innerHTML = mobileWarn;
}else{
  console.log('hey men ;)');
  // false for not mobile device
  new Scene;
}