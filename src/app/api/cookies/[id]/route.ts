import { NextResponse } from "next/server";
import { db } from "@/db";
import { cookies } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET handler to fetch a specific cookie entry by ID
export async function GET({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID provided",
        },
        { status: 400 }
      );
    }

    const data = await db
      .select()
      .from(cookies)
      .where(eq(cookies.id, id))
      .limit(1);

    if (data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cookie entry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error(`Error fetching cookie entry with ID ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cookie entry",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a specific cookie entry
export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid ID provided",
        },
        { status: 400 }
      );
    }

    const result = await db
      .delete(cookies)
      .where(eq(cookies.id, id))
      .returning({ id: cookies.id });

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cookie entry not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cookie entry deleted successfully",
      id: result[0].id,
    });
  } catch (error) {
    console.error(`Error deleting cookie entry with ID ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete cookie entry",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
