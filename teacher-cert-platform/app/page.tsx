import Link from 'next/link';
import { ArrowRight, BookOpen, Award, Users, TrendingUp, CheckCircle2, Star, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import ExamCard from '@/components/ui/ExamCard';
import examsData from '@/data/exams/index.json';

export default function HomePage() {
  // Get featured exams (first 3)
  const featuredExams = examsData.states.flatMap((state) =>
    state.exams.slice(0, 1).map((exam) => ({
      ...exam,
      stateId: state.id,
    }))
  ).slice(0, 3);

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Content',
      description: 'In-depth study materials covering all exam topics with detailed explanations and examples.',
    },
    {
      icon: Award,
      title: 'Practice Tests',
      description: 'Hundreds of practice questions with detailed explanations to test your knowledge.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and progress tracking.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get help from experienced educators who have passed these exams themselves.',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Students Trained' },
    { value: '95%', label: 'Pass Rate' },
    { value: '15+', label: 'States Covered' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  const benefits = [
    'Self-paced learning with lifetime access',
    'Mobile-friendly platform for learning on-the-go',
    'Regular content updates to match current exam formats',
    'Money-back guarantee if you don\'t pass',
    'Certificate of completion for each course',
    'Access to exclusive study groups and forums',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}></div>
        </div>

        <div className="container-custom relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
              <span className="text-sm font-medium">Trusted by 50,000+ educators nationwide</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up text-balance">
              Master Your Teacher Certification Exam
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up text-balance" style={{ animationDelay: '0.1s' }}>
              Comprehensive courses, practice tests, and expert guidance to help you pass your teaching exam on the first try.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button href="/states" variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
                Browse All Exams
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button href="/pricing" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>14-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Exams */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Certification Exams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start preparing for your state's teaching certification exam today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredExams.map((exam) => (
              <ExamCard key={exam.id} {...exam} />
            ))}
          </div>

          <div className="text-center">
            <Button href="/states" variant="outline" size="lg">
              View All States & Exams
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TeachCertPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to ace your teacher certification exam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:shadow-card transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Success Is Our Priority
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We've helped thousands of aspiring teachers pass their certification exams and start fulfilling teaching careers. Our comprehensive platform is designed to give you the best chance of success.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button href="/pricing" variant="primary" size="lg">
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-white p-8">
                  <div className="text-center">
                    <Award className="w-24 h-24 mx-auto mb-6" strokeWidth={1.5} />
                    <h3 className="text-3xl font-bold mb-4">95% Pass Rate</h3>
                    <p className="text-xl text-blue-100">
                      Our students consistently exceed national averages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful teachers who prepared with TeachCertPro
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/states" variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Browse Exams
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button href="/pricing" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
