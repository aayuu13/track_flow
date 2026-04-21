import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ========== PRODUCTS ==========
export const addProduct = async (userId, productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (userId) => {
  try {
    const q = query(collection(db, 'products'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const subscribeToProducts = (userId, callback) => {
  const q = query(collection(db, 'products'), where('userId', '==', userId));
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(products);
  });
};

export const updateProduct = async (productId, updates) => {
  try {
    await updateDoc(doc(db, 'products', productId), updates);
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    throw error;
  }
};

// ========== TRANSACTIONS ==========
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getTransactions = async (userId) => {
  try {
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const subscribeToTransactions = (userId, callback) => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId));
  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(transactions);
  });
};

export const updateTransaction = async (transactionId, updates) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), updates);
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
  } catch (error) {
    throw error;
  }
};

// ========== SETTINGS ==========
export const updateUserSettings = async (userId, settings) => {
  try {
    await updateDoc(doc(db, 'users', userId), settings);
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw error;
  }
};
