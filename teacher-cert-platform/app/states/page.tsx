'use client';

import { useState, useEffect } from 'react';
import { dataService, StateSummary, handleApiError, DataError } from '@/shared/services/data-service';
import StateSummaryCard from '@/components/data/StateSummaryCard';
import { Search, Filter, AlertCircle, RefreshCw, MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function StatesPage() {
  const [states, setStates] = useState<string[]>([]);
  const [summaries, setSummaries] = useState<StateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get available states
      const availableStates = await dataService.getStates();
      setStates(availableStates);

      // Load summaries for all states
      const summaryPromises = availableStates.map(state =>
        dataService.getStateSummary(state).catch(err => {
          console.warn(`Failed to load summary for ${state}:`, err);
          return null;
        })
      );

      const results = await Promise.all(summaryPromises);
      const validSummaries = results.filter((summary): summary is StateSummary => summary !== null);

      setSummaries(validSummaries);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
      console.error('Failed to load states:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSummaries = summaries.filter(summary =>
    summary.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    // In a real app, this would navigate to the state detail page
    window.location.href = `/states/${stateName.toLowerCase()}`;
  };

  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    // Sort by total objectives (descending), then by state name
    if (b.total_objectives !== a.total_objectives) {
      return b.total_objectives - a.total_objectives;
    }
    return a.state.localeCompare(b.state);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loading State Data...</h1>
            <p className="text-gray-600">Fetching teacher certification objectives from all available states.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Unable to Load Data</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadStates} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Teacher Certification by State
              </h1>
              <p className="text-gray-600">
                Explore certification objectives and requirements across {states.length} states
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by state name or abbreviation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{states.length}</div>
              <div className="text-sm text-gray-600">States Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summaries.reduce((sum, s) => sum + s.total_tests, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summaries.reduce((sum, s) => sum + s.total_objectives, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Objectives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {summaries.length > 0
                  ? Math.round(summaries.reduce((sum, s) => sum + s.average_confidence, 0) / summaries.length * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg. Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* States Grid */}
      <div className="container-custom py-8">
        {sortedSummaries.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No states found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'No state data is currently available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSummaries.map((summary) => (
              <StateSummaryCard
                key={summary.state}
                summary={summary}
                onClick={() => handleStateClick(summary.state)}
              />
            ))}
          </div>
        )}

        {/* Data Source Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About This Data</h3>
              <p className="text-blue-800 text-sm">
                Certification objectives are automatically discovered from official state education websites
                and supplemented with intelligent inference when official data is unavailable.
                Confidence scores indicate the reliability of each objective.
                Green indicates high confidence (verified sources), yellow indicates moderate confidence,
                and red indicates low confidence (inferred data).
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't See Your State?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're constantly adding new states and exams. Let us know which certification you're preparing for!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Request Your State
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
