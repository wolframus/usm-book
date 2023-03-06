import { initializeApp } from 'firebase/app';

import * as Posts from './posts'

const firebaseConfig = {
 apiKey: 'AIzaSyCUglLX5TNe-lVpiNHqP-WXrZUKv4HGwC8',
 authDomain: 'univer-usm.firebaseapp.com',
 projectId: 'univer-usm',
 storageBucket: 'univer-usm.appspot.com',
 messagingSenderId: '506185727266',
 appId: '1:506185727266:web:7e2ee01b6c49114249f97b',
 measurementId: 'G-E6F71Q0QP3',
};

initializeApp(firebaseConfig);

export default {Posts}