import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // apiKey: 'SUA_API_KEY',
  // authDomain: 'SEU_AUTH_DOMAIN',
  // projectId: 'SEU_PROJECT_ID',
  // databaseURL: 'SUA_DATABASE_URL'
  // storageBucket: 'SEU_STORAGE_BUCKET',
  // messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  // appId: 'SEU_APP_ID',

  apiKey: "AIzaSyDgt92xf3s19QPz3sSEvlui-Lr_sC5UVYU",
  authDomain: "fiap-aulas-14d7a.firebaseapp.com",
  databaseURL: "https://fiap-aulas-14d7a-default-rtdb.firebaseio.com",
  projectId: "fiap-aulas-14d7a",
  storageBucket: "fiap-aulas-14d7a.firebasestorage.app",
  messagingSenderId: "347948116101",
  appId: "1:347948116101:web:1b7185926185dcdadca1ec"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
