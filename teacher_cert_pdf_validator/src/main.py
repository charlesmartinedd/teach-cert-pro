"""
Main orchestrator for teacher certification PDF validation system.
"""
import os
import sys
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from logger import StateLogger
from validator import PDFValidator
from searcher import PDFSearcher
from report_generator import ReportGenerator


# All 50 U.S. states
US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]


class TeacherCertPDFValidator:
    """Main orchestrator for the PDF validation system."""

    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)
        self.logs_dir = self.base_dir / "logs"
        self.results_dir = self.base_dir / "results"

        # Initialize components
        self.state_logger = StateLogger(str(self.logs_dir))
        self.validator = PDFValidator(timeout=10)
        self.searcher = PDFSearcher()
        self.report_gen = ReportGenerator(str(self.results_dir))

        # Results storage
        self.all_results = []

    def process_state(self, state_name: str) -> dict:
        """Process a single state: search, validate, record."""
        logger = self.state_logger.get_logger(state_name)
        logger.info(f"{'='*60}")
        logger.info(f"Starting processing for {state_name}")
        logger.info(f"{'='*60}")

        result = {
            'state': state_name,
            'pdf_found': False,
            'valid_pdf_url': None,
            'checked_links': [],
            'queries_used': [],
            'timestamp': datetime.now().isoformat()
        }

        try:
            # Step 1: Progressive search
            logger.info("Phase 1: Searching for PDF links...")
            all_urls = self.searcher.search_progressive(state_name, logger)

            queries = self.searcher.generate_queries(state_name)
            result['queries_used'] = queries

            logger.info(f"Total unique URLs collected: {len(all_urls)}")

            # Prioritize URLs with .pdf in them
            pdf_urls = [url for url in all_urls if '.pdf' in url.lower()]
            other_urls = [url for url in all_urls if '.pdf' not in url.lower()]
            ordered_urls = pdf_urls + other_urls

            if not ordered_urls:
                logger.warning("No URLs found in search results")
                self.state_logger.log_final_result(logger, False)
                return result

            # Step 2: Validate URLs
            logger.info(f"\nPhase 2: Validating {len(ordered_urls)} URLs...")

            for i, url in enumerate(ordered_urls, 1):
                logger.info(f"[{i}/{len(ordered_urls)}] Checking: {url[:80]}...")

                is_valid, reason = self.validator.is_valid_pdf(url)

                result['checked_links'].append({
                    'url': url,
                    'valid': is_valid,
                    'reason': reason
                })

                self.state_logger.log_validation(logger, url, is_valid, reason)

                if is_valid:
                    result['pdf_found'] = True
                    result['valid_pdf_url'] = url
                    self.state_logger.log_final_result(logger, True, url)
                    logger.info(f"{'='*60}")
                    return result

            # No valid PDF found
            logger.warning("All URLs validated, no valid PDFs found")
            self.state_logger.log_final_result(logger, False)

        except Exception as e:
            self.state_logger.log_error(logger, e, "during state processing")

        logger.info(f"{'='*60}\n")
        return result

    def run(self):
        """Run the complete validation for all 50 states."""
        print("\n" + "="*70)
        print("TEACHER CERTIFICATION PDF VALIDATOR")
        print("Processing all 50 U.S. States")
        print("="*70 + "\n")

        for i, state in enumerate(US_STATES, 1):
            print(f"\n[{i}/{len(US_STATES)}] Processing {state}...")
            result = self.process_state(state)
            self.all_results.append(result)

            # Save intermediate results
            self.report_gen.save_json(self.all_results, "intermediate_results.json")

        print("\n" + "="*70)
        print("GENERATING FINAL REPORTS")
        print("="*70 + "\n")

        # Generate all reports
        report_files = self.report_gen.save_all_reports(self.all_results)

        print("Reports generated:")
        for report_type, filepath in report_files.items():
            print(f"  - {report_type.upper()}: {filepath}")

        # Summary statistics
        found_count = sum(1 for r in self.all_results if r['pdf_found'])
        print(f"\n{'='*70}")
        print(f"FINAL SUMMARY")
        print(f"{'='*70}")
        print(f"Total States: {len(US_STATES)}")
        print(f"PDFs Found: {found_count} ✓")
        print(f"Not Found: {len(US_STATES) - found_count} ✗")
        print(f"Success Rate: {(found_count/len(US_STATES)*100):.1f}%")
        print(f"{'='*70}\n")


def main():
    """Entry point."""
    # Determine project directory
    current_file = Path(__file__).resolve()
    project_dir = current_file.parent.parent

    print(f"Project directory: {project_dir}")

    # Create and run validator
    validator = TeacherCertPDFValidator(str(project_dir))
    validator.run()


if __name__ == "__main__":
    main()
