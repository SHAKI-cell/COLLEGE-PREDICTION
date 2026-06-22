import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  stream: z.string().min(2, 'Stream must be at least 2 characters'),
  graduationYear: z.number().min(1980).max(2030)
});

// GET: Fetch single college profile
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { name: 'asc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    // Check if the college is saved by the current user
    let isSaved = false;
    if (session?.user) {
      const saved = await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: (session.user as any).id,
            collegeId: college.id
          }
        }
      });
      isSaved = !!saved;
    }

    return NextResponse.json({
      ...college,
      facilities: (() => {
        try {
          return typeof college.facilities === 'string' ? JSON.parse(college.facilities) : college.facilities;
        } catch (e) {
          return [];
        }
      })(),
      isSaved
    });
  } catch (error) {
    console.error('College GET details API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Add student review for a college
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true, rating: true, reviews: { select: { rating: true } } }
    });

    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ message: errorMsg }, { status: 400 });
    }

    const { rating, title, content, studentName, stream, graduationYear } = parsed.data;

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        content,
        studentName,
        stream,
        graduationYear,
        collegeId: college.id,
        userId: (session.user as any).id
      }
    });

    // Recalculate college rating average
    const allReviews = await prisma.review.findMany({
      where: { collegeId: college.id },
      select: { rating: true }
    });
    
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    // Round to 1 decimal place
    const updatedRating = Math.round(avgRating * 10) / 10;

    await prisma.college.update({
      where: { id: college.id },
      data: { rating: updatedRating }
    });

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 });
  } catch (error) {
    console.error('Review POST API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
