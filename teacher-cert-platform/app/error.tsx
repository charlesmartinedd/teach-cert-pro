'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We encountered an unexpected error while loading this page.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 mb-6">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            href="/"
            variant="outline"
            size="lg"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If this problem persists, please{' '}
          <a href="/contact" className="text-primary-600 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
