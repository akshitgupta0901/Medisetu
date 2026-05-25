import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    console.log("AUTH PAYLOAD:", auth);

    if (auth.role !== "admin") {
      return forbiddenResponse();
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    let query: any = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    console.log("AUTH PAYLOAD:", auth);

    if (auth.role !== "admin") {
      return forbiddenResponse();
    }

    await connectDB();

    const { name, email, password, role } = await req.json();

    if (!["admin", "doctor", "patient"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    const bcrypt = (await import("bcryptjs")).default;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin user creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}