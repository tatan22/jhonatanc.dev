import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import { getProfile, getProjects } from '@/lib/db';

// Check if user is authenticated
function isAuthenticated() {
  const session = cookies().get('admin_session');
  return session?.value === 'authenticated';
}

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profile = await getProfile();
    const projects = await getProjects();
    return NextResponse.json({ profile, projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const data = await request.json();

  try {
    if (type === 'profile') {
      const { name, role, bio, image_url, location } = data;
      // We only have 1 profile (id = 1, or just update the first one)
      await sql`
        UPDATE profiles 
        SET name = ${name}, role = ${role}, bio = ${bio}, image_url = ${image_url}, location = ${location}
        WHERE id = (SELECT id FROM profiles ORDER BY id LIMIT 1)
      `;
      return NextResponse.json({ success: true });
    } 
    else if (type === 'project') {
      const { id, title, description, image_url, tech_stack, live_url, github_url, featured, order_index } = data;
      await sql`
        UPDATE projects 
        SET title = ${title}, description = ${description}, image_url = ${image_url}, 
            tech_stack = ${`{${tech_stack.join(',')}}`}, live_url = ${live_url}, github_url = ${github_url}, 
            featured = ${featured}, order_index = ${order_index}
        WHERE id = ${id}
      `;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const data = await request.json();

  try {
    if (type === 'project') {
      const { title, description, image_url, tech_stack, live_url, github_url, featured, order_index } = data;
      await sql`
        INSERT INTO projects (title, description, image_url, tech_stack, live_url, github_url, featured, order_index)
        VALUES (${title}, ${description}, ${image_url}, ${`{${tech_stack.join(',')}}`}, ${live_url}, ${github_url}, ${featured}, ${order_index})
      `;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  try {
    if (type === 'project' && id) {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid type or missing id' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
