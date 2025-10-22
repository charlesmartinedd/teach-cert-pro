import Link from 'next/link';
import Image from 'next/image';
import { Clock, FileText, Award, TrendingUp } from 'lucide-react';

interface ExamCardProps {
  id: string;
  name: string;
  fullName: string;
  state: string;
  description: string;
  duration: string;
  modules: number;
  practiceQuestions: number;
  studyHours: number;
  thumbnail: string;
  stateId: string;
}

export default function ExamCard({
  id,
  name,
  fullName,
  state,
  description,
  duration,
  modules,
  practiceQuestions,
  studyHours,
  thumbnail,
  stateId,
}: ExamCardProps) {
  return (
    <Link
      href={`/states/${stateId}/${id}`}
      className="card card-clickable group overflow-hidden h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-accent-500 overflow-hidden">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="badge badge-info bg-white/90 backdrop-blur-sm">
            {state}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-primary-500" />
            <span>{modules} Modules</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-primary-500" />
            <span>{practiceQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <span>{studyHours}h Study</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <span className="text-primary-600 font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
            Start Learning
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
