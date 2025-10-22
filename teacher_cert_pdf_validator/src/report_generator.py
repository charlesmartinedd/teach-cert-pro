"""
Report generation for teacher certification PDF validation results.
"""
import json
import csv
from datetime import datetime
from pathlib import Path
from typing import List, Dict


class ReportGenerator:
    """Generates structured reports from validation results."""

    def __init__(self, results_dir: str):
        self.results_dir = Path(results_dir)
        self.results_dir.mkdir(parents=True, exist_ok=True)

    def save_json(self, results: List[Dict], filename: str = "all_states_valid_pdfs.json"):
        """Save results as JSON."""
        filepath = self.results_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        return filepath

    def save_csv(self, results: List[Dict], filename: str = "all_states_valid_pdfs.csv"):
        """Save results as CSV."""
        filepath = self.results_dir / filename

        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['State', 'PDF Found', 'Valid PDF URL', 'Queries Used', 'Links Checked', 'Timestamp'])

            for result in results:
                writer.writerow([
                    result['state'],
                    'Yes' if result['pdf_found'] else 'No',
                    result.get('valid_pdf_url', 'N/A'),
                    len(result.get('queries_used', [])),
                    len(result.get('checked_links', [])),
                    result.get('timestamp', '')
                ])

        return filepath

    def generate_markdown_summary(self, results: List[Dict], filename: str = "research_summary.md"):
        """Generate a readable Markdown summary report."""
        filepath = self.results_dir / filename

        found_count = sum(1 for r in results if r['pdf_found'])
        not_found_count = len(results) - found_count

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("# Teacher Certification PDF Validation Report\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            # Summary statistics
            f.write("## Summary Statistics\n\n")
            f.write(f"- **Total States Processed:** {len(results)}\n")
            f.write(f"- **States with Valid PDFs:** {found_count} ✓\n")
            f.write(f"- **States without PDFs:** {not_found_count} ✗\n")
            f.write(f"- **Success Rate:** {(found_count/len(results)*100):.1f}%\n\n")

            # States with PDFs found
            f.write("## ✅ States with Valid PDFs Found\n\n")
            found_results = [r for r in results if r['pdf_found']]

            if found_results:
                for result in sorted(found_results, key=lambda x: x['state']):
                    f.write(f"### {result['state']}\n")
                    f.write(f"- **PDF URL:** {result['valid_pdf_url']}\n")
                    f.write(f"- **Queries Used:** {len(result['queries_used'])}\n")
                    f.write(f"- **Links Checked:** {len(result['checked_links'])}\n")
                    f.write(f"- **Timestamp:** {result['timestamp']}\n\n")
            else:
                f.write("*None*\n\n")

            # States without PDFs
            f.write("## ❌ States without Valid PDFs\n\n")
            not_found_results = [r for r in results if not r['pdf_found']]

            if not_found_results:
                for result in sorted(not_found_results, key=lambda x: x['state']):
                    f.write(f"### {result['state']}\n")
                    f.write(f"- **Queries Used:** {len(result['queries_used'])}\n")
                    f.write(f"- **Links Checked:** {len(result['checked_links'])}\n")
                    f.write(f"- **Timestamp:** {result['timestamp']}\n\n")
            else:
                f.write("*None*\n\n")

            # Detailed query information
            f.write("## Query Details\n\n")
            total_queries = sum(len(r['queries_used']) for r in results)
            total_links = sum(len(r['checked_links']) for r in results)
            f.write(f"- **Total Search Queries Executed:** {total_queries}\n")
            f.write(f"- **Total Links Validated:** {total_links}\n")
            f.write(f"- **Average Queries per State:** {total_queries/len(results):.1f}\n")
            f.write(f"- **Average Links Checked per State:** {total_links/len(results):.1f}\n\n")

        return filepath

    def save_all_reports(self, results: List[Dict]):
        """Generate all report formats."""
        json_file = self.save_json(results)
        csv_file = self.save_csv(results)
        md_file = self.generate_markdown_summary(results)

        return {
            'json': json_file,
            'csv': csv_file,
            'markdown': md_file
        }
