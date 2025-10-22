import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, CheckCircle2, FileText, PlayCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import examsData from '@/data/exams/index.json';
import courseData from '@/data/courses/cset-multiple-subjects/course.json';
import module1Data from '@/data/courses/cset-multiple-subjects/module-1.json';

interface ModulePageProps {
  params: {
    stateId: string;
    examId: string;
    moduleId: string;
  };
}

export default function ModulePage({ params }: ModulePageProps) {
  const state = examsData.states.find((s) => s.id === params.stateId);
  const exam = state?.exams.find((e) => e.id === params.examId);
  const module = courseData.modules.find((m) => m.id === params.moduleId);

  if (!state || !exam || !module) {
    notFound();
  }

  // For this demo, we'll use module 1 data as template
  const moduleContent = params.moduleId === 'module-1' ? module1Data : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/states/${params.stateId}/${params.examId}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Module {module.number} of {courseData.modules.length}</span>
              <Button href="/pricing" variant="primary" size="sm">
                Enroll to Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Module Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-medium">Module {module.number}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {module.title}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {module.description}
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>{module.lessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{module.quizQuestions} Practice Questions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-32">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Lessons</h3>
                {moduleContent ? (
                  <div className="space-y-2">
                    {moduleContent.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-primary-200"
                      >
                        <div className="flex items-start gap-3">
                          <PlayCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 mb-1">
                              Lesson {lesson.number}: {lesson.title}
                            </p>
                            <p className="text-xs text-gray-600">{lesson.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 rounded-lg bg-accent-50 border border-accent-200 mt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-gray-900 mb-1">
                            Module Quiz
                          </p>
                          <p className="text-xs text-gray-600">{module.quizQuestions} questions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Lesson content for this module is being prepared.
                  </p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {moduleContent ? (
                <div className="space-y-8">
                  {/* Sample Lesson Preview */}
                  {moduleContent.lessons.slice(0, 1).map((lesson) => (
                    <div key={lesson.id} className="card p-8">
                      <div className="mb-6">
                        <span className="text-sm font-semibold text-primary-600 mb-2 block">
                          LESSON {lesson.number}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                          {lesson.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <p className="text-lg text-gray-700 mb-6">
                          {lesson.content.introduction}
                        </p>

                        {lesson.content.sections.map((section, idx) => (
                          <div key={idx} className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {section.heading}
                            </h3>
                            {section.image && (
                              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                                <Image
                                  src={section.image}
                                  alt={section.heading}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="text-gray-700 whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                        ))}

                        <div className="bg-blue-50 rounded-xl p-6 mt-8">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">
                            Key Takeaways
                          </h4>
                          <ul className="space-y-2">
                            {lesson.content.keyTakeaways.map((takeaway, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Activity */}
                      {lesson.activity && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Practice Activity: {lesson.activity.title}
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                              {lesson.activity.instructions}
                            </p>
                            <div className="text-sm text-gray-600">
                              <p className="font-semibold mb-2">
                                This is a preview. Enroll to access interactive activities and quizzes.
                              </p>
                              <Button href="/pricing" variant="primary" size="md">
                                Enroll Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Preview Notice */}
                  <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      This is a Free Preview
                    </h3>
                    <p className="text-gray-700 mb-6">
                      You're viewing Lesson 1 of {module.lessons}. Enroll now to access all {module.lessons} lessons, interactive activities, and the {module.quizQuestions}-question module quiz.
                    </p>
                    <Button href="/pricing" variant="primary" size="lg">
                      Enroll for Full Access - $99
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Module Content Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This module's detailed lessons are being prepared. Enroll now to get lifetime access when it's released!
                  </p>
                  <Button href="/pricing" variant="primary" size="lg">
                    Enroll Now - $99
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
