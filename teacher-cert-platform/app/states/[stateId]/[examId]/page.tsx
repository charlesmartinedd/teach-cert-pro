import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, BookOpen, Award, PlayCircle, CheckCircle2, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import examsData from '@/data/exams/index.json';
import courseData from '@/data/courses/cset-multiple-subjects/course.json';

interface CoursePageProps {
  params: {
    stateId: string;
    examId: string;
  };
}

export async function generateStaticParams() {
  const params: { stateId: string; examId: string }[] = [];
  examsData.states.forEach((state) => {
    state.exams.forEach((exam) => {
      params.push({
        stateId: state.id,
        examId: exam.id,
      });
    });
  });
  return params;
}

export default function CoursePage({ params }: CoursePageProps) {
  const state = examsData.states.find((s) => s.id === params.stateId);
  const exam = state?.exams.find((e) => e.id === params.examId);

  if (!state || !exam) {
    notFound();
  }

  // For this demo, we'll use the CSET course data for all exams
  const course = courseData;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom py-4">
          <Link
            href={`/states/${params.stateId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {state.name}</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
                <span className="text-sm font-medium">4.9/5 from 2,341 students</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {exam.fullName}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {exam.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>{course.totalQuizQuestions}+ Practice Questions</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/pricing" variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Enroll Now - $99
                </Button>
                <Button href="#curriculum" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  View Curriculum
                </Button>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="card p-6 text-gray-900">
              <h3 className="text-xl font-bold mb-4">Your Instructor</h3>
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{course.instructor.name}</h4>
                  <p className="text-primary-600 text-sm mb-2">{course.instructor.title}</p>
                  <p className="text-gray-600 text-sm">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section id="curriculum" className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Course Curriculum
          </h2>

          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id} className="card p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                        {module.number}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                  </div>
                  <div className="relative h-24 w-32 rounded-lg overflow-hidden flex-shrink-0 hidden md:block">
                    <Image
                      src={module.thumbnail}
                      alt={module.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-500" />
                    <span>{module.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary-500" />
                    <span>{module.quizQuestions} Quiz Questions</span>
                  </div>
                </div>

                <Link
                  href={`/states/${params.stateId}/${params.examId}/${module.id}`}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Start Module</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <CheckCircle2 className="w-8 h-8 text-success-600 mx-auto mb-3" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Pass Your {exam.name}?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful teachers who prepared with TeachCertPro
          </p>
          <Button href="/pricing" variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Enroll Now - $99
          </Button>
          <p className="mt-4 text-sm text-blue-100">
            14-day money-back guarantee • Lifetime access • Mobile-friendly
          </p>
        </div>
      </section>
    </div>
  );
}
