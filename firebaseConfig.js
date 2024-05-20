// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpbuF6ShhZ7p-0sd4VTEKroUHg2WJbUJM",
  authDomain: "mytodoapp-701fb.firebaseapp.com",
  projectId: "mytodoapp-701fb",
  storageBucket: "mytodoapp-701fb.appspot.com",
  messagingSenderId: "549043617536",
  appId: "1:549043617536:web:c415b2c6cdef1baa947de5"};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };



