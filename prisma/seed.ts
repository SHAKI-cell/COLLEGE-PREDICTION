import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding database...');

  // Clean the database
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const student = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      password: hashedPassword,
      role: 'student',
      image: 'https://picsum.photos/seed/rohan/150/150'
    }
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@collegefinder.com',
      password: hashedPassword,
      role: 'admin',
      image: 'https://picsum.photos/seed/admin/150/150'
    }
  });

  console.log('Users created.');

  // College Data template helper
  const rawColleges = [
    // IITs
    {
      name: 'Indian Institute of Technology Bombay',
      slug: 'iit-bombay',
      description: 'Established in 1958, IIT Bombay is one of the premier engineering and research institutions globally, known for its outstanding academic programs, world-class faculty, and vibrant campus life in Powai, Mumbai.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Mumbai',
      locationState: 'Maharashtra',
      rating: 4.9,
      feesMin: 210000,
      feesMax: 230000,
      placementAverage: 24.5,
      placementHighest: 168.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium', 'Hospital'],
      admissionInfo: 'Admission is based on JEE Advanced rank for B.Tech programs. Candidates must clear JEE Main first to qualify for JEE Advanced. M.Tech admissions are via GATE score.'
    },
    {
      name: 'Indian Institute of Technology Delhi',
      slug: 'iit-delhi',
      description: 'IIT Delhi is a leading public technical university located in Hauz Khas, New Delhi. It is recognized as an Institute of Eminence by the Government of India, excelling in scientific research and engineering education.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.8,
      feesMin: 220000,
      feesMax: 240000,
      placementAverage: 23.8,
      placementHighest: 150.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium', 'Incubation Centre'],
      admissionInfo: 'Admissions are conducted through Joint Entrance Examination (JEE) Advanced for B.Tech. JAM for M.Sc, and GATE for M.Tech.'
    },
    {
      name: 'Indian Institute of Technology Madras',
      slug: 'iit-madras',
      description: 'Ranked No. 1 in NIRF consistently, IIT Madras is located in Chennai, Tamil Nadu. The campus spans over 250 hectares of lush green forest, home to a wide range of academic departments and the renowned IITM Research Park.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Chennai',
      locationState: 'Tamil Nadu',
      rating: 4.9,
      feesMin: 205000,
      feesMax: 225000,
      placementAverage: 22.5,
      placementHighest: 131.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Swimming Pool', 'Auditorium'],
      admissionInfo: 'Admissions to undergraduate courses are based on ranks in JEE Advanced. Masters programs require GATE or CAT scores.'
    },
    {
      name: 'Indian Institute of Technology Kharagpur',
      slug: 'iit-kharagpur',
      description: 'The oldest of the IITs, founded in 1951, IIT Kharagpur is known for its sprawling 2100-acre campus, extensive library, and diverse student curriculum featuring engineering, law, management, and medicine research.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'Kharagpur',
      locationState: 'West Bengal',
      rating: 4.7,
      feesMin: 215000,
      feesMax: 235000,
      placementAverage: 20.8,
      placementHighest: 120.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium', 'Museum'],
      admissionInfo: 'Selection is through JEE Advanced for undergraduate degrees and GATE/NET for postgraduate and doctoral programs.'
    },
    {
      name: 'Indian Institute of Technology Roorkee',
      slug: 'iit-roorkee',
      description: 'Formerly the Thomason College of Civil Engineering (established in 1847), IIT Roorkee is the oldest technical institution in Asia, excelling in civil, mechanical, and water resource engineering.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'Roorkee',
      locationState: 'Uttarakhand',
      rating: 4.7,
      feesMin: 220000,
      feesMax: 240000,
      placementAverage: 19.5,
      placementHighest: 112.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Heritage Buildings'],
      admissionInfo: 'JEE Advanced rank card is mandatory for B.Tech admission. PG admissions are accepted through GATE, JAM, or CEED.'
    },
    {
      name: 'Indian Institute of Technology Kanpur',
      slug: 'iit-kanpur',
      description: 'IIT Kanpur is well-known for its rich research infrastructure, computer science labs, and its own airstrip. It has played a pioneering role in computer education in India since its inception in 1959.',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'Kanpur',
      locationState: 'Uttar Pradesh',
      rating: 4.8,
      feesMin: 215000,
      feesMax: 230000,
      placementAverage: 22.0,
      placementHighest: 140.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Airstrip', 'Labs', 'Auditorium'],
      admissionInfo: 'JEE Advanced qualifications determine B.Tech intakes. GATE is used for M.Tech admissions.'
    },
    {
      name: 'Indian Institute of Technology Guwahati',
      slug: 'iit-guwahati',
      description: 'Situated on the banks of the Brahmaputra river, IIT Guwahati boasts one of the most picturesque campuses in India, featuring advanced research facilities in biotechnology, nanotechnology, and design.',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'Guwahati',
      locationState: 'Assam',
      rating: 4.6,
      feesMin: 210000,
      feesMax: 225000,
      placementAverage: 18.2,
      placementHighest: 95.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Scenic Lakes'],
      admissionInfo: 'Admissions are via JoSAA counseling based on JEE Advanced ranks for undergraduate engineering.'
    },
    {
      name: 'Indian Institute of Technology Hyderabad',
      slug: 'iit-hyderabad',
      description: 'One of the newer IITs (founded in 2008), IIT Hyderabad has quickly risen in prominence due to its collaboration with Japanese universities, innovative curriculum, and research in smart cities and 5G.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'Hyderabad',
      locationState: 'Telangana',
      rating: 4.7,
      feesMin: 200000,
      feesMax: 220000,
      placementAverage: 20.1,
      placementHighest: 110.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Design Studios'],
      admissionInfo: 'Requires JEE Advanced qualification for B.Tech. Offers unique design and liberal arts programs based on UCEED.'
    },
    {
      name: 'Indian Institute of Technology BHU Varanasi',
      slug: 'iit-bhu-varanasi',
      description: 'Integrated within the historic Banaras Hindu University campus, IIT BHU has a legacy of over 100 years. It offers a unique interdisciplinary learning environment blending technical studies with classic culture.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Varanasi',
      locationState: 'Uttar Pradesh',
      rating: 4.5,
      feesMin: 205000,
      feesMax: 220000,
      placementAverage: 17.5,
      placementHighest: 88.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Heritage Campus'],
      admissionInfo: 'B.Tech programs accept students based on JEE Advanced scores through JoSAA counseling.'
    },
    {
      name: 'Indian Institute of Technology Gandhinagar',
      slug: 'iit-gandhinagar',
      description: 'Located on the banks of the Sabarmati River, IIT Gandhinagar is known for its modern project-based curriculum, strong global exchange programs, and green campus certified with 5-star ratings.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'Gandhinagar',
      locationState: 'Gujarat',
      rating: 4.5,
      feesMin: 210000,
      feesMax: 225000,
      placementAverage: 16.2,
      placementHighest: 75.0,
      type: 'IIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Cultural Centre'],
      admissionInfo: 'Selection is done through the standard JEE Advanced ranks. Excellent opportunities for study abroad.'
    },

    // NITs
    {
      name: 'National Institute of Technology Tiruchirappalli',
      slug: 'nit-trichy',
      description: 'Commonly known as NIT Trichy, it is the highest-ranked National Institute of Technology in India, highly regarded for engineering disciplines, placements, and campus activities.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Tiruchirappalli',
      locationState: 'Tamil Nadu',
      rating: 4.6,
      feesMin: 135000,
      feesMax: 150000,
      placementAverage: 15.8,
      placementHighest: 52.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium'],
      admissionInfo: 'Admission is through JoSAA based on JEE Main ranks. 50% seats reserved for Home State students.'
    },
    {
      name: 'National Institute of Technology Karnataka Surathkal',
      slug: 'nit-surathkal',
      description: 'Located right on the beach along the Arabian Sea, NITK Surathkal offers a serene study environment, top-notch marine research, and strong placement stats in core and software companies.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'Surathkal',
      locationState: 'Karnataka',
      rating: 4.6,
      feesMin: 140000,
      feesMax: 155000,
      placementAverage: 15.2,
      placementHighest: 54.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Private Beach Access', 'Labs', 'Auditorium'],
      admissionInfo: 'Uses standard JoSAA counseling system using credentials of Joint Entrance Exam (JEE) Main.'
    },
    {
      name: 'National Institute of Technology Warangal',
      slug: 'nit-warangal',
      description: 'The first NIT to be established in the country (1959), NIT Warangal has long-standing academic history, strong industry links, and exceptional labs for electrical and metallurgy departments.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'Warangal',
      locationState: 'Telangana',
      rating: 4.5,
      feesMin: 135000,
      feesMax: 150000,
      placementAverage: 14.8,
      placementHighest: 50.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium'],
      admissionInfo: 'Uses JEE Main rank and JoSAA counseling for admissions to all undergraduate courses.'
    },
    {
      name: 'National Institute of Technology Rourkela',
      slug: 'nit-rourkela',
      description: 'With one of the largest campuses among NITs, NIT Rourkela offers comprehensive courses in biotechnology, nanotechnology, and industrial design, alongside core engineering departments.',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'Rourkela',
      locationState: 'Odisha',
      rating: 4.4,
      feesMin: 130000,
      feesMax: 145000,
      placementAverage: 13.5,
      placementHighest: 46.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium'],
      admissionInfo: 'Admissions are handled by JoSAA for B.Tech programs based on results in JEE Main.'
    },
    {
      name: 'Motilal Nehru National Institute of Technology Allahabad',
      slug: 'mnnit-allahabad',
      description: 'MNNIT Allahabad is highly acclaimed for its computer science department, competitive coding environment, and strong records in IT and software placements year after year.',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'Prayagraj',
      locationState: 'Uttar Pradesh',
      rating: 4.4,
      feesMin: 138000,
      feesMax: 150000,
      placementAverage: 14.2,
      placementHighest: 51.8,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'IT Center'],
      admissionInfo: 'Admission depends on JoSAA seat allocation based on rank obtained in JEE Main.'
    },
    {
      name: 'Visvesvaraya National Institute of Technology Nagpur',
      slug: 'vnit-nagpur',
      description: 'VNIT Nagpur is located in the heart of Nagpur city, offering superb academic programs, highly qualified faculty, and strong links with core manufacturing and infrastructure firms.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'Nagpur',
      locationState: 'Maharashtra',
      rating: 4.3,
      feesMin: 135000,
      feesMax: 148000,
      placementAverage: 12.1,
      placementHighest: 40.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based on JEE Main ranks via JoSAA/CSAB counseling procedures.'
    },
    {
      name: 'Sardar Vallabhbhai National Institute of Technology Surat',
      slug: 'svnit-surat',
      description: 'SVNIT Surat is a key engineering node in Gujarat, renowned for chemical, civil, and mechanical departments, with strong internship programs in nearby petrochemical zones.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Surat',
      locationState: 'Gujarat',
      rating: 4.2,
      feesMin: 130000,
      feesMax: 145000,
      placementAverage: 11.5,
      placementHighest: 38.5,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Requires JEE Main ranking. Counseling and allocation is organized through JoSAA.'
    },
    {
      name: 'National Institute of Technology Calicut',
      slug: 'nit-calicut',
      description: 'Located in Kerala, NIT Calicut has a lush green campus and a stellar reputation for computer science, electronics, and architecture studies, offering a vibrant student atmosphere.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'Kozhikode',
      locationState: 'Kerala',
      rating: 4.4,
      feesMin: 135000,
      feesMax: 150000,
      placementAverage: 13.0,
      placementHighest: 47.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Cooperative Store'],
      admissionInfo: 'Candidates must appear in JEE Main and enroll in JoSAA counseling for selection.'
    },
    {
      name: 'National Institute of Technology Kurukshetra',
      slug: 'nit-kurukshetra',
      description: 'An institute of national importance located in Haryana, offering comprehensive training in smart power grids, communication systems, and cyber security.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Kurukshetra',
      locationState: 'Haryana',
      rating: 4.2,
      feesMin: 125000,
      feesMax: 140000,
      placementAverage: 11.2,
      placementHighest: 40.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Standard selection through JEE Main scores and JoSAA/CSAB processes.'
    },
    {
      name: 'National Institute of Technology Silchar',
      slug: 'nit-silchar',
      description: 'Located in Assam, NIT Silchar is recognized for its extensive campus, green lakes, supercomputing center, and rising rankings in research and innovation.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'Silchar',
      locationState: 'Assam',
      rating: 4.2,
      feesMin: 120000,
      feesMax: 138000,
      placementAverage: 10.8,
      placementHighest: 44.0,
      type: 'NIT',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Supercomputer Center', 'Labs'],
      admissionInfo: 'Uses JoSAA system with credentials of JEE Main exam.'
    },

    // Private Universities
    {
      name: 'Birla Institute of Technology and Science Pilani',
      slug: 'bits-pilani',
      description: 'BITS Pilani is a top-tier private deemed university renowned for its rigorous academic curriculum, "No Reservation" policy, and pioneering "Practice School" internship program.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'Pilani',
      locationState: 'Rajasthan',
      rating: 4.8,
      feesMin: 450000,
      feesMax: 500000,
      placementAverage: 21.0,
      placementHighest: 60.7,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium', 'Medical Center'],
      admissionInfo: 'Admission is based purely on merit in the computer-based BITSAT entrance exam. No reservations apply.'
    },
    {
      name: 'Vellore Institute of Technology',
      slug: 'vit-vellore',
      description: 'VIT Vellore is one of the largest private universities in India, holding high ranks in research, and offering a flexible credit system (FFCS) that lets students design their own timetables.',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'Vellore',
      locationState: 'Tamil Nadu',
      rating: 4.3,
      feesMin: 195000,
      feesMax: 295000,
      placementAverage: 9.2,
      placementHighest: 44.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'AC Classrooms'],
      admissionInfo: 'Admissions are conducted through VIT Engineering Entrance Exam (VITEEE) ranks.'
    },
    {
      name: 'SRM Institute of Science and Technology',
      slug: 'srm-chennai',
      description: 'Located in Kattankulathur near Chennai, SRM IST is popular for its massive campus, cosmopolitan student body, global study programs, and excellent IT placement records.',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'Chennai',
      locationState: 'Tamil Nadu',
      rating: 4.1,
      feesMin: 250000,
      feesMax: 350000,
      placementAverage: 8.0,
      placementHighest: 42.5,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Hospital'],
      admissionInfo: 'Requires ranking in the SRMJEEE entrance examination followed by counseling.'
    },
    {
      name: 'BITS Pilani Goa Campus',
      slug: 'bits-goa',
      description: 'An integral campus of BITS Pilani, BITS Goa offers stunning landscape views, an active student community, and identical curriculum and placements with Pilani campus.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'Zuarinagar',
      locationState: 'Goa',
      rating: 4.7,
      feesMin: 450000,
      feesMax: 500000,
      placementAverage: 19.8,
      placementHighest: 60.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Requires qualifying in BITSAT. Admissions are centralized with Pilani and Hyderabad.'
    },
    {
      name: 'BITS Pilani Hyderabad Campus',
      slug: 'bits-hyderabad',
      description: 'Established in 2008, the Hyderabad campus of BITS features highly advanced labs, pharmacy research, and close integration with Hyderabad software hub for internships.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Hyderabad',
      locationState: 'Telangana',
      rating: 4.7,
      feesMin: 450000,
      feesMax: 500000,
      placementAverage: 19.5,
      placementHighest: 58.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based entirely on BITSAT exam performance. Offers dual degree schemes.'
    },
    {
      name: 'Amity University Noida',
      slug: 'amity-noida',
      description: 'Amity Noida is a large private university known for its massive infrastructure, international campuses, military training programs, and wide range of courses in humanities, business, and technology.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'Noida',
      locationState: 'Uttar Pradesh',
      rating: 3.9,
      feesMin: 180000,
      feesMax: 320000,
      placementAverage: 6.5,
      placementHighest: 30.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'AC Hostels'],
      admissionInfo: 'Admission is based on Amity JEE or merit scores and personal interviews.'
    },
    {
      name: 'Manipal Academy of Higher Education',
      slug: 'manipal-academy',
      description: 'MAHE Manipal is a premier private university located in coastal Karnataka, offering excellent medical, dental, and engineering programs with a highly globalized campus.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Manipal',
      locationState: 'Karnataka',
      rating: 4.4,
      feesMin: 300000,
      feesMax: 450000,
      placementAverage: 12.0,
      placementHighest: 54.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Hospital'],
      admissionInfo: 'Requires ranking in Manipal Entrance Test (MET) for engineering. NEET for medical courses.'
    },
    {
      name: 'Thapar Institute of Engineering and Technology',
      slug: 'thapar-patiala',
      description: 'Thapar Patiala is a leading private engineering college in Punjab, boasting great research facilities, strong alumni network, and a corporate tie-up with Trinity College Dublin.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'Patiala',
      locationState: 'Punjab',
      rating: 4.3,
      feesMin: 280000,
      feesMax: 380000,
      placementAverage: 10.5,
      placementHighest: 40.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Admits students based on both JEE Main scores and 10+2 board exam percentages.'
    },
    {
      name: 'Ashoka University',
      slug: 'ashoka-university',
      description: 'Ashoka is India\'s pioneer liberal arts university offering rigorous interdisciplinary education in social sciences, humanities, and natural sciences, located in Sonipat, Haryana.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'Sonipat',
      locationState: 'Haryana',
      rating: 4.6,
      feesMin: 700000,
      feesMax: 900000,
      placementAverage: 11.8,
      placementHighest: 35.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'AC Buildings'],
      admissionInfo: 'Based on holistic review, Ashoka Aptitude Test (AAT), essays, and personal interviews.'
    },
    {
      name: 'Shiv Nadar University',
      slug: 'shiv-nadar-university',
      description: 'Founded by the creator of HCL, SNU Noida is a multidisciplinary research-focused private university offering global-standard labs and undergraduate research schemes (OUR).',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'Greater Noida',
      locationState: 'Uttar Pradesh',
      rating: 4.4,
      feesMin: 250000,
      feesMax: 400000,
      placementAverage: 9.8,
      placementHighest: 58.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based on SNUSAT & APT exam ranks along with JEE Main percentile.'
    },
    {
      name: 'Lovely Professional University',
      slug: 'lpu-punjab',
      description: 'LPU is a massive private campus in Punjab with over 30,000 students, featuring large sports complexes, international collaborations, and highly active placement drives.',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'Phagwara',
      locationState: 'Punjab',
      rating: 4.0,
      feesMin: 120000,
      feesMax: 240000,
      placementAverage: 6.2,
      placementHighest: 64.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Mall on Campus', 'Labs'],
      admissionInfo: 'Requires passing the LPUNEST exam. Direct admissions are offered for top board scorers.'
    },
    {
      name: 'Symbiosis International University',
      slug: 'symbiosis-pune',
      description: 'SIU Pune is renowned for its business management (SIBM), law (SLS), and media programs, providing premium campus facilities and rich corporate networking opportunities.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'Pune',
      locationState: 'Maharashtra',
      rating: 4.3,
      feesMin: 350000,
      feesMax: 600000,
      placementAverage: 12.0,
      placementHighest: 35.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Auditorium'],
      admissionInfo: 'Admission is through SET (Symbiosis Entrance Test) or SNAP for postgraduates.'
    },
    {
      name: 'Christ University',
      slug: 'christ-university-bangalore',
      description: 'Known for its strict discipline and high-quality commerce and arts departments, Christ Bangalore has multiple lush green city campuses and stellar placement statistics for BBA and BCA.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Bengaluru',
      locationState: 'Karnataka',
      rating: 4.2,
      feesMin: 150000,
      feesMax: 300000,
      placementAverage: 7.2,
      placementHighest: 21.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based on Christ University Entrance Test (CUET), micro-presentations, and interviews.'
    },
    {
      name: 'NMIMS Deemed to be University',
      slug: 'nmims-mumbai',
      description: 'NMIMS Mumbai is a premium private university famous for its business school (SBM) and integrated engineering-MBA courses located in Vile Parle, Mumbai.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'Mumbai',
      locationState: 'Maharashtra',
      rating: 4.2,
      feesMin: 250000,
      feesMax: 400000,
      placementAverage: 10.5,
      placementHighest: 32.0,
      type: 'Private',
      facilities: ['Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'AC Building'],
      admissionInfo: 'Requires taking NMIMS-NPAT for undergraduate admissions. NMAT for MBA.'
    },
    {
      name: 'PES University',
      slug: 'pes-university-bangalore',
      description: 'PES University in Bangalore is highly regarded for computer science, software engineering, and industry-oriented syllabus with immediate internship placements in Tech parks.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Bengaluru',
      locationState: 'Karnataka',
      rating: 4.3,
      feesMin: 380000,
      feesMax: 450000,
      placementAverage: 11.5,
      placementHighest: 48.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Selection is done through PESSAT exam ranks or KCET state counseling.'
    },

    // Government Colleges & Others
    {
      name: 'Delhi Technological University',
      slug: 'dtu-delhi',
      description: 'Formerly Delhi College of Engineering (DCE), DTU is a premier state government university in Delhi with a rich legacy since 1941, producing top entrepreneurs and corporate leaders.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.6,
      feesMin: 180000,
      feesMax: 200000,
      placementAverage: 15.5,
      placementHighest: 82.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Auditorium'],
      admissionInfo: 'Admissions are done through Joint Admission Counseling (JAC) Delhi based on JEE Main ranks.'
    },
    {
      name: 'Netaji Subhas University of Technology',
      slug: 'nsut-delhi',
      description: 'Formerly NSIT, NSUT is a highly reputed state-government engineering university in Dwarka, New Delhi, famous for electronics and software placements.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.5,
      feesMin: 185000,
      feesMax: 210000,
      placementAverage: 14.8,
      placementHighest: 78.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Requires ranking in JEE Main. Admission runs under the JAC Delhi counseling panel.'
    },
    {
      name: 'College of Engineering Pune',
      slug: 'coep-pune',
      description: 'COEP is the third oldest engineering college in Asia (founded in 1854). It is highly prestigious in Maharashtra, retaining its classic heritage and active student clubs.',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'Pune',
      locationState: 'Maharashtra',
      rating: 4.5,
      feesMin: 90000,
      feesMax: 110000,
      placementAverage: 9.8,
      placementHighest: 36.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Boat Club'],
      admissionInfo: 'Admits state students based on MHT-CET score. All India students can apply through JEE Main.'
    },
    {
      name: 'Jadavpur University',
      slug: 'jadavpur-university',
      description: 'Jadavpur University in Kolkata is a top government-funded state university famous for its high-quality education at incredibly low fees, boasting stellar return on investment (ROI).',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'Kolkata',
      locationState: 'West Bengal',
      rating: 4.7,
      feesMin: 2500,
      feesMax: 5000,
      placementAverage: 12.5,
      placementHighest: 85.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Selection is done through the West Bengal Joint Entrance Examination (WBJEE) ranks.'
    },
    {
      name: 'College of Engineering Guindy',
      slug: 'ceg-chennai',
      description: 'Guindy Engineering College (established in 1794) is a highly prestigious public engineering college affiliated with Anna University, Chennai.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'Chennai',
      locationState: 'Tamil Nadu',
      rating: 4.6,
      feesMin: 35000,
      feesMax: 50000,
      placementAverage: 9.5,
      placementHighest: 38.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Admissions are handled by TNEA (Tamil Nadu Engineering Admissions) based on Class 12 marks.'
    },
    {
      name: 'Punjab Engineering College',
      slug: 'pec-chandigarh',
      description: 'PEC Chandigarh is a public grant-in-aid engineering university in Chandigarh, known for its aerospace and mechanical departments and long-standing corporate links.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'Chandigarh',
      locationState: 'Chandigarh',
      rating: 4.2,
      feesMin: 120000,
      feesMax: 140000,
      placementAverage: 10.2,
      placementHighest: 42.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Admissions are carried out through JoSAA based on JEE Main ranking lists.'
    },
    {
      name: 'International Institute of Information Technology Hyderabad',
      slug: 'iiit-hyderabad',
      description: 'IIIT-H is a premier autonomous research university focusing on IT, computer science, and electronics, featuring a highly competitive student cohort.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'Hyderabad',
      locationState: 'Telangana',
      rating: 4.8,
      feesMin: 320000,
      feesMax: 360000,
      placementAverage: 30.2,
      placementHighest: 102.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Research Centers'],
      admissionInfo: 'Multiple channels: JEE Main rank (via JoSAA/Direct), DASA, or UGEE research entrance exam.'
    },
    {
      name: 'International Institute of Information Technology Bangalore',
      slug: 'iiit-bangalore',
      description: 'IIIT-B is a premier graduate school focusing on computer science, IT, and VLSI, offering highly acclaimed integrated M.Tech programs in Electronic City.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Bengaluru',
      locationState: 'Karnataka',
      rating: 4.6,
      feesMin: 350000,
      feesMax: 400000,
      placementAverage: 26.0,
      placementHighest: 85.0,
      type: 'Private',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Admissions are offered to Integrated M.Tech (5-year) based strictly on JEE Main rank.'
    },
    {
      name: 'Indraprastha Institute of Information Technology Delhi',
      slug: 'iiit-delhi',
      description: 'IIIT-Delhi is a state university created by Delhi Government, focusing heavily on research in Artificial Intelligence, bioinformatics, and cybersecurity.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.5,
      feesMin: 220000,
      feesMax: 250000,
      placementAverage: 18.5,
      placementHighest: 51.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs', 'Recreation Room'],
      admissionInfo: 'Requires JEE Main score. Admissions are routed through the JAC Delhi counseling.'
    },
    {
      name: 'Anna University',
      slug: 'anna-university-chennai',
      description: 'Anna University is a premier public state university in Tamil Nadu, ranking high in NIRF and managing hundreds of engineering colleges across the state.',
      logo: '',
      banner: '/colleges/campus5.png',
      locationCity: 'Chennai',
      locationState: 'Tamil Nadu',
      rating: 4.4,
      feesMin: 40000,
      feesMax: 60000,
      placementAverage: 8.5,
      placementHighest: 36.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based on Tamil Nadu Engineering Admissions (TNEA) rules matching Class 12 merit scores.'
    },
    {
      name: 'Jamia Millia Islamia',
      slug: 'jamia-millia-islamia',
      description: 'A central university in New Delhi, JMI is highly acclaimed for engineering, law, and mass communication courses, holding premium infrastructure and cheap fees.',
      logo: '',
      banner: '/colleges/campus6.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.3,
      feesMin: 15000,
      feesMax: 30000,
      placementAverage: 8.2,
      placementHighest: 25.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Requires appearing in the JMI Entrance Exam or JEE Main for B.Tech courses.'
    },
    {
      name: 'Shri Ram College of Commerce',
      slug: 'srcc-delhi',
      description: 'SRCC is the premier commerce college under Delhi University, famous for its exceptionally high cutoff requirements and elite placements in finance and consulting.',
      logo: '',
      banner: '/colleges/campus7.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.8,
      feesMin: 30000,
      feesMax: 40000,
      placementAverage: 10.5,
      placementHighest: 35.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Seminar Room'],
      admissionInfo: 'Selection is done through CUET UG (Common University Entrance Test) scores.'
    },
    {
      name: 'St. Stephen\'s College',
      slug: 'st-stephens-delhi',
      description: 'One of the oldest colleges under Delhi University, St. Stephen\'s is highly prestigious for liberal arts and sciences, offering a residential community setup.',
      logo: '',
      banner: '/colleges/campus8.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.7,
      feesMin: 40000,
      feesMax: 50000,
      placementAverage: 9.2,
      placementHighest: 28.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Chapel'],
      admissionInfo: 'Requires CUET UG score followed by College-specific interviews for shortlisted candidates.'
    },
    {
      name: 'Lady Shri Ram College for Women',
      slug: 'lsr-delhi',
      description: 'LSR Delhi is a premier public arts and social sciences college for women, consistently ranked among the top humanities institutions in India.',
      logo: '',
      banner: '/colleges/campus1.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.7,
      feesMin: 25000,
      feesMax: 35000,
      placementAverage: 8.8,
      placementHighest: 30.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Auditorium'],
      admissionInfo: 'Requires high scores in the Common University Entrance Test (CUET UG).'
    },
    {
      name: 'Jawaharlal Nehru University',
      slug: 'jnu-delhi',
      description: 'JNU is a highly prominent central research university in New Delhi, famous for social sciences, international studies, languages, and vibrant political discourse.',
      logo: '',
      banner: '/colleges/campus2.png',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      rating: 4.6,
      feesMin: 500,
      feesMax: 1500,
      placementAverage: 7.8,
      placementHighest: 18.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Research Labs'],
      admissionInfo: 'Admission is based on CUET PG / CUET UG exams depending on the course applied.'
    },
    {
      name: 'Banaras Hindu University',
      slug: 'bhu-varanasi-central',
      description: 'BHU is one of the largest residential universities in Asia, housing thousands of students across arts, sciences, agriculture, medicine, and engineering departments.',
      logo: '',
      banner: '/colleges/campus3.png',
      locationCity: 'Varanasi',
      locationState: 'Uttar Pradesh',
      rating: 4.5,
      feesMin: 5000,
      feesMax: 20000,
      placementAverage: 6.8,
      placementHighest: 22.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Museum', 'Temple'],
      admissionInfo: 'Selection is done through CUET UG and CUET PG scores managed by NTA.'
    },
    {
      name: 'Aligarh Muslim University',
      slug: 'amu-aligarh',
      description: 'AMU is a historic central public university with rich culture, offering thousands of courses in medicine, technology, languages, and law in Aligarh, UP.',
      logo: '',
      banner: '/colleges/campus4.png',
      locationCity: 'Aligarh',
      locationState: 'Uttar Pradesh',
      rating: 4.4,
      feesMin: 8000,
      feesMax: 25000,
      placementAverage: 6.5,
      placementHighest: 20.0,
      type: 'Government',
      facilities: ['Hostel', 'Library', 'Gym', 'WiFi', 'Sports', 'Cafeteria', 'Labs'],
      admissionInfo: 'Based on AMU Entrance Test ranks and school board percentage.'
    }
  ];

  console.log(`Prepared ${rawColleges.length} colleges data. Inserting into database...`);

  // Course Names and Review Templates to auto-populate
  const courseTemplates = [
    { name: 'B.Tech Computer Science and Engineering', duration: 4, eligibility: '10+2 with Physics, Chemistry, Math & JEE score' },
    { name: 'B.Tech Electronics and Communication Engineering', duration: 4, eligibility: '10+2 with Physics, Chemistry, Math & JEE score' },
    { name: 'M.Tech Data Science & Artificial Intelligence', duration: 2, eligibility: 'B.Tech / BE in relevant stream with GATE qualification' },
    { name: 'MBA (Master of Business Administration)', duration: 2, eligibility: 'Graduation with min 50% & CAT/XAT/MAT score' },
    { name: 'B.Sc (Hons) Computer Science', duration: 3, eligibility: '10+2 in Science stream with Mathematics' }
  ];

  const reviewTemplates = [
    {
      rating: 5,
      title: 'Amazing learning experience with outstanding placements!',
      content: 'The campus life is incredible and the faculty is highly supportive. Competitive programming culture is very strong and the internship programs give great industrial exposure. Facilities like libraries and high-speed WiFi are available 24/7.',
      studentName: 'Amit Patel',
      stream: 'Computer Science',
      graduationYear: 2024
    },
    {
      rating: 4,
      title: 'Excellent academic infrastructure but high academic pressure.',
      content: 'Academics are top notch, but the schedule is quite hectic. The labs are equipped with latest state-of-the-art systems and software. Placement cell is extremely proactive and hosts multiple training bootcamps. Hostel rooms are decent and food is average.',
      studentName: 'Priya Nair',
      stream: 'Electronics & Communication',
      graduationYear: 2025
    },
    {
      rating: 4,
      title: 'Decent infrastructure and helpful alumni network.',
      content: 'The alumni network is one of the strongest assets here. Getting placed is fairly easy if you keep a good GPA. There are multiple sports fields and student clubs which host national-level fests every year.',
      studentName: 'Siddharth Sen',
      stream: 'Information Technology',
      graduationYear: 2023
    }
  ];

  // Seed colleges, courses, and reviews in a loop
  for (const rawCol of rawColleges) {
    // Create College
    const college = await prisma.college.create({
      data: {
        name: rawCol.name,
        slug: rawCol.slug,
        description: rawCol.description,
        logo: rawCol.logo,
        banner: rawCol.banner,
        locationCity: rawCol.locationCity,
        locationState: rawCol.locationState,
        rating: rawCol.rating,
        feesMin: rawCol.feesMin,
        feesMax: rawCol.feesMax,
        placementAverage: rawCol.placementAverage,
        placementHighest: rawCol.placementHighest,
        type: rawCol.type,
        facilities: JSON.stringify(rawCol.facilities),
        admissionInfo: rawCol.admissionInfo
      }
    });

    // Create Courses for this College
    // Choose 3-4 random course templates and adjust fees based on college fees range
    const numCourses = Math.floor(Math.random() * 2) + 3; // 3 to 4 courses
    const selectedCourses = courseTemplates.slice(0, numCourses);

    for (const c of selectedCourses) {
      // Scale course fees
      const scale = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      let annualFees = Math.round(((college.feesMin + college.feesMax) / 2) * scale);
      if (annualFees < 1000) annualFees = 5000; // boundary check for super cheap ones

      await prisma.course.create({
        data: {
          name: c.name,
          duration: c.duration,
          eligibility: c.eligibility,
          feesAnnual: annualFees,
          collegeId: college.id
        }
      });
    }

    // Create Reviews for this College
    // Modify slightly to match college rating
    const numReviews = Math.floor(Math.random() * 2) + 2; // 2 to 3 reviews
    const selectedReviews = reviewTemplates.slice(0, numReviews);

    for (const r of selectedReviews) {
      // Modify review rating to align roughly with the college's average rating
      const ratingOffset = Math.random() > 0.5 ? 0 : -1;
      const reviewRating = Math.max(1, Math.min(5, Math.round(college.rating + ratingOffset)));

      await prisma.review.create({
        data: {
          rating: reviewRating,
          title: r.title,
          content: r.content,
          studentName: r.studentName,
          stream: r.stream,
          graduationYear: r.graduationYear,
          collegeId: college.id,
          userId: student.id // Associate review with our seeded student user
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
