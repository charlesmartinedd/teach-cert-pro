"""
Logging functionality for teacher certification PDF validator.
"""
import logging
import os
from datetime import datetime
from pathlib import Path


class StateLogger:
    """Manages logging for each state's search and validation process."""

    def __init__(self, log_dir: str):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

    def get_logger(self, state_name: str) -> logging.Logger:
        """Create or get a logger for a specific state."""
        logger_name = f"state_{state_name.lower().replace(' ', '_')}"
        logger = logging.getLogger(logger_name)

        # Avoid adding handlers multiple times
        if logger.handlers:
            return logger

        logger.setLevel(logging.DEBUG)

        # File handler
        log_file = self.log_dir / f"{state_name.lower().replace(' ', '_')}.log"
        file_handler = logging.FileHandler(log_file, mode='w', encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def log_query(self, logger: logging.Logger, query: str, result_count: int):
        """Log a search query and its result count."""
        logger.info(f"Query: '{query}' - Found {result_count} results")

    def log_validation(self, logger: logging.Logger, url: str, is_valid: bool, reason: str = ""):
        """Log PDF validation attempt."""
        status = "VALID ✓" if is_valid else "INVALID ✗"
        msg = f"Validation {status}: {url}"
        if reason:
            msg += f" - {reason}"
        logger.info(msg)

    def log_error(self, logger: logging.Logger, error: Exception, context: str = ""):
        """Log an error with context."""
        logger.error(f"Error {context}: {str(error)}")

    def log_final_result(self, logger: logging.Logger, found: bool, url: str = None):
        """Log the final result for a state."""
        if found:
            logger.info(f"✓ SUCCESS: Valid PDF found at {url}")
        else:
            logger.warning("✗ NO VALID PDF FOUND after exhausting all queries")
