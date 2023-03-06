import { collection, query, limit, orderBy, getDocs, getFirestore } from "firebase/firestore";


export const getPosts = async () => {
  const limitToFetch = 100;
  const db = getFirestore();
  const postsRef = collection(db, "posts");
 
  const q = query(postsRef, orderBy("createdAt", "desc"), limit(limitToFetch));

  const querySnapshot = await getDocs(q);
  
  const posts = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  
  const allowFetchMore = posts.length < limitToFetch ? false : true;

  console.log("posts", JSON.stringify(posts))

  return { posts, allowFetchMore };
};