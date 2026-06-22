import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse params
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const city = searchParams.get('city') || '';
    const type = searchParams.get('type') || '';
    const ratingMin = parseFloat(searchParams.get('rating') || '0');
    const feesMax = parseFloat(searchParams.get('feesMax') || '0');
    const placementMin = parseFloat(searchParams.get('placementMin') || '0');
    const sort = searchParams.get('sort') || '';
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const skip = (page - 1) * limit;

    // Build filter query
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { locationCity: { contains: search } },
        { locationState: { contains: search } }
      ];
    }

    if (state) {
      where.locationState = state;
    }

    if (city) {
      where.locationCity = city;
    }

    if (type) {
      where.type = type;
    }

    if (ratingMin > 0) {
      where.rating = { gte: ratingMin };
    }

    if (feesMax > 0) {
      where.feesMin = { lte: feesMax };
    }

    if (placementMin > 0) {
      where.placementAverage = { gte: placementMin };
    }

    // Build sort options
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: 'desc' }; // default

    if (sort === 'highest-rated') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'lowest-fees') {
      orderBy = { feesMin: 'asc' };
    } else if (sort === 'highest-placement') {
      orderBy = { placementAverage: 'desc' };
    } else if (sort === 'alphabetical') {
      orderBy = { name: 'asc' };
    }

    // Query DB
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: { courses: true, reviews: true }
          }
        }
      }),
      prisma.college.count({ where })
    ]);

    // Fetch helper metadata for filters
    const [citiesData, statesData] = await Promise.all([
      prisma.college.groupBy({
        by: ['locationCity'],
        orderBy: { locationCity: 'asc' }
      }),
      prisma.college.groupBy({
        by: ['locationState'],
        orderBy: { locationState: 'asc' }
      })
    ]);

    const cities = citiesData.map(c => c.locationCity);
    const states = statesData.map(s => s.locationState);

    // Parse facilities from JSON string to array
    const parsedColleges = colleges.map(c => ({
      ...c,
      facilities: typeof c.facilities === 'string' ? JSON.parse(c.facilities) : c.facilities
    }));

    return NextResponse.json({
      colleges: parsedColleges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      cities,
      states
    });
  } catch (error) {
    console.error('Colleges GET API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ message: 'College name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    // Generate slug
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check if college already exists
    const existingCollege = await prisma.college.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { courses: true, reviews: true }
        }
      }
    });

    if (existingCollege) {
      return NextResponse.json({
        message: 'College already exists in database',
        college: {
          ...existingCollege,
          facilities: typeof existingCollege.facilities === 'string' ? JSON.parse(existingCollege.facilities) : existingCollege.facilities
        }
      });
    }

    // Determine location and details based on name
    let locationCity = 'Ghaziabad';
    let locationState = 'Uttar Pradesh';
    let type = 'Private';
    let rating = 4.1;
    let feesMin = 140000;
    let feesMax = 220000;
    let placementAverage = 5.8;
    let placementHighest = 45.0;
    let description = '';
    let facilities = ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'];
    let admissionInfo = 'Admission is based on entrance examination scores (JEE Main, CAT, or equivalent) followed by merit counseling.';

    const lowerName = trimmedName.toLowerCase();

    // 1. Check known colleges dictionary
    if (lowerName.includes('kiet')) {
      locationCity = 'Ghaziabad';
      locationState = 'Uttar Pradesh';
      rating = 4.2;
      feesMin = 153000;
      feesMax = 247000;
      placementAverage = 5.9;
      placementHighest = 60.0;
      type = 'Private';
      description = 'Founded in 1998, KIET Group of Institutions is a premier private engineering college in Ghaziabad, UP, known for its academic rigor, exceptional placements, and active technical clubs.';
      facilities = ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'AC Rooms'];
    } else if (lowerName.includes('galgotia')) {
      locationCity = 'Greater Noida';
      locationState = 'Uttar Pradesh';
      rating = 4.0;
      feesMin = 120000;
      feesMax = 210000;
      placementAverage = 5.2;
      placementHighest = 45.0;
      type = 'Private';
      description = 'Galgotias University is a leading private university in Greater Noida, UP, renowned for its state-of-the-art campus, diverse curriculum, and strong placements.';
    } else if (lowerName.includes('g.l. bajaj') || lowerName.includes('gl bajaj')) {
      locationCity = 'Greater Noida';
      locationState = 'Uttar Pradesh';
      rating = 4.1;
      feesMin = 140000;
      feesMax = 220000;
      placementAverage = 5.5;
      placementHighest = 58.0;
      type = 'Private';
      description = 'GL Bajaj is a top-ranked engineering institute in Greater Noida, UP, known for its consistent placement track record and focus on industry-relevant skills.';
    } else if (lowerName.includes('sharda')) {
      locationCity = 'Greater Noida';
      locationState = 'Uttar Pradesh';
      rating = 3.9;
      feesMin = 150000;
      feesMax = 350000;
      placementAverage = 4.8;
      placementHighest = 40.0;
      type = 'Private';
      description = 'Sharda University is a popular private university in Greater Noida, UP, featuring a global campus with international students and excellent research labs.';
      facilities = ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Hospital', 'AC Classrooms'];
    } else if (lowerName.includes('bennett')) {
      locationCity = 'Greater Noida';
      locationState = 'Uttar Pradesh';
      rating = 4.3;
      feesMin = 320000;
      feesMax = 450000;
      placementAverage = 7.5;
      placementHighest = 57.0;
      type = 'Private';
      description = 'Established by the Times of India Group, Bennett University in Greater Noida offers premium academic infrastructure, high placements, and global collaborations.';
      facilities = ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Swimming Pool', 'AC Rooms'];
    } else if (lowerName.includes('heritage')) {
      locationCity = 'Kolkata';
      locationState = 'West Bengal';
      rating = 4.2;
      feesMin = 110000;
      feesMax = 130000;
      placementAverage = 5.2;
      placementHighest = 40.0;
      type = 'Private';
      description = 'Heritage Institute of Technology is a leading private self-financed engineering college in Kolkata, West Bengal, famous for its strong placements and research projects.';
    } else if (lowerName.includes('jss')) {
      locationCity = 'Noida';
      locationState = 'Uttar Pradesh';
      rating = 4.0;
      feesMin = 125000;
      feesMax = 165000;
      placementAverage = 5.1;
      placementHighest = 42.0;
      type = 'Private';
      description = 'JSS Academy in Noida is a top engineering college managed by JSS Mahavidyapeetha, known for its prime location and stable placements in top IT services companies.';
    } else {
      // 2. Fallback parser based on name keywords
      if (lowerName.includes('delhi')) {
        locationCity = 'New Delhi';
        locationState = 'Delhi';
      } else if (lowerName.includes('mumbai') || lowerName.includes('bombay')) {
        locationCity = 'Mumbai';
        locationState = 'Maharashtra';
      } else if (lowerName.includes('pune')) {
        locationCity = 'Pune';
        locationState = 'Maharashtra';
      } else if (lowerName.includes('bangalore') || lowerName.includes('bengaluru')) {
        locationCity = 'Bengaluru';
        locationState = 'Karnataka';
      } else if (lowerName.includes('chennai') || lowerName.includes('madras')) {
        locationCity = 'Chennai';
        locationState = 'Tamil Nadu';
      } else if (lowerName.includes('hyderabad')) {
        locationCity = 'Hyderabad';
        locationState = 'Telangana';
      } else if (lowerName.includes('kolkata') || lowerName.includes('calcutta')) {
        locationCity = 'Kolkata';
        locationState = 'West Bengal';
      } else if (lowerName.includes('noida')) {
        locationCity = 'Noida';
        locationState = 'Uttar Pradesh';
      } else if (lowerName.includes('ghaziabad')) {
        locationCity = 'Ghaziabad';
        locationState = 'Uttar Pradesh';
      }

      if (lowerName.includes('iit') || lowerName.includes('indian institute of technology')) {
        type = 'IIT';
        rating = 4.8;
        feesMin = 210000;
        feesMax = 230000;
        placementAverage = 22.0;
        placementHighest = 140.0;
        facilities = ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium', 'Hospital', 'Swimming Pool'];
      } else if (lowerName.includes('nit') || lowerName.includes('national institute of technology')) {
        type = 'NIT';
        rating = 4.5;
        feesMin = 135000;
        feesMax = 150000;
        placementAverage = 13.5;
        placementHighest = 50.0;
      } else if (lowerName.includes('iiit') || lowerName.includes('information technology')) {
        type = 'Private';
        rating = 4.5;
        feesMin = 220000;
        feesMax = 350000;
        placementAverage = 16.0;
        placementHighest = 75.0;
      } else if (lowerName.includes('government') || lowerName.includes('state') || lowerName.includes('university of')) {
        type = 'Government';
        rating = 4.2;
        feesMin = 30000;
        feesMax = 80000;
        placementAverage = 8.5;
        placementHighest = 35.0;
      }

      description = `${trimmedName} is a recognized institution in ${locationCity}, ${locationState}, offering a comprehensive academic environment, student development facilities, and excellent career opportunities through its placement drives.`;
    }

    // Create the college in database
    const newCollege = await prisma.college.create({
      data: {
        name: trimmedName,
        slug,
        description,
        logo: '',
        banner: '',
        locationCity,
        locationState,
        rating,
        feesMin,
        feesMax,
        placementAverage,
        placementHighest,
        type,
        facilities: JSON.stringify(facilities),
        admissionInfo
      }
    });

    // Create 3 basic courses
    const scale = 1.0;
    const avgFees = (feesMin + feesMax) / 2;
    await prisma.course.createMany({
      data: [
        {
          name: 'B.Tech Computer Science and Engineering',
          duration: 4,
          feesAnnual: Math.round(avgFees * scale),
          eligibility: '10+2 with Physics, Chemistry, Math & entrance exam score',
          collegeId: newCollege.id
        },
        {
          name: 'B.Tech Electronics and Communication Engineering',
          duration: 4,
          feesAnnual: Math.round(avgFees * 0.9 * scale),
          eligibility: '10+2 with Physics, Chemistry, Math & entrance exam score',
          collegeId: newCollege.id
        },
        {
          name: 'MBA (Master of Business Administration)',
          duration: 2,
          feesAnnual: Math.round(avgFees * 1.1 * scale),
          eligibility: 'Graduation with min 50% & CAT/XAT/MAT score',
          collegeId: newCollege.id
        }
      ]
    });

    // Create 2 basic reviews
    await prisma.review.createMany({
      data: [
        {
          rating: Math.round(rating),
          title: 'Great college overall with good placements',
          content: `My journey at ${trimmedName} has been highly fulfilling. The campus infrastructure is modern, classrooms are comfortable, and the placement drives host excellent companies like Accenture, HCL, and Capgemini. Highly recommend this college!`,
          studentName: 'Aayush Goel',
          stream: 'Computer Science',
          graduationYear: 2024,
          collegeId: newCollege.id
        },
        {
          rating: Math.round(rating) - 1 > 1 ? Math.round(rating) - 1 : 3,
          title: 'Decent placements but academic pressure is high',
          content: 'The campus life is decent and there are active sports facilities. The curriculum is detailed, but the semester examinations are quite rigorous. The alumni network is very supportive, and average placements are decent.',
          studentName: 'Shreya Sharma',
          stream: 'Electronics & Communication',
          graduationYear: 2025,
          collegeId: newCollege.id
        }
      ]
    });

    // Fetch the updated college to include relation counts
    const finalCollege = await prisma.college.findUnique({
      where: { id: newCollege.id },
      include: {
        _count: {
          select: { courses: true, reviews: true }
        }
      }
    });

    if (!finalCollege) {
      throw new Error('Failed to retrieve created college');
    }

    return NextResponse.json({
      message: 'College added successfully',
      college: {
        ...finalCollege,
        facilities: facilities // Return parsed array directly
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Colleges POST API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
