# Quick Fix Guide - Teacher Cert PDF Validator

## Problem
DuckDuckGo search API returns 0 results.

## Fastest Fix (5 minutes)

### Option A: Use googlesearch-python

1. **Install new package:**
   ```bash
   cd projects/teacher_cert_pdf_validator
   pip uninstall duckduckgo-search
   pip install googlesearch-python
   ```

2. **Update `src/searcher.py`:**
   ```python
   # Replace lines 1-10 with:
   from googlesearch import search as google_search
   from typing import List, Set
   import time

   class PDFSearcher:
       """Searches the web for teacher certification PDFs by state."""

       def __init__(self):
           self.max_results_per_query = 20
   ```

3. **Replace search method (lines 30-50):**
   ```python
   def search(self, query: str) -> List[str]:
       """Perform a search and return PDF URLs."""
       try:
           results = []
           for url in google_search(query, num_results=self.max_results_per_query, advanced=False):
               if url:
                   if '.pdf' in url.lower():
                       results.insert(0, url)
                   else:
                       results.append(url)
           return results
       except Exception as e:
           print(f"Search error for query '{query}': {str(e)}")
           return []
   ```

4. **Run it:**
   ```bash
   python src/main.py
   ```

### Option B: Test with Known URLs (Fastest for demo)

1. **Create test file:**
   ```bash
   cd projects/teacher_cert_pdf_validator/src
   ```

2. **Create `test_data.py`:**
   ```python
   # Sample known PDF URLs for testing
   SAMPLE_STATE_PDFS = {
       "California": "https://www.ctc.ca.gov/docs/default-source/leaflets/cl797.pdf",
       "Texas": "https://tea.texas.gov/sites/default/files/certificationsupport.pdf",
       "New York": "https://www.highered.nysed.gov/tcert/pdf/generaleducation.pdf",
       "Florida": "https://www.fldoe.org/core/fileparse.php/5423/urlt/6-4.pdf",
       "Illinois": "https://www.isbe.net/Documents/teach_cert_handbook.pdf",
   }
   ```

3. **Update `src/main.py` to use test data:**
   ```python
   # Add after imports:
   try:
       from test_data import SAMPLE_STATE_PDFS
       USE_TEST_DATA = True
   except:
       USE_TEST_DATA = False

   # In process_state method, add before search:
   if USE_TEST_DATA and state_name in SAMPLE_STATE_PDFS:
       all_urls = {SAMPLE_STATE_PDFS[state_name]}
       logger.info(f"Using test URL: {SAMPLE_STATE_PDFS[state_name]}")
   else:
       # existing search code...
   ```

4. **Run limited test:**
   ```python
   # In main(), change:
   US_STATES = ["California", "Texas", "New York", "Florida", "Illinois"]
   ```

   ```bash
   python src/main.py
   ```

## Expected Results

After fix, you should see:
```
[1/50] Processing Alabama...
2025-10-16 11:00:00 - state_alabama - INFO - Phase 1: Searching for PDF links...
2025-10-16 11:00:01 - state_alabama - INFO - Query 1/15: ...
2025-10-16 11:00:02 - state_alabama - INFO -   → Found 18 results
2025-10-16 11:00:02 - state_alabama - INFO -   → 3 appear to be PDFs
2025-10-16 11:00:03 - state_alabama - INFO - [1/18] Checking: https://...
2025-10-16 11:00:04 - state_alabama - INFO - Validation VALID ✓: https://...
2025-10-16 11:00:04 - state_alabama - INFO - ✓ SUCCESS: Valid PDF found at https://...
```

## Verify Success

Check these files:
```bash
# Should show actual URLs instead of empty arrays
cat results/intermediate_results.json | grep "pdf_found"

# Should show validation attempts
cat logs/california.log | grep "VALID"

# Should show final stats
ls -la results/
```

## Full System Run

Once working:
```bash
# Restore all 50 states in main.py
US_STATES = [... all 50 ...]

# Run full system
python src/main.py

# Wait ~25 minutes
# Check final reports:
ls -la results/
# - all_states_valid_pdfs.json
# - all_states_valid_pdfs.csv
# - research_summary.md
```

## Troubleshooting

**If still no results:**
1. Check internet connection
2. Try VPN if blocked
3. Add delays between requests (increase `time.sleep(1)` to `time.sleep(3)`)
4. Use SerpAPI with paid key (most reliable)

**If validation fails:**
1. Check `validator.py` timeout settings
2. Increase timeout: `PDFValidator(timeout=30)`
3. Check firewall/proxy settings
