import Post from '@models/Post';
import * as $ from 'jquery';
import "./index.scss";
// import tiger from './img/tiger.jpg';

const post = new Post('Webpack post title');

$('pre').html(post.toString());

console.log('Post to string', post.toString());