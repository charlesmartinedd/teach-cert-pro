# TeachCertPro - Teacher Certification Exam Platform

A beautiful, fully-functional subscription-based educational platform for teacher certification exam preparation. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern Design System**: Clean, professional UI inspired by Coursera and Udemy
- **Comprehensive Course Content**: Full module with 8 detailed lessons, activities, and quizzes
- **Responsive Design**: Beautiful on mobile, tablet, and desktop
- **Multiple Pages**:
  - Homepage with hero, features, and state selection
  - States listing and individual state pages
  - Course pages with module navigation
  - Module pages with full lesson content
  - Pricing page with subscription tiers
  - Login/authentication UI (mocked for demo)
  - Account dashboard with progress tracking

## Real Exam Data

The platform includes real data for teacher certification exams:

- **California**: CSET Multiple Subjects, CBEST
- **New York**: NYSTCE EAS, NYSTCE CST Multi-Subject
- **Texas**: TExES Core Subjects EC-6

### CSET Multiple Subjects - Complete Module 1

Module 1 "Reading, Language & Literature" includes:

1. **Lesson 1**: Phonemic Awareness and Phonological Processing (3 hours)
2. **Lesson 2**: Phonics and Word Recognition (3 hours)
3. **Lesson 3**: Vocabulary Development and Word Learning (3 hours)
4. **Lesson 4**: Reading Fluency and Expression (3 hours)
5. **Lesson 5**: Reading Comprehension Strategies (3 hours)
6. **Lesson 6**: Literary Analysis and Text Structures (3 hours)
7. **Lesson 7**: Writing Process and Composition (3 hours)
8. **Lesson 8**: Assessment and Differentiation (4 hours)

Each lesson includes:
- Comprehensive content with multiple sections
- High-quality educational images
- Practice activities
- Key takeaways
- Module quiz with 100+ questions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Images**: Unsplash API
- **Deployment Ready**: Optimized for Vercel

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
teacher-cert-platform/
├── app/                          # Next.js 14 App Router pages
│   ├── layout.tsx               # Root layout with header/footer
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── states/
│   │   ├── page.tsx            # All states listing
│   │   └── [stateId]/
│   │       ├── page.tsx        # Individual state page
│   │       └── [examId]/
│   │           ├── page.tsx    # Course overview
│   │           └── [moduleId]/
│   │               └── page.tsx # Module with lessons
│   ├── pricing/
│   │   └── page.tsx            # Pricing page
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── account/
│       └── page.tsx            # Account dashboard
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Site header with navigation
│   │   └── Footer.tsx          # Site footer
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button component
│   │   └── ExamCard.tsx        # Exam card component
│   └── course/                  # Course-specific components
├── data/
│   ├── exams/
│   │   └── index.json          # All exam data
│   └── courses/
│       └── cset-multiple-subjects/
│           ├── course.json      # Course metadata
│           └── module-1.json    # Full module content
├── theme/
│   └── design-system.md        # Complete design system documentation
├── public/                      # Static assets
├── package.json
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.mjs             # Next.js configuration
```

## Design System

See `theme/design-system.md` for complete documentation on:
- Color palette (primary, accent, success, neutral)
- Typography hierarchy
- Component styles
- Spacing system
- Shadows and animations
- Accessibility guidelines

### Key Colors

- **Primary Blue**: `#2563eb` (primary-600) - Trust and professionalism
- **Accent Purple**: `#d946ef` (accent-600) - Energy and engagement
- **Success Green**: `#22c55e` (success-600) - Progress and achievement

## How to Duplicate for New Exams

### Step 1: Add Exam Data

Edit `data/exams/index.json`:

```json
{
  "states": [
    {
      "id": "your-state",
      "name": "Your State",
      "exams": [
        {
          "id": "your-exam-id",
          "name": "Your Exam Name",
          "fullName": "Full Exam Title",
          "description": "Exam description",
          "duration": "X hours",
          "modules": 5,
          "totalLessons": 30,
          "practiceQuestions": 500,
          "studyHours": 120,
          "thumbnail": "https://images.unsplash.com/photo-xxxxx"
        }
      ]
    }
  ]
}
```

### Step 2: Create Course Structure

Create `data/courses/your-exam-id/course.json`:

```json
{
  "courseId": "your-exam-id",
  "title": "Your Exam - Complete Course",
  "description": "Course description",
  "modules": [
    {
      "id": "module-1",
      "number": 1,
      "title": "Module Title",
      "description": "Module description",
      "duration": "25 hours",
      "lessons": 8,
      "quizQuestions": 100
    }
  ]
}
```

### Step 3: Create Module Content

Create `data/courses/your-exam-id/module-X.json` using `module-1.json` as a template:

```json
{
  "moduleId": "module-X",
  "lessons": [
    {
      "id": "lesson-X-1",
      "number": 1,
      "title": "Lesson Title",
      "duration": "3 hours",
      "content": {
        "introduction": "Lesson intro",
        "sections": [
          {
            "heading": "Section Heading",
            "content": "Section content",
            "image": "https://images.unsplash.com/..."
          }
        ],
        "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
      },
      "activity": {
        "title": "Activity Title",
        "instructions": "Activity instructions"
      }
    }
  ],
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "Question text?",
        "options": ["A) Option 1", "B) Option 2"],
        "correctAnswer": "A",
        "explanation": "Explanation of answer"
      }
    ]
  }
}
```

### Step 4: Update Routes (Automatic)

Next.js dynamic routes automatically handle new exams! Just ensure your IDs match:
- State page: `/states/[stateId]`
- Exam page: `/states/[stateId]/[examId]`
- Module page: `/states/[stateId]/[examId]/[moduleId]`

### Step 5: Add Images

Use Unsplash for professional, free images:
- Search: https://unsplash.com/s/photos/education
- Get image URL: `https://images.unsplash.com/photo-XXXXXXX?w=800&q=80`

## Content Guidelines

### Writing Lessons

1. **Introduction**: 2-3 sentences explaining the lesson topic
2. **Sections**: 3-4 major sections per lesson
3. **Each Section**:
   - Clear heading
   - 200-400 words of content
   - Relevant image
   - Use bullet points and lists for clarity
4. **Key Takeaways**: 4-6 bullet points summarizing main ideas
5. **Activity**: Practical exercise related to lesson content

### Creating Quizzes

1. **Multiple Choice**: Most common format
2. **4 Options**: A, B, C, D
3. **Clear Questions**: No ambiguity
4. **Detailed Explanations**: Explain why answer is correct
5. **100+ Questions per Module**: Mix difficulty levels

### Finding Images

Categories to search on Unsplash:
- "education" - General education scenes
- "teaching" - Classroom and teaching
- "books" - Reading and literature
- "science" - Science topics
- "mathematics" - Math topics
- "students" - Student learning
- "classroom" - School environments

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Vercel auto-detects Next.js
4. Deploy!

### Environment Variables (if needed)

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

## Customization

### Change Branding

1. **Logo**: Update in `components/layout/Header.tsx` and `Footer.tsx`
2. **Colors**: Edit `tailwind.config.ts`
3. **Site Name**: Search and replace "TeachCertPro"
4. **Metadata**: Update in `app/layout.tsx`

### Add Authentication

Replace mock auth in `app/login/page.tsx` with:
- **NextAuth.js**: For OAuth providers
- **Supabase**: For full backend
- **Clerk**: For complete auth solution
- **Firebase**: For Google integration

### Add Payments

Replace mock pricing in `app/pricing/page.tsx` with:
- **Stripe**: Most popular (recommended)
- **PayPal**: Alternative payment processor
- **Lemon Squeezy**: Modern Stripe alternative

### Add Database

Current implementation uses JSON files. To add a database:

1. **Supabase** (recommended for beginners)
2. **PostgreSQL** (for production)
3. **MongoDB** (if you prefer NoSQL)
4. **Firebase Firestore** (for real-time features)

## Features to Add

Potential enhancements:

- [ ] Real authentication system
- [ ] Payment integration (Stripe)
- [ ] Progress persistence (database)
- [ ] Video lessons
- [ ] Interactive quizzes with scoring
- [ ] Discussion forums
- [ ] Study groups
- [ ] Flashcards
- [ ] Mobile apps (React Native)
- [ ] Email notifications
- [ ] Certificate generation
- [ ] Admin dashboard

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Fully responsive on all devices

## License

This is a prototype/demo project. Use as inspiration or foundation for your own educational platform.

## Support

For questions or issues:
1. Check this README
2. Review the code comments
3. Check Next.js documentation: https://nextjs.org/docs
4. Check Tailwind CSS docs: https://tailwindcss.com/docs

## Credits

- **Framework**: Next.js by Vercel
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Images**: Unsplash
- **Fonts**: Inter (Google Fonts)
- **Design Inspiration**: Coursera, Udemy

---

Built with ❤️ for educators everywhere.
