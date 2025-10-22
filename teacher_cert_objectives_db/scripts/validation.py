"""
Validation engine for teacher certification objectives data.
"""
import re
import requests
from typing import Dict, Tuple, List
from urllib.parse import urlparse


class ValidationEngine:
    """Validates objectives, tests, and data quality."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def validate_source_url(self, url: str) -> Tuple[bool, str]:
        """
        Validate that a source URL is accessible and authoritative.

        Returns:
            (is_valid: bool, reason: str)
        """
        if not url:
            return False, "No URL provided"

        try:
            # Check URL format
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                return False, "Invalid URL format"

            # Check if authoritative domain
            if not self._is_authoritative_domain(parsed.netloc):
                return False, f"Non-authoritative domain: {parsed.netloc}"

            # Check if URL resolves
            response = self.session.head(url, timeout=10, allow_redirects=True)

            if response.status_code == 200:
                return True, "Valid and accessible"
            elif response.status_code == 404:
                return False, "URL not found (404)"
            else:
                return False, f"HTTP {response.status_code}"

        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except requests.exceptions.ConnectionError:
            return False, "Connection failed"
        except Exception as e:
            return False, f"Error: {str(e)[:50]}"

    def validate_test_structure(self, test_data: Dict) -> Tuple[bool, List[str]]:
        """
        Validate that test data has required fields and structure.

        Returns:
            (is_valid: bool, issues: List[str])
        """
        issues = []

        # Required fields
        required = ['test_name', 'test_system', 'official_source_url']
        for field in required:
            if not test_data.get(field):
                issues.append(f"Missing required field: {field}")

        # Test name should be substantive
        if test_data.get('test_name') and len(test_data['test_name']) < 3:
            issues.append("Test name too short")

        # Provider should be recognized
        valid_providers = ['ETS', 'Pearson', 'State DOE', 'edTPA', 'NES', 'Unknown']
        if test_data.get('provider') and test_data['provider'] not in valid_providers:
            issues.append(f"Unrecognized provider: {test_data['provider']}")

        return len(issues) == 0, issues

    def validate_objective(self, objective_data: Dict) -> Tuple[bool, List[str]]:
        """
        Validate that an objective meets quality standards.

        Returns:
            (is_valid: bool, issues: List[str])
        """
        issues = []

        obj_text = objective_data.get('objective_text', '')

        # Minimum length check (at least 6 words)
        word_count = len(obj_text.split())
        if word_count < 6:
            issues.append(f"Objective too short ({word_count} words, minimum 6)")

        # Should contain an action verb
        action_verbs = [
            'understand', 'demonstrate', 'apply', 'analyze', 'evaluate',
            'identify', 'explain', 'describe', 'compare', 'create',
            'develop', 'design', 'implement', 'use', 'integrate',
            'teach', 'assess', 'plan', 'collaborate', 'communicate'
        ]

        has_action = any(verb in obj_text.lower() for verb in action_verbs)
        if not has_action:
            issues.append("No clear action verb found")

        # Check for boilerplate text
        boilerplate_phrases = [
            'click here', 'read more', 'download', 'next page',
            'table of contents', 'copyright', 'all rights reserved'
        ]

        if any(phrase in obj_text.lower() for phrase in boilerplate_phrases):
            issues.append("Contains boilerplate/navigation text")

        # Confidence score validation (if inferred)
        if objective_data.get('is_inferred'):
            confidence = objective_data.get('confidence', 0)
            if not (0 <= confidence <= 1.0):
                issues.append(f"Invalid confidence score: {confidence}")

            if not objective_data.get('rationale'):
                issues.append("Inferred objective missing rationale")

        return len(issues) == 0, issues

    def validate_objectives_set(self, objectives: List[Dict]) -> Dict:
        """
        Validate a complete set of objectives for a test.

        Returns dict with validation metrics.
        """
        metrics = {
            'total_objectives': len(objectives),
            'valid_objectives': 0,
            'issues_found': 0,
            'avg_confidence': 0.0,
            'inferred_count': 0,
            'verified_count': 0
        }

        if not objectives:
            return metrics

        valid_count = 0
        confidence_sum = 0.0

        for obj in objectives:
            is_valid, issues = self.validate_objective(obj)
            if is_valid:
                valid_count += 1
            else:
                metrics['issues_found'] += len(issues)

            if obj.get('is_inferred'):
                metrics['inferred_count'] += 1
            else:
                metrics['verified_count'] += 1

            confidence_sum += obj.get('confidence', 1.0)

        metrics['valid_objectives'] = valid_count
        metrics['avg_confidence'] = confidence_sum / len(objectives) if objectives else 0.0

        return metrics

    def _is_authoritative_domain(self, netloc: str) -> bool:
        """Check if domain is from an authoritative source."""
        netloc_lower = netloc.lower()

        authoritative_patterns = [
            '.gov',
            '.edu',
            'ets.org',
            'pearson.com',
            'nesinc.com',
            'edtpa.com',
            'act.org',
            'state.',
            'doe.',
            'education.'
        ]

        return any(pattern in netloc_lower for pattern in authoritative_patterns)

    def remove_boilerplate(self, text: str) -> str:
        """Remove common boilerplate text from objectives."""
        # Remove navigation elements
        text = re.sub(r'(click here|read more|download|next page)', '', text, flags=re.IGNORECASE)

        # Remove copyright notices
        text = re.sub(r'(copyright|©|all rights reserved).*', '', text, flags=re.IGNORECASE)

        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    def assign_validation_status(self, objective: Dict) -> str:
        """
        Assign validation status based on evidence and confidence.

        Returns: 'verified', 'partial', or 'inferred'
        """
        if objective.get('is_inferred'):
            confidence = objective.get('confidence', 0)
            if confidence >= 0.7:
                return 'partial'
            else:
                return 'inferred'
        else:
            # Has official source
            if objective.get('evidence_url'):
                return 'verified'
            else:
                return 'partial'
