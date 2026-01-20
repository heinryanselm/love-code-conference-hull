import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.status || (body.status !== "single" && body.status !== "married")) {
      return NextResponse.json(
        { error: "Invalid relationship status" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Create the survey response document
    const surveyResponse = {
      ...body,
      submittedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Insert into the surveys collection
    const result = await db.collection("surveys").insertOne(surveyResponse);

    return NextResponse.json(
      {
        success: true,
        message: "Survey submitted successfully",
        id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving survey:", error);
    return NextResponse.json(
      { error: "Failed to save survey response" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Get survey statistics
    const totalResponses = await db.collection("surveys").countDocuments();
    const singleResponses = await db.collection("surveys").countDocuments({ status: "single" });
    const marriedResponses = await db.collection("surveys").countDocuments({ status: "married" });

    return NextResponse.json({
      total: totalResponses,
      single: singleResponses,
      married: marriedResponses,
    });
  } catch (error) {
    console.error("Error fetching survey stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey statistics" },
      { status: 500 }
    );
  }
}
