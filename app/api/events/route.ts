import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        const event = Object.fromEntries(formData.entries());
        const file = formData.get('image') as File
        if (!file) return NextResponse.json({ message: 'No image is Provided' }, { status: 400 })

        let tags;
        try {
            tags = JSON.parse(formData.get('tags') as string);
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON in tags' }, { status: 400 });
        }

        let agenda;
        try {
            agenda = JSON.parse(formData.get('agenda') as string);
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON in agenda' }, { status: 400 });
        }



        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }).end(buffer);
        })
        event.image = (uploadResult as { secure_url: string }).secure_url

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda
        })
        return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 })
    } catch (error: any) {
        console.error('Event creation error:', error)

        // Handle duplicate slug error from pre-save hook
        if (error.message && error.message.includes('slug already exists')) {
            return NextResponse.json(
                { message: 'An event with this title already exists. Please use a different title.' },
                { status: 409 }
            )
        }

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e: any) => e.message)
            return NextResponse.json(
                { message: 'Validation failed', errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Event creation failed' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        await connectDB()
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Event Fetched Successfully', events }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Event Fetching Failed", error: error }, { status: 500 })
    }
}