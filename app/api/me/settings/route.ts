import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { currentPassword, newPassword, name, email } = body;

    await connectDB();
    const user = await User.findById(auth.userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: "Current password is required to set a new one" }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 401 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();

    await User.findByIdAndUpdate(auth.userId, updateData);

    return NextResponse.json({ success: true, message: "Account settings updated successfully" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ success: false, message: "Password is required to delete account" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(auth.userId);
    
    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }

    // Handled in a separate logic if needed, but for now simple delete
    await User.findByIdAndDelete(auth.userId);
    
    const response = NextResponse.json({ success: true, message: "Account deleted" });
    response.cookies.delete("token"); // Clear session
    
    return response;
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
