import "server-only";
import { firestore, auth } from "../firebase/server";
import { registerUserSchema } from "../validation/registerUser";

export const getCurrentUsers = async (uid: string) => {
  if (!uid) {
    return {
      error: true,
      message: "user id not found",
    };
  }
  const userRef = firestore.collection("users").doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    return { data: null };
  }

  const userData = snap.data();

  return { data: JSON.parse(JSON.stringify(userData)) };
};

export const registerUser = async (data: {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}) => {
  const validation = registerUserSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  try {
    await auth.createUser({
      displayName: data.name,
      email: data.email,
      password: data.password,
    });
  } catch (e: any) {
    return {
      error: true,
      message: e.message ?? "Could not register user",
    };
  }
};

/**
 * Update a user's profile in Firestore (bio, gender, photoURL, nickname).
 */
export const updateUserProfile = async (
  userId: string,
  data: { bio?: string; gender?: string; photoURL?: string; nickname?: string }
) => {
  if (!userId)
    return {
      error: true,
      message: "user id not found",
    };
  const userRef = firestore.collection("users").doc(userId);
  await userRef.update(data);
};
