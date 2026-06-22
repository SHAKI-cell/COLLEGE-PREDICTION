import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import CollegeDetailsClient from './CollegeDetailsClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { name: true, locationCity: true, locationState: true, placementAverage: true }
  });

  if (!college) {
    return {
      title: 'College Not Found | UniDiscover',
      description: 'The requested college page does not exist.'
    };
  }

  return {
    title: `${college.name} - Placements, Fees & Reviews | UniDiscover`,
    description: `Read placements statistics, course fees structure, admission requirements, and student reviews for ${college.name} in ${college.locationCity}, ${college.locationState}. Average package is ${college.placementAverage} LPA.`
  };
}

export default async function CollegeDetailPage({ params }: Props) {
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
    notFound();
  }

  // Check if college is saved by the current user
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

  // Format dates of reviews to string for client component compatibility
  const formattedReviews = college.reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    content: r.content,
    studentName: r.studentName,
    stream: r.stream,
    graduationYear: r.graduationYear,
    createdAt: r.createdAt.toISOString()
  }));

  const formattedCollegeObj = {
    id: college.id,
    name: college.name,
    slug: college.slug,
    description: college.description,
    logo: college.logo,
    banner: college.banner,
    locationCity: college.locationCity,
    locationState: college.locationState,
    rating: college.rating,
    feesMin: college.feesMin,
    feesMax: college.feesMax,
    placementAverage: college.placementAverage,
    placementHighest: college.placementHighest,
    type: college.type,
    facilities: typeof college.facilities === 'string' ? JSON.parse(college.facilities) : college.facilities,
    admissionInfo: college.admissionInfo,
    courses: college.courses,
    reviews: formattedReviews,
    isSaved
  };

  return <CollegeDetailsClient college={formattedCollegeObj} />;
}
