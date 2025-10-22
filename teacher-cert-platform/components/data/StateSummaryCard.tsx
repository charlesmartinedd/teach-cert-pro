import { StateSummary } from '@/shared/services/data-service';
import { MapPin, BookOpen, TrendingUp, Calendar } from 'lucide-react';

interface StateSummaryCardProps {
  summary: StateSummary;
  onClick?: () => void;
}

export default function StateSummaryCard({ summary, onClick }: StateSummaryCardProps) {
  const confidenceColor = summary.average_confidence >= 0.7 ? 'text-green-600' :
                          summary.average_confidence >= 0.5 ? 'text-yellow-600' : 'text-red-600';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{summary.state}</h3>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {summary.abbreviation}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{summary.total_tests}</div>
            <div className="text-sm text-gray-600">Tests</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{summary.total_objectives}</div>
            <div className="text-sm text-gray-600">Objectives</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Avg. Confidence</span>
            </div>
            <span className={`text-sm font-semibold ${confidenceColor}`}>
              {(summary.average_confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Last Updated</span>
            </div>
            <span className="text-sm text-gray-700">{formatDate(summary.last_updated)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">
                {summary.total_objectives > 0 ? 'View Objectives' : 'No Data Available'}
              </span>
            </div>
            <div className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}