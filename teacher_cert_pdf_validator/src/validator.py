"""
PDF link validator - tests if URLs actually point to valid PDFs.
"""
import requests
from typing import Tuple
from urllib.parse import urlparse


class PDFValidator:
    """Validates whether a URL points to a real, accessible PDF."""

    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def is_valid_pdf(self, url: str) -> Tuple[bool, str]:
        """
        Check if a URL points to a valid PDF.

        Returns:
            Tuple of (is_valid: bool, reason: str)
        """
        try:
            # Basic URL validation
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                return False, "Invalid URL format"

            # HEAD request first (faster)
            response = self.session.head(url, timeout=self.timeout, allow_redirects=True)

            # If HEAD fails, try GET with streaming
            if response.status_code != 200:
                response = self.session.get(url, timeout=self.timeout, stream=True, allow_redirects=True)

            if response.status_code != 200:
                return False, f"HTTP {response.status_code}"

            # Check content type
            content_type = response.headers.get('Content-Type', '').lower()
            if 'application/pdf' in content_type:
                return True, "Valid PDF (Content-Type)"

            # Check if URL ends with .pdf
            if url.lower().endswith('.pdf') or response.url.lower().endswith('.pdf'):
                # Verify it's actually a PDF by checking magic bytes
                if hasattr(response, 'raw'):
                    response.raw.read(0)  # Initialize stream
                    response = self.session.get(url, timeout=self.timeout, stream=True)

                # Read first few bytes to check PDF signature
                chunk = next(response.iter_content(chunk_size=8), None)
                if chunk and chunk.startswith(b'%PDF'):
                    return True, "Valid PDF (signature check)"
                elif chunk:
                    return False, "File exists but not a PDF"

            # Check final URL after redirects
            if '.pdf' in response.url.lower():
                return True, "Valid PDF (URL extension)"

            return False, "Not a PDF file"

        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except requests.exceptions.ConnectionError:
            return False, "Connection failed"
        except requests.exceptions.TooManyRedirects:
            return False, "Too many redirects"
        except Exception as e:
            return False, f"Error: {str(e)[:50]}"

    def validate_multiple(self, urls: list) -> dict:
        """
        Validate multiple URLs and return the first valid one.

        Returns:
            dict with 'found', 'url', and 'checked_urls' keys
        """
        checked_urls = []

        for url in urls:
            is_valid, reason = self.is_valid_pdf(url)
            checked_urls.append({
                'url': url,
                'valid': is_valid,
                'reason': reason
            })

            if is_valid:
                return {
                    'found': True,
                    'url': url,
                    'checked_urls': checked_urls
                }

        return {
            'found': False,
            'url': None,
            'checked_urls': checked_urls
        }
