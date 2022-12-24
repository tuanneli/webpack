import './index.html';
import './index.scss';
import {mult, sum} from "./modules/calc";
import tiger from './img/tiger.jpg';

const imgElem = document.querySelector('.img');
const img = new Image();
img.src = tiger;
img.width = 300;
imgElem.append(img);

console.log(mult(3, 3));
console.log(sum(3, 3));