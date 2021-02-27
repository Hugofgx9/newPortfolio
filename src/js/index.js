import Scene from './scene';
import mobileWarn from 'src/html/mobile';

console.log(mobileWarn);


if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
  document.body.innerHTML = mobileWarn;
  console.log('please chrome');
}else{
  // false for not mobile device
  new Scene;
}