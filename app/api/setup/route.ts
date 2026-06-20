import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(request: Request) {
  // In a real app, protect this route with a secret key!
  // For now, it just initializes the DB if tables don't exist.
  try {
    const success = await initDb();
    return NextResponse.json({ message: 'Database initialized successfully!' });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to initialize database.',
      details: error.message 
    }, { status: 500 });
  }
}
