import { GraduationCap, Target, Users, Award, Heart, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'About TeachCertPro - Empowering Future Educators',
  description: 'Learn about our mission to help aspiring teachers pass their certification exams and start fulfilling teaching careers.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We are committed to providing the highest quality exam preparation materials and support.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in the power of learning together and supporting each other\'s success.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about education and helping aspiring teachers achieve their dreams.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We continuously improve our platform with the latest educational technology.',
    },
  ];

  const team = [
    {
      name: 'Education Experts',
      description: 'Licensed teachers with years of classroom experience',
      count: '50+',
    },
    {
      name: 'Content Developers',
      description: 'Curriculum specialists and instructional designers',
      count: '25+',
    },
    {
      name: 'Student Support',
      description: 'Dedicated support team available 24/7',
      count: '15+',
    },
  ];

  const milestones = [
    { year: '2020', event: 'TeachCertPro founded with a mission to democratize teacher certification prep' },
    { year: '2021', event: 'Launched courses for 3 states, helped 5,000 teachers pass their exams' },
    { year: '2022', event: 'Expanded to 15 states, reached 25,000 students' },
    { year: '2023', event: 'Achieved 95% pass rate, recognized as top certification platform' },
    { year: '2024', event: 'Serving 50,000+ students nationwide with comprehensive state coverage' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6" strokeWidth={1.5} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About TeachCertPro
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              We're on a mission to help every aspiring teacher pass their certification exam
              and start making a difference in students' lives.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6">
              TeachCertPro was founded by a group of educators who experienced firsthand the challenges
              of teacher certification exams. We knew there had to be a better way to prepare.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Traditional test prep was either too expensive, too generic, or simply not effective.
              We set out to create a platform that would provide comprehensive, affordable, and
              personalized exam preparation for every aspiring teacher.
            </p>
            <p className="text-lg text-gray-600">
              Today, we're proud to serve over 50,000 students nationwide with a 95% pass rate.
              Our success is measured by the success of our students – the teachers who are now
              inspiring the next generation of learners.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="card p-8 text-center">
                <div className="text-5xl font-bold text-primary-600 mb-3">
                  {member.count}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Journey
          </h2>
          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <div key={milestone.year} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 pt-4">
                  <p className="text-lg text-gray-700">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Impact by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50,000+', label: 'Students Trained' },
              { value: '95%', label: 'Pass Rate' },
              { value: '15+', label: 'States Covered' },
              { value: '4.8/5', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful teachers who prepared with TeachCertPro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/states" variant="primary" size="lg">
              Browse Courses
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
