import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import path from "path";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      include: {
        country: true,
        state: true,
        lga: true,
        role: true,
        status: true,
      },

      orderBy: {
        fname: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const avatar = form.get("avatar") as File | null;

    let avatarUrl: string | null = null;

    // ==========================
    // Upload avatar to folder
    // ==========================

    if (avatar && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${avatar.name.replace(/\s+/g, "-")}`;

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatars",
      );

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);

      avatarUrl = `/uploads/avatars/${filename}`;
    }

    // ==========================
    // Hash password
    // ==========================

    const password = form.get("password") as string;

    const hashedPassword = await bcrypt.hash(password, 10);

    const socials = JSON.parse((form.get("socials") as string) || "[]");

    // ==========================
    // Create USER first
    // ==========================

    const user = await prisma.users.create({
      data: {
        fname: form.get("fname") as string,
        oname: form.get("oname") as string,
        lname: form.get("lname") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        sex: form.get("sex") as any,
        password: hashedPassword,
        address: form.get("address") as string,
        country_id: Number(form.get("country_id")),
        state_id: Number(form.get("state_id")),
        lga_id: Number(form.get("lga_id")),
        role_id: Number(form.get("role_id")),
        status_id: Number(form.get("status_id")),
        socials,
      },
    });

    // ==========================
    // Save avatar in Media table
    // AFTER user exists
    // ==========================

    if (avatarUrl) {
      await prisma.media.create({
        data: {
          url: avatarUrl,
          type: "avatar",
          entity_type: "user",
          entity_id: user.id,
          is_thumbnail: false,
        },
      });
    }
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
