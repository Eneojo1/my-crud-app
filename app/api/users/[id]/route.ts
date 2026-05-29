import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params;

    const user = await prisma.users.findUnique({
      where: { id: Number(id) },

      include: {
        country: true,
        state: true,
        lga: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const avatar = await prisma.media.findFirst({
      where: {
        entity_type: "user",
        entity_id: user.id,
        type: "avatar",
      },

      select: {
        id: true,
        url: true,
        type: true,
      },
    });

    return NextResponse.json({ ...user, avatar: avatar || null });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const form = await req.formData();

    const id = Number(form.get("id"));

    const avatar = form.get("avatar") as File | null;

    let avatarUrl: string | null = null;

    // ==========================
    // Upload new avatar
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
    // Update user
    // ==========================

    const user = await prisma.users.update({
      where: {
        id,
      },

      data: {
        fname: form.get("fname") as string,
        oname: form.get("oname") as string,
        lname: form.get("lname") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        sex: form.get("sex") as any,
        address: form.get("address") as string,
        country_id: Number(form.get("country_id")),
        state_id: Number(form.get("state_id")),
        lga_id: Number(form.get("lga_id")),
        role_id: Number(form.get("role_id")),
        status_id: Number(form.get("status_id")),
      },
    });

    // ==========================
    // Update avatar in media
    // ==========================

    if (avatarUrl) {
      const existingAvatar = await prisma.media.findFirst({
        where: {
          entity_type: "user",
          entity_id: user.id,
          type: "avatar",
        },
      });

      if (existingAvatar) {
        await prisma.media.update({
          where: {
            id: existingAvatar.id,
          },

          data: {
            url: avatarUrl,
          },
        });
      } else {
        await prisma.media.create({
          data: {
            url: avatarUrl,
            type: "avatar",
            entity_type: "user",
            entity_id: user.id,
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // ==========================
    // Find avatar
    // ==========================

    const avatar = await prisma.media.findFirst({
      where: {
        entity_type: "user",
        entity_id: Number(id),
        type: "avatar",
      },
    });

    // ==========================
    // Delete avatar file
    // ==========================

    if (avatar?.url) {
      const filepath = path.join(process.cwd(), "public", avatar.url);

      try {
        await fs.unlink(filepath);
      } catch (err) {
        console.log("Avatar file not found");
      }
    }

    // ==========================
    // Delete media records
    // ==========================

    await prisma.media.deleteMany({
      where: {
        entity_type: "user",
        entity_id: Number(id),
      },
    });

    // ==========================
    // Delete user
    // ==========================

    await prisma.users.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
