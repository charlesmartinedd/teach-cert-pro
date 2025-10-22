import { Objective } from '@/shared/services/data-service';
import { getConfidenceColor, getConfidenceLabel } from '@/shared/services/data-service';
import { CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface ObjectivesCardProps {
  objectives: Objective[];
  testName: string;
  maxItems?: number;
}

export default function ObjectivesCard({ objectives, testName, maxItems = 5 }: ObjectivesCardProps) {
  const displayObjectives = objectives.slice(0, maxItems);
  const hasMore = objectives.length > maxItems;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{testName}</h3>
          <span className="text-sm text-gray-500">{objectives.length} objectives</span>
        </div>
        <p className="text-sm text-gray-600">
          {objectives.filter(obj => !obj.is_inferred).length} verified, {objectives.filter(obj => obj.is_inferred).length} inferred
        </p>
      </div>

      <div className="p-6 space-y-4">
        {displayObjectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {objective.is_inferred ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium mb-2">{objective.text}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getConfidenceColor(objective.confidence)}`}>
                  <span className="font-medium">{getConfidenceLabel(objective.confidence)}</span>
                  <span className="text-xs">({objective.confidence.toFixed(2)})</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <Info className="w-4 h-4" />
                  <span>{objective.validation_status}</span>
                </div>

                {objective.evidence_url && (
                  <a
                    href={objective.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Source</span>
                  </a>
                )}
              </div>

              {objective.rationale && (
                <p className="mt-2 text-sm text-gray-600 italic">
                  {objective.rationale}
                </p>
              )}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="text-center pt-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View {objectives.length - maxItems} more objectives →
            </button>
          </div>
        )}

        {objectives.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No objectives found for this test.</p>
          </div>
        )}
      </div>
    </div>
  );
}