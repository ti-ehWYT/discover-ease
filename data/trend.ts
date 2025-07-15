"use server";

import { firestore as adminFirestore } from "firebase-admin";
import { firestore } from "../firebase/server";

export const incrementCountrySearch = async (country: string) => {
  const docRef = firestore.collection("searchRanking").doc(country);

  await firestore.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);

    if (!doc.exists) {
      transaction.set(docRef, {
        country,
        count: 1,
        updatedAt: new Date(),
      });
    } else {
      transaction.update(docRef, {
        count: adminFirestore.FieldValue.increment(1),
        updatedAt: new Date(),
      });
    }
  });

  return { success: true };
};

export const getSearchRanking = async () => {
  const snap = await firestore
    .collection("searchRanking")
    .orderBy("count", "desc")
    .limit(10)
    .get();

const data = snap.docs.map((doc) => {
    const docData = doc.data();
    return {
      country: doc.id,
      count: typeof docData.count === "number" ? docData.count : 0, // enforce type
    };
  });

  return data;
};