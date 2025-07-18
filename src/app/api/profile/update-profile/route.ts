import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile } from "../../../../../data/users"; // adjust path as needed

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bio, gender, photoURL, nickname } = body;

    if (!userId) {
      return NextResponse.json(
        { error: true, message: "userId is required" },
        { status: 400 }
      );
    }

    // Prepare data to update: only include provided fields
    const updateData: Record<string, any> = {};
    if (bio !== undefined) updateData.bio = bio;
    if (gender !== undefined) updateData.gender = gender;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (nickname !== undefined) updateData.nickname = nickname;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: true, message: "No data provided to update" },
        { status: 400 }
      );
    }

    await updateUserProfile(userId, updateData);

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("[API Error PATCH /api/profile]", error);
    return NextResponse.json(
      { error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}