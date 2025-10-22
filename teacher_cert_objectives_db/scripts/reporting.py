"""
Report generation for teacher certification objectives database.
"""
import json
import csv
from pathlib import Path
from datetime import datetime
from typing import List, Dict


class ReportGenerator:
    """Generates various output formats and reports."""

    def __init__(self, db, output_dir: str):
        self.db = db
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_state_jsonl(self, state_id: int, state_name: str):
        """Generate per-state JSONL file."""
        data_dir = self.output_dir.parent / 'data'
        data_dir.mkdir(parents=True, exist_ok=True)

        jsonl_path = data_dir / f"{state_name.replace(' ', '_')}.jsonl"

        tests = self.db.get_state_tests(state_id)

        with open(jsonl_path, 'w', encoding='utf-8') as f:
            for test in tests:
                objectives = self.db.get_test_objectives(test['id'])

                record = {
                    'state': state_name,
                    'test': {
                        'test_name': test['test_name'],
                        'test_code': test['test_code'],
                        'test_system': test['test_system'],
                        'subject_area': test['subject_area'],
                        'grade_band': test['grade_band'],
                        'provider': test['provider'],
                        'official_source_url': test['official_source_url'],
                        'source_last_updated': test['source_last_updated'],
                        'scraped_at': test['scraped_at']
                    },
                    'objectives': [
                        {
                            'index': obj['objective_index'],
                            'text': obj['objective_text'],
                            'evidence_url': obj['evidence_url'],
                            'is_inferred': bool(obj['is_inferred']),
                            'confidence': obj['confidence'],
                            'rationale': obj['rationale'],
                            'validation_status': obj['validation_status']
                        }
                        for obj in objectives
                    ]
                }

                f.write(json.dumps(record) + '\n')

    def generate_aggregated_json(self):
        """Generate complete JSON with all states."""
        output_file = self.output_dir / 'all_states_objectives.json'

        all_data = {}

        states = self.db.get_all_states()

        for state in states:
            state_name = state['name']
            state_id = state['id']

            tests = self.db.get_state_tests(state_id)

            state_data = {
                'state_info': {
                    'name': state_name,
                    'abbrev': state['abbrev'],
                    'last_refresh': state['last_full_refresh']
                },
                'tests': []
            }

            for test in tests:
                objectives = self.db.get_test_objectives(test['id'])

                test_data = {
                    'test_name': test['test_name'],
                    'test_code': test['test_code'],
                    'test_system': test['test_system'],
                    'subject_area': test['subject_area'],
                    'grade_band': test['grade_band'],
                    'provider': test['provider'],
                    'official_source_url': test['official_source_url'],
                    'objectives_count': len(objectives),
                    'objectives': [
                        {
                            'index': obj['objective_index'],
                            'text': obj['objective_text'],
                            'is_inferred': bool(obj['is_inferred']),
                            'confidence': obj['confidence'],
                            'validation_status': obj['validation_status']
                        }
                        for obj in objectives
                    ]
                }

                state_data['tests'].append(test_data)

            all_data[state_name] = state_data

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)

        return output_file

    def generate_aggregated_csv(self):
        """Generate CSV summary (one row per test)."""
        output_file = self.output_dir / 'all_states_objectives.csv'

        states = self.db.get_all_states()

        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'State', 'State Abbrev', 'Test System', 'Test Name', 'Test Code',
                'Subject Area', 'Grade Band', 'Provider', 'Source URL',
                'Total Objectives', 'Verified Objectives', 'Inferred Objectives',
                'Avg Confidence', 'Last Updated'
            ])

            for state in states:
                tests = self.db.get_state_tests(state['id'])

                for test in tests:
                    objectives = self.db.get_test_objectives(test['id'])

                    verified = sum(1 for obj in objectives if not obj['is_inferred'])
                    inferred = sum(1 for obj in objectives if obj['is_inferred'])
                    avg_conf = sum(obj['confidence'] for obj in objectives) / len(objectives) if objectives else 0

                    writer.writerow([
                        state['name'],
                        state['abbrev'],
                        test['test_system'],
                        test['test_name'],
                        test['test_code'] or 'N/A',
                        test['subject_area'] or 'N/A',
                        test['grade_band'] or 'N/A',
                        test['provider'] or 'N/A',
                        test['official_source_url'] or 'N/A',
                        len(objectives),
                        verified,
                        inferred,
                        f"{avg_conf:.2f}",
                        test['source_last_updated'] or 'Unknown'
                    ])

        return output_file

    def generate_validation_summary(self):
        """Generate validation summary CSV."""
        output_file = self.output_dir / 'validation_summary.csv'

        states = self.db.get_all_states()

        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'State', 'Tests Found', 'Total Objectives',
                'Verified Objectives', 'Inferred Objectives',
                'Avg Confidence', 'Status'
            ])

            for state in states:
                tests = self.db.get_state_tests(state['id'])

                all_objectives = []
                for test in tests:
                    all_objectives.extend(self.db.get_test_objectives(test['id']))

                verified = sum(1 for obj in all_objectives if not obj['is_inferred'])
                inferred = sum(1 for obj in all_objectives if obj['is_inferred'])
                avg_conf = sum(obj['confidence'] for obj in all_objectives) / len(all_objectives) if all_objectives else 0

                status = 'Complete' if all_objectives else 'Partial'
                if inferred > verified:
                    status = 'Mostly Inferred'

                writer.writerow([
                    state['name'],
                    len(tests),
                    len(all_objectives),
                    verified,
                    inferred,
                    f"{avg_conf:.2f}",
                    status
                ])

        return output_file

    def generate_coverage_report(self):
        """Generate comprehensive coverage summary in Markdown."""
        report_dir = self.output_dir.parent / 'reports'
        report_dir.mkdir(parents=True, exist_ok=True)

        output_file = report_dir / 'coverage_summary.md'

        states = self.db.get_all_states()
        stats = self.db.get_statistics()

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# Teacher Certification Objectives Database - Coverage Report\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            # Overall Statistics
            f.write("## Overall Statistics\n\n")
            f.write(f"- **Total States Processed:** {stats['total_states']}\n")
            f.write(f"- **Total Tests Found:** {stats['total_tests']}\n")
            f.write(f"- **Total Objectives:** {stats['total_objectives']}\n")
            f.write(f"- **Verified Objectives:** {stats['verified_objectives']} ({stats['verified_objectives']/stats['total_objectives']*100:.1f}%)\n")
            f.write(f"- **Inferred Objectives:** {stats['inferred_objectives']} ({stats['inferred_objectives']/stats['total_objectives']*100:.1f}%)\n\n")

            # Per-State Coverage
            f.write("## Per-State Coverage\n\n")
            f.write("| State | Tests | Objectives | Verified | Inferred | Status |\n")
            f.write("|-------|-------|------------|----------|----------|--------|\n")

            for state in states:
                tests = self.db.get_state_tests(state['id'])

                all_objectives = []
                for test in tests:
                    all_objectives.extend(self.db.get_test_objectives(test['id']))

                verified = sum(1 for obj in all_objectives if not obj['is_inferred'])
                inferred = sum(1 for obj in all_objectives if obj['is_inferred'])

                status = '✓ Complete' if all_objectives else '⚠ Partial'
                if not tests:
                    status = '✗ No Data'

                f.write(f"| {state['name']} | {len(tests)} | {len(all_objectives)} | {verified} | {inferred} | {status} |\n")

            # Data Quality Insights
            f.write("\n## Data Quality Insights\n\n")

            high_conf_states = []
            low_conf_states = []

            for state in states:
                tests = self.db.get_state_tests(state['id'])
                all_objectives = []
                for test in tests:
                    all_objectives.extend(self.db.get_test_objectives(test['id']))

                if all_objectives:
                    avg_conf = sum(obj['confidence'] for obj in all_objectives) / len(all_objectives)
                    if avg_conf >= 0.8:
                        high_conf_states.append(state['name'])
                    elif avg_conf < 0.6:
                        low_conf_states.append(state['name'])

            f.write(f"**States with High Confidence Data (≥0.8):** {len(high_conf_states)}\n\n")
            if high_conf_states:
                for s in high_conf_states[:10]:
                    f.write(f"- {s}\n")

            f.write(f"\n**States Needing Manual Review (<0.6 confidence):** {len(low_conf_states)}\n\n")
            if low_conf_states:
                for s in low_conf_states[:10]:
                    f.write(f"- {s}\n")

            # Recommendations
            f.write("\n## Recommendations\n\n")
            f.write("1. **Priority Review:** Focus on states with low confidence scores\n")
            f.write("2. **Source Verification:** Validate URLs and update broken links\n")
            f.write("3. **Content Enhancement:** Seek official test blueprints for inferred objectives\n")
            f.write("4. **Regular Updates:** Re-scrape state DOE sites quarterly\n\n")

        return output_file

    def generate_all_reports(self):
        """Generate all output formats."""
        print("\nGenerating all reports...")

        # Per-state JSONL files
        states = self.db.get_all_states()
        for state in states:
            self.generate_state_jsonl(state['id'], state['name'])

        # Aggregated outputs
        json_file = self.generate_aggregated_json()
        csv_file = self.generate_aggregated_csv()
        validation_file = self.generate_validation_summary()
        coverage_file = self.generate_coverage_report()

        return {
            'json': json_file,
            'csv': csv_file,
            'validation': validation_file,
            'coverage': coverage_file
        }
