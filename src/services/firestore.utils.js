import { db } from '../config/firebase'; // Use only 'db'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const subscribeToCollection = (collectionName, callback) => {
  // Use the 'db' instance to create your query
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  
  // onSnapshot returns the "unsubscribe" function to prevent memory leaks
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });

  return unsubscribe; // Return the function so the component can stop listening when it unmounts
};