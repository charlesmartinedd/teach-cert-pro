import Link from 'next/link';
import { User, BookOpen, Award, TrendingUp, Settings, CreditCard, Bell } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    memberSince: 'January 2024',
    plan: 'All-Access Pass',
  };

  const enrolledCourses = [
    {
      id: 'cset-multiple-subjects',
      name: 'CSET Multiple Subjects',
      state: 'California',
      progress: 65,
      modulesCompleted: 3,
      totalModules: 5,
      lastAccessed: '2 hours ago',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    },
    {
      id: 'nystce-eas',
      name: 'NYSTCE EAS',
      state: 'New York',
      progress: 30,
      modulesCompleted: 1,
      totalModules: 4,
      lastAccessed: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
    },
  ];

  const achievements = [
    { icon: Award, title: 'Quick Learner', description: 'Completed first module in under 3 days', earned: true },
    { icon: TrendingUp, title: 'Practice Pro', description: 'Completed 100 practice questions', earned: true },
    { icon: BookOpen, title: 'Dedicated Student', description: '7-day study streak', earned: true },
    { icon: Award, title: 'High Scorer', description: 'Scored 90%+ on module quiz', earned: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-2">Member since {user.memberSince}</p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>My Courses</span>
                </Link>
                <Link
                  href="/account/achievements"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                >
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/account/billing"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Billing</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Active Courses</span>
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">2</div>
                <p className="text-sm text-gray-600 mt-1">In progress</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Modules Completed</span>
                  <Award className="w-5 h-5 text-success-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">4</div>
                <p className="text-sm text-gray-600 mt-1">Great progress!</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Study Streak</span>
                  <TrendingUp className="w-5 h-5 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">7</div>
                <p className="text-sm text-gray-600 mt-1">Days in a row</p>
              </div>
            </div>

            {/* Current Plan */}
            <div className="card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {user.plan}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lifetime access to all courses
                  </p>
                </div>
                <Button href="/account/billing" variant="outline" size="md">
                  Manage Plan
                </Button>
              </div>
            </div>

            {/* My Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Courses
                </h2>
                <Button href="/states" variant="outline" size="md">
                  Browse More
                </Button>
              </div>

              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="card p-6 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start gap-6">
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                              {course.state}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">
                              {course.name}
                            </h3>
                          </div>
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {course.lastAccessed}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>
                              Module {course.modulesCompleted} of {course.totalModules} completed
                            </span>
                            <span className="font-semibold text-primary-600">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          href={`/states/california/${course.id}`}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                          Continue Learning
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Achievements
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={idx}
                      className={`card p-4 ${
                        achievement.earned ? 'bg-white' : 'bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            achievement.earned
                              ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
