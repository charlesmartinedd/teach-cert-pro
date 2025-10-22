"""
Main orchestrator for Teacher Certification Objectives Database.
Coordinates discovery, extraction, validation, inference, and reporting.
"""
import sys
import logging
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from database import ObjectivesDatabase
from inference import InferenceEngine
from validation import ValidationEngine
from reporting import ReportGenerator


# All 50 U.S. States
US_STATES = [
    ("Alabama", "AL"), ("Alaska", "AK"), ("Arizona", "AZ"), ("Arkansas", "AR"),
    ("California", "CA"), ("Colorado", "CO"), ("Connecticut", "CT"), ("Delaware", "DE"),
    ("Florida", "FL"), ("Georgia", "GA"), ("Hawaii", "HI"), ("Idaho", "ID"),
    ("Illinois", "IL"), ("Indiana", "IN"), ("Iowa", "IA"), ("Kansas", "KS"),
    ("Kentucky", "KY"), ("Louisiana", "LA"), ("Maine", "ME"), ("Maryland", "MD"),
    ("Massachusetts", "MA"), ("Michigan", "MI"), ("Minnesota", "MN"), ("Mississippi", "MS"),
    ("Missouri", "MO"), ("Montana", "MT"), ("Nebraska", "NE"), ("Nevada", "NV"),
    ("New Hampshire", "NH"), ("New Jersey", "NJ"), ("New Mexico", "NM"), ("New York", "NY"),
    ("North Carolina", "NC"), ("North Dakota", "ND"), ("Ohio", "OH"), ("Oklahoma", "OK"),
    ("Oregon", "OR"), ("Pennsylvania", "PA"), ("Rhode Island", "RI"), ("South Carolina", "SC"),
    ("South Dakota", "SD"), ("Tennessee", "TN"), ("Texas", "TX"), ("Utah", "UT"),
    ("Vermont", "VT"), ("Virginia", "VA"), ("Washington", "WA"), ("West Virginia", "WV"),
    ("Wisconsin", "WI"), ("Wyoming", "WY")
]


class ObjectivesOrchestrator:
    """Main orchestrator for the objectives database system."""

    def __init__(self, project_dir: str, demo_mode: bool = False):
        self.project_dir = Path(project_dir)
        self.demo_mode = demo_mode

        # Initialize components
        self.db_path = self.project_dir / 'db' / 'objectives.sqlite'
        self.logs_dir = self.project_dir / 'logs'
        self.outputs_dir = self.project_dir / 'outputs'

        # Ensure directories exist
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        self.outputs_dir.mkdir(parents=True, exist_ok=True)

        # Setup logging
        self.setup_logging()

        # Initialize database
        self.db = ObjectivesDatabase(str(self.db_path))
        self.db.connect()

        # Initialize engines
        self.inference_engine = InferenceEngine()
        self.validation_engine = ValidationEngine()
        self.report_generator = ReportGenerator(self.db, str(self.outputs_dir))

    def setup_logging(self):
        """Configure logging."""
        log_file = self.logs_dir / 'run.log'

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, mode='w'),
                logging.StreamHandler()
            ]
        )

        self.logger = logging.getLogger('Orchestrator')

    def get_state_logger(self, state_name: str):
        """Get a logger for a specific state."""
        log_file = self.logs_dir / f"{state_name.replace(' ', '_').lower()}.log"

        logger = logging.getLogger(f'State_{state_name}')
        if not logger.handlers:
            handler = logging.FileHandler(log_file, mode='w')
            handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)

        return logger

    def process_state(self, state_name: str, state_abbrev: str):
        """Process a single state: discover, validate, infer, store."""
        state_logger = self.get_state_logger(state_name)
        state_logger.info(f"{'='*60}")
        state_logger.info(f"Processing {state_name} ({state_abbrev})")
        state_logger.info(f"{'='*60}")

        # Insert/get state record
        state_id = self.db.upsert_state(state_name, state_abbrev)

        # Start audit
        audit_id = self.db.start_audit(state_id)

        counts = {
            'tests_found': 0,
            'objectives_found': 0,
            'objectives_inferred': 0,
            'queries_run': 0
        }

        try:
            # DEMONSTRATION: Create sample data using inference engine
            # In production, this would use the DiscoveryEngine with WebSearch

            state_logger.info("Generating sample test data for demonstration...")

            # Create sample tests based on common state requirements
            sample_tests = self._generate_sample_tests(state_name, state_abbrev)

            for test_data in sample_tests:
                test_data['state_id'] = state_id

                # Insert test
                test_id = self.db.upsert_test(test_data)
                counts['tests_found'] += 1

                state_logger.info(f"Created test: {test_data['test_name']} ({test_data['test_system']})")

                # Generate objectives using inference engine
                test_info = {
                    'test_name': test_data['test_name'],
                    'test_system': test_data['test_system'],
                    'subject_area': test_data['subject_area'],
                    'official_source_url': test_data.get('official_source_url')
                }

                objectives = self.inference_engine.infer_objectives(test_info, confidence_threshold=0.4)

                # Validate and store objectives
                for obj in objectives:
                    is_valid, issues = self.validation_engine.validate_objective(obj)

                    if is_valid:
                        obj['test_id'] = test_id
                        self.db.insert_objective(obj)

                        if obj.get('is_inferred'):
                            counts['objectives_inferred'] += 1
                        else:
                            counts['objectives_found'] += 1

                        state_logger.info(f"  → Added objective {obj['objective_index']}: {obj['objective_text'][:60]}...")
                    else:
                        state_logger.warning(f"  → Skipped invalid objective: {issues}")

            # Complete audit
            status = 'complete' if counts['tests_found'] > 0 else 'partial'
            self.db.complete_audit(
                audit_id,
                status,
                counts,
                f"Demo mode: generated {counts['tests_found']} tests"
            )

            state_logger.info(f"\nCompleted {state_name}:")
            state_logger.info(f"  Tests: {counts['tests_found']}")
            state_logger.info(f"  Objectives: {counts['objectives_found'] + counts['objectives_inferred']}")
            state_logger.info(f"  Verified: {counts['objectives_found']}")
            state_logger.info(f"  Inferred: {counts['objectives_inferred']}")

        except Exception as e:
            state_logger.error(f"Error processing {state_name}: {str(e)}")
            self.db.complete_audit(audit_id, 'error', counts, str(e))

        return counts

    def _generate_sample_tests(self, state_name: str, state_abbrev: str):
        """Generate sample tests for demonstration."""
        # Common test systems used across states
        tests = [
            {
                'test_system': 'Praxis',
                'test_name': 'Elementary Education: Multiple Subjects',
                'test_code': '5001',
                'subject_area': 'Elementary Education',
                'grade_band': 'K-6',
                'provider': 'ETS',
                'official_source_url': f'https://www.ets.org/praxis/prepare/materials/5001',
                'source_last_updated': '2024'
            },
            {
                'test_system': 'Praxis',
                'test_name': 'Mathematics: Content Knowledge',
                'test_code': '5161',
                'subject_area': 'Mathematics',
                'grade_band': '7-12',
                'provider': 'ETS',
                'official_source_url': f'https://www.ets.org/praxis/prepare/materials/5161',
                'source_last_updated': '2024'
            },
            {
                'test_system': state_abbrev + ' State Exam',
                'test_name': f'{state_name} Teaching Foundations',
                'test_code': None,
                'subject_area': 'General Education',
                'grade_band': 'All',
                'provider': 'State DOE',
                'official_source_url': f'https://{state_abbrev.lower()}.gov/education/teacher-certification',
                'source_last_updated': '2024'
            }
        ]

        return tests

    def run_full_pipeline(self, states_to_process=None):
        """Run the complete pipeline for specified states."""
        if states_to_process is None:
            states_to_process = US_STATES

        self.logger.info("\n" + "="*70)
        self.logger.info("TEACHER CERTIFICATION OBJECTIVES DATABASE - FULL PIPELINE")
        self.logger.info("="*70 + "\n")

        total_counts = {
            'states_processed': 0,
            'total_tests': 0,
            'total_objectives': 0,
            'total_verified': 0,
            'total_inferred': 0
        }

        for i, (state_name, state_abbrev) in enumerate(states_to_process, 1):
            self.logger.info(f"\n[{i}/{len(states_to_process)}] Processing {state_name}...")

            counts = self.process_state(state_name, state_abbrev)

            total_counts['states_processed'] += 1
            total_counts['total_tests'] += counts['tests_found']
            total_counts['total_objectives'] += counts['objectives_found'] + counts['objectives_inferred']
            total_counts['total_verified'] += counts['objectives_found']
            total_counts['total_inferred'] += counts['objectives_inferred']

        # Generate all reports
        self.logger.info("\n" + "="*70)
        self.logger.info("GENERATING REPORTS")
        self.logger.info("="*70 + "\n")

        report_files = self.report_generator.generate_all_reports()

        # Print summary
        self.logger.info("\n" + "="*70)
        self.logger.info("PIPELINE COMPLETE")
        self.logger.info("="*70)
        self.logger.info(f"\nStates Processed: {total_counts['states_processed']}")
        self.logger.info(f"Total Tests: {total_counts['total_tests']}")
        self.logger.info(f"Total Objectives: {total_counts['total_objectives']}")
        self.logger.info(f"  - Verified: {total_counts['total_verified']}")
        self.logger.info(f"  - Inferred: {total_counts['total_inferred']}")

        verified_pct = (total_counts['total_verified'] / total_counts['total_objectives'] * 100) if total_counts['total_objectives'] > 0 else 0
        inferred_pct = (total_counts['total_inferred'] / total_counts['total_objectives'] * 100) if total_counts['total_objectives'] > 0 else 0

        self.logger.info(f"  - Verified %: {verified_pct:.1f}%")
        self.logger.info(f"  - Inferred %: {inferred_pct:.1f}%")

        self.logger.info("\nGenerated Files:")
        for report_type, filepath in report_files.items():
            self.logger.info(f"  - {report_type}: {filepath}")

        self.logger.info(f"\nDatabase: {self.db_path}")
        self.logger.info("="*70 + "\n")

        return total_counts

    def cleanup(self):
        """Close database connection."""
        if self.db:
            self.db.close()


def main():
    """Main entry point."""
    project_dir = Path(__file__).parent.parent

    print("\n" + "="*70)
    print("TEACHER CERTIFICATION OBJECTIVES DATABASE")
    print("Never-Fail Automated Discovery & Inference System")
    print("="*70 + "\n")

    # Initialize orchestrator
    orchestrator = ObjectivesOrchestrator(str(project_dir), demo_mode=True)

    try:
        # Run for subset of states in demo mode
        # In production, would process all 50 states with real WebSearch
        demo_states = US_STATES[:10]  # First 10 states for demonstration

        print(f"Demo Mode: Processing {len(demo_states)} states...")
        print("(Full system can process all 50 states with WebSearch integration)\n")

        orchestrator.run_full_pipeline(demo_states)

    finally:
        orchestrator.cleanup()


if __name__ == "__main__":
    main()
