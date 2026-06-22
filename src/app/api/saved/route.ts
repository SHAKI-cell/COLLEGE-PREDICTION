import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Fetch all saved colleges for the user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            _count: {
              select: { courses: true, reviews: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(savedColleges.map(sc => ({
      ...sc.college,
      facilities: typeof sc.college.facilities === 'string' ? JSON.parse(sc.college.facilities) : sc.college.facilities
    })));
  } catch (error) {
    console.error('Saved colleges GET error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Toggle save/unsave college
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { collegeId } = await req.json();

    if (!collegeId) {
      return NextResponse.json({ message: 'collegeId is required' }, { status: 400 });
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId }
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    // Check if already saved
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId
        }
      }
    });

    if (existingSave) {
      // Unsave
      await prisma.savedCollege.delete({
        where: {
          id: existingSave.id
        }
      });
      return NextResponse.json({ message: 'College removed from saved list', saved: false });
    } else {
      // Save
      await prisma.savedCollege.create({
        data: {
          userId,
          collegeId
        }
      });
      return NextResponse.json({ message: 'College saved successfully', saved: true });
    }
  } catch (error) {
    console.error('Saved colleges POST error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
