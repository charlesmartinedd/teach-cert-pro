/**
 * Data service for connecting to the TeachCertPro API
 * Handles all backend communication and data transformation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Objective {
  index: number;
  text: string;
  evidence_url?: string;
  is_inferred: boolean;
  confidence: number;
  rationale: string;
  validation_status: string;
}

export interface TestInfo {
  test_name: string;
  test_code?: string;
  test_system: string;
  subject_area: string;
  grade_band: string;
  provider: string;
  official_source_url?: string;
  source_last_updated?: string;
  scraped_at: string;
}

export interface StateTestData {
  state: string;
  test: TestInfo;
  objectives: Objective[];
}

export interface StateSummary {
  state: string;
  abbreviation: string;
  total_tests: number;
  total_objectives: number;
  average_confidence: number;
  last_updated: string;
}

export interface SearchResult {
  state: string;
  test: TestInfo;
  matching_objectives: Objective[];
  match_count: number;
}

export interface SearchResponse {
  query: string;
  filters: {
    state?: string;
    subject?: string;
    min_confidence?: number;
  };
  total_results: number;
  results: SearchResult[];
}

export interface OverviewStats {
  total_states: number;
  total_tests: number;
  total_objectives: number;
  average_confidence: number;
  data_quality_distribution: {
    "high_confidence (>0.8)": number;
    "medium_confidence (0.5-0.8)": number;
    "low_confidence (<0.5)": number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Get all available states
  async getStates(): Promise<string[]> {
    return this.request<string[]>('/states');
  }

  // Get all test data for a specific state
  async getStateData(stateName: string): Promise<StateTestData[]> {
    return this.request<StateTestData[]>(`/states/${encodeURIComponent(stateName)}`);
  }

  // Get summary statistics for a state
  async getStateSummary(stateName: string): Promise<StateSummary> {
    return this.request<StateSummary>(`/states/${encodeURIComponent(stateName)}/summary`);
  }

  // Search objectives with filters
  async searchObjectives(params: {
    query: string;
    state?: string;
    subject?: string;
    min_confidence?: number;
  }): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.query);

    if (params.state) searchParams.append('state', params.state);
    if (params.subject) searchParams.append('subject', params.subject);
    if (params.min_confidence) searchParams.append('min_confidence', params.min_confidence.toString());

    return this.request<SearchResponse>(`/search?${searchParams.toString()}`);
  }

  // Get overview statistics across all states
  async getOverviewStats(): Promise<OverviewStats> {
    return this.request<OverviewStats>('/stats/overview');
  }

  // Health check
  async healthCheck(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/');
  }
}

export const dataService = new ApiService();

// Utility functions for data transformation
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-600 bg-green-50';
  if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
  if (confidence >= 0.4) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.8) return 'High Confidence';
  if (confidence >= 0.6) return 'Medium Confidence';
  if (confidence >= 0.4) return 'Low Confidence';
  return 'Very Low Confidence';
};

export const formatTestName = (test: TestInfo): string => {
  if (test.test_code) {
    return `${test.test_name} (${test.test_code})`;
  }
  return test.test_name;
};

export const formatGradeBand = (gradeBand: string): string => {
  if (gradeBand === 'All') return 'All Grades';
  if (gradeBand === 'K-12') return 'All Grades';
  return gradeBand;
};

// Error handling utilities
export class DataError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DataError';
  }
}

export const handleApiError = (error: unknown): DataError => {
  if (error instanceof DataError) return error;

  if (error instanceof Error) {
    if (error.message.includes('failed')) {
      return new DataError('Unable to connect to the server. Please try again later.', 'NETWORK_ERROR');
    }
    return new DataError(error.message, 'UNKNOWN_ERROR');
  }

  return new DataError('An unexpected error occurred', 'UNKNOWN_ERROR');
};