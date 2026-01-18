import { NextResponse } from 'next/server';

export async function GET() {
    const healthCheck = {
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        services: {
            firebase: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
        },
    };

    return NextResponse.json(healthCheck, { status: 200 });
}
