import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

// Define the params type for the route (async in Next.js 15+)
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params (required in Next.js 15+)
    const { slug } = await params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Valid slug parameter is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.toLowerCase().trim() }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      {
        success: true,
        event: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Error fetching event by slug:', error);

    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Handle Mongoose cast errors (invalid ObjectId format)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while fetching the event',
      },
      { status: 500 }
    );
  }
}
