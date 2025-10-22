import { Check, Star, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PricingPage() {
  const plans = [
    {
      name: 'Single Exam',
      price: 99,
      period: 'one-time',
      description: 'Perfect for preparing for one certification exam',
      features: [
        'Access to 1 complete exam course',
        '30+ comprehensive lessons',
        '500+ practice questions with explanations',
        'Progress tracking and analytics',
        'Downloadable study materials',
        'Mobile-friendly platform',
        'Lifetime access to course',
        '14-day money-back guarantee',
      ],
      popular: false,
      cta: 'Get Started',
    },
    {
      name: 'All-Access Pass',
      price: 249,
      period: 'one-time',
      description: 'Best value for multiple exams or changing certifications',
      features: [
        'Access to ALL exam courses',
        'Unlimited courses across all states',
        '2000+ practice questions',
        'Priority support',
        'Exclusive study groups',
        'Early access to new courses',
        'Progress tracking across all courses',
        'Downloadable study materials',
        'Mobile-friendly platform',
        'Lifetime access to all current and future courses',
        '14-day money-back guarantee',
      ],
      popular: true,
      cta: 'Get All-Access',
      badge: 'Most Popular',
    },
    {
      name: 'Group/Institution',
      price: null,
      period: 'custom',
      description: 'For schools, districts, and training organizations',
      features: [
        'Volume pricing for 10+ licenses',
        'Dedicated account manager',
        'Custom reporting and analytics',
        'Onboarding and training support',
        'API access for LMS integration',
        'White-label options available',
        'Flexible payment terms',
        'Priority feature requests',
      ],
      popular: false,
      cta: 'Contact Sales',
    },
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for institutional purchases.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! We offer a 14-day money-back guarantee. If you\'re not satisfied with our courses, contact us within 14 days of purchase for a full refund.',
    },
    {
      question: 'How long do I have access to the courses?',
      answer: 'You get lifetime access! Once you purchase a course, you can access it anytime, anywhere, for as long as you need. All updates and improvements are included free.',
    },
    {
      question: 'Can I switch to a different exam after purchasing?',
      answer: 'With the Single Exam plan, you can contact our support team within 7 days to switch to a different exam at no extra cost. The All-Access Pass gives you access to all exams automatically.',
    },
    {
      question: 'Do you offer discounts for students or groups?',
      answer: 'Yes! We offer 20% off for verified students and educators. For groups of 10 or more, please contact our sales team for volume pricing.',
    },
    {
      question: 'Are the courses updated for 2025 exam formats?',
      answer: 'Absolutely! Our courses are regularly updated to reflect the latest exam formats, content, and standards. You\'ll receive all updates automatically at no additional cost.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Invest in your teaching career with affordable, comprehensive exam preparation
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 flex flex-col relative ${
                  plan.popular ? 'ring-2 ring-primary-600 shadow-2xl scale-105' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    {plan.price ? (
                      <>
                        <span className="text-5xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {plan.period}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href={plan.price ? '/login' : '/contact'}
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success-600" />
                <span>50,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success-600" />
                <span>95% Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Pass Your Exam?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful teachers who prepared with TeachCertPro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/states" variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Browse Courses
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
