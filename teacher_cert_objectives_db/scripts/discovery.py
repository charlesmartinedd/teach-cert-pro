"""
Web discovery engine for finding teacher certification test objectives.
"""
import re
import time
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup


class DiscoveryEngine:
    """Discovers teacher certification tests and objectives through web search."""

    def __init__(self, web_search_func, web_fetch_func):
        """
        Initialize with Claude's WebSearch and WebFetch functions.

        Args:
            web_search_func: Function that takes query string, returns search results
            web_fetch_func: Function that takes (url, prompt), returns extracted content
        """
        self.web_search = web_search_func
        self.web_fetch = web_fetch_func
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def generate_search_queries(self, state_name: str) -> List[str]:
        """Generate progressive search queries for a state."""
        state_abbrev = self._get_state_abbrev(state_name)

        queries = [
            # Primary: Official DOE
            f"{state_name} teacher certification tests requirements site:.gov",
            f"{state_name} department of education teacher licensing exams",
            f"{state_abbrev} DOE teacher certification test list",

            # Test frameworks & objectives
            f"{state_name} teacher certification test objectives site:.gov",
            f"{state_name} teacher test blueprint framework",
            f"{state_name} teacher certification test competencies",

            # Provider-specific
            f"{state_name} Praxis tests required teaching license",
            f"{state_name} NES teacher tests objectives",
            f"{state_name} teacher certification exam study guide objectives site:edu",

            # State-specific systems
            f"{state_name} state teacher exam framework",
            f"{state_abbrev} educator certification assessment objectives",
        ]

        return queries

    def discover_state_tests(self, state_name: str, logger) -> List[Dict]:
        """
        Discover all teacher certification tests for a state.

        Returns list of test metadata dictionaries.
        """
        discovered_tests = []
        queries = self.generate_search_queries(state_name)

        logger.info(f"Starting discovery for {state_name} with {len(queries)} queries")

        for i, query in enumerate(queries, 1):
            logger.info(f"Query {i}/{len(queries)}: {query}")

            try:
                # Use WebSearch to find relevant URLs
                search_prompt = f"Find official teacher certification testing information for {state_name}. Query: {query}"
                results = self.web_search(query)

                if results:
                    logger.info(f"  → Found {len(results)} potential sources")

                    # Process top results
                    for result in results[:5]:  # Top 5 per query
                        url = result.get('url', result.get('link', ''))
                        if url and self._is_authoritative_source(url):
                            logger.info(f"  → Processing: {url[:80]}...")

                            # Extract test information from this URL
                            tests = self._extract_tests_from_url(url, state_name, logger)
                            discovered_tests.extend(tests)

                time.sleep(1)  # Rate limiting

            except Exception as e:
                logger.error(f"Error in query {i}: {str(e)}")
                continue

        # Deduplicate tests
        unique_tests = self._deduplicate_tests(discovered_tests)
        logger.info(f"Discovered {len(unique_tests)} unique tests for {state_name}")

        return unique_tests

    def extract_objectives(self, test_info: Dict, logger) -> List[Dict]:
        """
        Extract objectives for a specific test.

        Returns list of objective dictionaries with text, evidence, confidence.
        """
        objectives = []
        url = test_info.get('official_source_url', '')

        if not url:
            logger.warning(f"No URL for test: {test_info.get('test_name')}")
            return objectives

        logger.info(f"Extracting objectives from: {url[:80]}...")

        try:
            # Use WebFetch to extract content
            fetch_prompt = f"""Extract all test objectives, competencies, or framework points for this teacher certification test.

Test: {test_info.get('test_name')}
Provider: {test_info.get('provider')}

Look for:
- Numbered or bulleted objective lists
- Competency statements
- Test framework sections
- Content domain descriptions

Return the objectives as a structured list with their original numbering if available."""

            content = self.web_fetch(url, fetch_prompt)

            if content:
                # Parse objectives from extracted content
                objectives = self._parse_objectives_from_content(
                    content,
                    url,
                    test_info,
                    logger
                )

        except Exception as e:
            logger.error(f"Error extracting objectives: {str(e)}")

        return objectives

    def _extract_tests_from_url(self, url: str, state_name: str, logger) -> List[Dict]:
        """Extract test information from a URL."""
        tests = []

        try:
            # Use WebFetch to extract test listings
            fetch_prompt = f"""Extract all teacher certification tests mentioned on this page for {state_name}.

For each test, identify:
- Test name (e.g., "Elementary Education", "Mathematics Content Knowledge")
- Test code/number if available (e.g., "5001", "236")
- Test system/provider (Praxis, NES, edTPA, state-specific, etc.)
- Subject area
- Grade band (K-6, 7-12, etc.)

Return structured information about each test found."""

            content = self.web_fetch(url, fetch_prompt)

            if content:
                # Parse test information from content
                # This is a simplified extraction - in practice would need more sophisticated parsing
                test_patterns = [
                    (r'Praxis\s+(\d+)', 'Praxis', 'ETS'),
                    (r'NES\s+(\d+)', 'NES', 'Pearson'),
                    (r'edTPA', 'edTPA', 'Pearson'),
                ]

                for pattern, system, provider in test_patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    for match in matches:
                        test_code = match.group(1) if match.lastindex else None
                        tests.append({
                            'test_system': system,
                            'provider': provider,
                            'test_code': test_code,
                            'official_source_url': url,
                            'source_content': content[:500]  # Sample
                        })

        except Exception as e:
            logger.error(f"Error extracting from {url}: {str(e)}")

        return tests

    def _parse_objectives_from_content(self, content: str, url: str, test_info: Dict, logger) -> List[Dict]:
        """Parse individual objectives from extracted content."""
        objectives = []

        # Look for numbered/bulleted lists
        lines = content.split('\n')

        index = 0
        for line in lines:
            line = line.strip()

            # Skip empty lines and headers
            if not line or len(line) < 10:
                continue

            # Check if line looks like an objective (starts with number/bullet, has action verb)
            if self._looks_like_objective(line):
                objectives.append({
                    'objective_index': index,
                    'objective_text': line,
                    'evidence_excerpt': line[:200],
                    'evidence_url': url,
                    'is_inferred': False,
                    'confidence': 1.0,
                    'validation_status': 'verified'
                })
                index += 1

        logger.info(f"  → Extracted {len(objectives)} objectives")
        return objectives

    def _looks_like_objective(self, text: str) -> bool:
        """Check if text looks like a learning objective."""
        # Must have minimum length
        if len(text.split()) < 6:
            return False

        # Check for action verbs common in objectives
        action_verbs = [
            'understand', 'demonstrate', 'apply', 'analyze', 'evaluate',
            'identify', 'explain', 'describe', 'compare', 'create',
            'develop', 'design', 'implement', 'use', 'integrate'
        ]

        text_lower = text.lower()
        has_action_verb = any(verb in text_lower for verb in action_verbs)

        # Check for list markers
        has_marker = bool(re.match(r'^[\d\.\)\-\*\•]+\s+', text))

        return has_action_verb or has_marker

    def _is_authoritative_source(self, url: str) -> bool:
        """Check if URL is from an authoritative source."""
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        # Check for .gov, .edu, or known providers
        authoritative_domains = [
            '.gov', '.edu', 'ets.org', 'pearson.com', 'nesinc.com',
            'edtpa.com', 'state.', 'doe.', 'education.'
        ]

        return any(auth in domain for auth in authoritative_domains)

    def _deduplicate_tests(self, tests: List[Dict]) -> List[Dict]:
        """Remove duplicate tests."""
        seen = set()
        unique = []

        for test in tests:
            key = (
                test.get('test_system', ''),
                test.get('test_name', ''),
                test.get('test_code', '')
            )

            if key not in seen:
                seen.add(key)
                unique.append(test)

        return unique

    def _get_state_abbrev(self, state_name: str) -> str:
        """Get state abbreviation."""
        abbrevs = {
            'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
            'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
            'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
            'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
            'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
            'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
            'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
            'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
            'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
            'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
            'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
            'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
            'Wisconsin': 'WI', 'Wyoming': 'WY'
        }
        return abbrevs.get(state_name, state_name[:2].upper())
