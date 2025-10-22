import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import ExamCard from '@/components/ui/ExamCard';
import examsData from '@/data/exams/index.json';

interface StatePageProps {
  params: {
    stateId: string;
  };
}

export async function generateStaticParams() {
  return examsData.states.map((state) => ({
    stateId: state.id,
  }));
}

export default function StatePage({ params }: StatePageProps) {
  const state = examsData.states.find((s) => s.id === params.stateId);

  if (!state) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      {/* Breadcrumb */}
      <div className="container-custom mb-8">
        <Link
          href="/states"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All States</span>
        </Link>
      </div>

      {/* State Header */}
      <section className="container-custom mb-12">
        <div className="flex items-start gap-4 mb-4">
          <MapPin className="w-10 h-10 text-primary-600 flex-shrink-0" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {state.name} Teacher Certification
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              {state.description}
            </p>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="container-custom">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Available Exams
          </h2>
          <p className="text-gray-600">
            Choose the exam you're preparing for to access comprehensive study materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.exams.map((exam) => (
            <ExamCard
              key={exam.id}
              {...exam}
              stateId={state.id}
            />
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="container-custom mt-16">
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            About {state.name} Certification
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Teacher certification in {state.name} requires passing specific examinations to demonstrate
              subject matter competency and teaching knowledge. Our comprehensive courses are designed to help
              you master the content and pass your exams with confidence.
            </p>
            <p className="mt-4">
              Each course includes detailed study materials, practice questions, progress tracking, and expert
              support to ensure you're fully prepared for exam day.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
