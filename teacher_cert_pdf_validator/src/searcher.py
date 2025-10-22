"""
Web searcher for finding teacher certification PDF links.
"""
import time
from typing import List, Set
from duckduckgo_search import DDGS


class PDFSearcher:
    """Searches the web for teacher certification PDFs by state."""

    def __init__(self):
        self.ddgs = DDGS()
        self.max_results_per_query = 20

    def generate_queries(self, state_name: str) -> List[str]:
        """Generate progressive search queries for a state."""
        queries = [
            # Priority 1: Government sites with filetype
            f"{state_name} teacher certification test site:gov filetype:pdf",
            f"{state_name} teaching license exam site:gov filetype:pdf",
            f"{state_name} educator certification site:.gov filetype:pdf",

            # Priority 2: Study guides and handbooks
            f"{state_name} teacher certification study guide filetype:pdf",
            f"{state_name} teaching exam handbook filetype:pdf",
            f"{state_name} educator test preparation guide filetype:pdf",

            # Priority 3: State education department
            f"{state_name} department of education teacher certification filetype:pdf",
            f"{state_name} state teacher exam requirements filetype:pdf",
            f"{state_name} teaching license application guide filetype:pdf",

            # Priority 4: Broader searches
            f"{state_name} teacher certification practice test pdf",
            f"{state_name} teaching credential exam guide pdf",
            f"{state_name} educator licensure test pdf",

            # Priority 5: Alternative phrasings
            f"{state_name} teacher praxis exam pdf",
            f"{state_name} teaching assessment guide pdf",
            f"{state_name} educator qualification test pdf",
        ]
        return queries

    def search(self, query: str) -> List[str]:
        """
        Perform a search and return PDF URLs.

        Returns:
            List of URLs that might be PDFs
        """
        try:
            results = self.ddgs.text(
                query,
                max_results=self.max_results_per_query
            )

            # Extract URLs and filter for PDF-related
            urls = []
            for result in results:
                url = result.get('href') or result.get('link', '')
                if url:
                    # Prioritize obvious PDF links
                    if '.pdf' in url.lower():
                        urls.insert(0, url)  # Put PDFs at the front
                    else:
                        urls.append(url)

            return urls

        except Exception as e:
            print(f"Search error for query '{query}': {str(e)}")
            return []

    def search_progressive(self, state_name: str, logger=None) -> Set[str]:
        """
        Perform progressive search with multiple queries until PDFs are found.

        Returns:
            Set of unique URLs found across all queries
        """
        all_urls = set()
        queries = self.generate_queries(state_name)

        for i, query in enumerate(queries, 1):
            if logger:
                logger.info(f"Query {i}/{len(queries)}: {query}")

            urls = self.search(query)

            if logger:
                logger.info(f"  → Found {len(urls)} results")

            # Filter for likely PDFs
            pdf_urls = [url for url in urls if '.pdf' in url.lower()]
            if pdf_urls and logger:
                logger.info(f"  → {len(pdf_urls)} appear to be PDFs")

            all_urls.update(urls)

            # Small delay to be respectful to the search service
            time.sleep(1)

        return all_urls
