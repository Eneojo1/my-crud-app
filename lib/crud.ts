import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export default function crudHandlers(model: keyof typeof prisma) {
  return {
    GET: async () => {
      try {
        const items = await (prisma[model] as any).findMany({
          orderBy: { name: "asc" }, // alphabetical order
        });
        return NextResponse.json(items);
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to fetch ${String(model)}` },
          { status: 500 },
        );
      }
    },

    POST: async (req: Request) => {
      try {
        const body = await req.json();

        // Validation
        if (!body.name || typeof body.name !== "string") {
          return NextResponse.json(
            { error: "Name is required" },
            { status: 400 },
          );
        }

        const item = await (prisma[model] as any).create({ data: body });
        return NextResponse.json(item, { status: 201 });
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to create ${String(model)}` },
          { status: 500 },
        );
      }
    },

    PUT: async (req: Request, { params }: any) => {
      try {
        const { id } = await params;
        const body = await req.json();

        const updated = await (prisma[model] as any).update({
          where: { id: Number(id) },
          data: body,
        });
        return NextResponse.json(updated);
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to update ${String(model)}` },
          { status: 500 },
        );
      }
    },

    DELETE: async (req: Request, { params }: any) => {
      try {
        const { id } = await params;

        const related = await prisma.users.count({
          where: { status_id: Number(id) },
        });

        if (related > 0) {
          return NextResponse.json(
            { error: "Cannot delete status assigned to users" },
            { status: 400 },
          );
        }

        await (prisma[model] as any).delete({
          where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("DELETE ERROR:", err);
        return NextResponse.json(
          { error: `Failed to delete ${String(model)}` },
          { status: 500 },
        );
      }
    },
  };
}
