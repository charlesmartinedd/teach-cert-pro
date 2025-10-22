"""
Database management for teacher certification objectives.
"""
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class ObjectivesDatabase:
    """Manages SQLite database for teacher certification objectives."""

    def __init__(self, db_path: str):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = None
        self.cursor = None

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def connect(self):
        """Connect to database and create tables if needed."""
        self.conn = sqlite3.connect(str(self.db_path))
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        self._create_tables()

    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.commit()
            self.conn.close()

    def _create_tables(self):
        """Create all database tables."""
        # States table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                abbrev TEXT UNIQUE NOT NULL,
                last_full_refresh DATETIME
            )
        ''')

        # Tests table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                state_id INTEGER NOT NULL,
                test_system TEXT NOT NULL,
                test_name TEXT NOT NULL,
                test_code TEXT,
                subject_area TEXT,
                grade_band TEXT,
                official_source_url TEXT,
                provider TEXT,
                source_last_updated TEXT,
                scraped_at DATETIME NOT NULL,
                FOREIGN KEY (state_id) REFERENCES states(id),
                UNIQUE(state_id, test_system, test_name, test_code)
            )
        ''')

        # Objectives table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS objectives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                objective_index INTEGER NOT NULL,
                objective_text TEXT NOT NULL,
                evidence_excerpt TEXT,
                evidence_url TEXT,
                evidence_locator TEXT,
                is_inferred BOOLEAN DEFAULT 0,
                confidence REAL DEFAULT 1.0,
                rationale TEXT,
                validation_status TEXT DEFAULT 'verified',
                validator_notes TEXT,
                FOREIGN KEY (test_id) REFERENCES tests(id)
            )
        ''')

        # Audits table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS audits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                state_id INTEGER NOT NULL,
                status TEXT NOT NULL,
                tests_found INTEGER DEFAULT 0,
                objectives_found INTEGER DEFAULT 0,
                objectives_inferred INTEGER DEFAULT 0,
                queries_run INTEGER DEFAULT 0,
                run_started_at DATETIME NOT NULL,
                run_ended_at DATETIME,
                notes TEXT,
                FOREIGN KEY (state_id) REFERENCES states(id)
            )
        ''')

        self.conn.commit()

    def upsert_state(self, name: str, abbrev: str) -> int:
        """Insert or get state ID."""
        self.cursor.execute(
            'INSERT OR IGNORE INTO states (name, abbrev) VALUES (?, ?)',
            (name, abbrev)
        )
        self.conn.commit()

        self.cursor.execute('SELECT id FROM states WHERE name = ?', (name,))
        return self.cursor.fetchone()[0]

    def upsert_test(self, test_data: Dict) -> int:
        """Insert or update test record."""
        self.cursor.execute('''
            INSERT INTO tests (
                state_id, test_system, test_name, test_code, subject_area,
                grade_band, official_source_url, provider, source_last_updated, scraped_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(state_id, test_system, test_name, test_code)
            DO UPDATE SET
                subject_area = excluded.subject_area,
                grade_band = excluded.grade_band,
                official_source_url = excluded.official_source_url,
                provider = excluded.provider,
                source_last_updated = excluded.source_last_updated,
                scraped_at = excluded.scraped_at
        ''', (
            test_data['state_id'],
            test_data['test_system'],
            test_data['test_name'],
            test_data.get('test_code'),
            test_data.get('subject_area'),
            test_data.get('grade_band'),
            test_data.get('official_source_url'),
            test_data.get('provider'),
            test_data.get('source_last_updated'),
            datetime.now().isoformat()
        ))
        self.conn.commit()
        return self.cursor.lastrowid

    def insert_objective(self, objective_data: Dict) -> int:
        """Insert objective record."""
        self.cursor.execute('''
            INSERT INTO objectives (
                test_id, objective_index, objective_text, evidence_excerpt,
                evidence_url, evidence_locator, is_inferred, confidence,
                rationale, validation_status, validator_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            objective_data['test_id'],
            objective_data['objective_index'],
            objective_data['objective_text'],
            objective_data.get('evidence_excerpt'),
            objective_data.get('evidence_url'),
            objective_data.get('evidence_locator'),
            objective_data.get('is_inferred', False),
            objective_data.get('confidence', 1.0),
            objective_data.get('rationale'),
            objective_data.get('validation_status', 'verified'),
            objective_data.get('validator_notes')
        ))
        self.conn.commit()
        return self.cursor.lastrowid

    def start_audit(self, state_id: int) -> int:
        """Start an audit record for a state."""
        self.cursor.execute('''
            INSERT INTO audits (state_id, status, run_started_at)
            VALUES (?, 'running', ?)
        ''', (state_id, datetime.now().isoformat()))
        self.conn.commit()
        return self.cursor.lastrowid

    def complete_audit(self, audit_id: int, status: str, counts: Dict, notes: str = None):
        """Complete an audit record."""
        self.cursor.execute('''
            UPDATE audits SET
                status = ?,
                tests_found = ?,
                objectives_found = ?,
                objectives_inferred = ?,
                queries_run = ?,
                run_ended_at = ?,
                notes = ?
            WHERE id = ?
        ''', (
            status,
            counts.get('tests_found', 0),
            counts.get('objectives_found', 0),
            counts.get('objectives_inferred', 0),
            counts.get('queries_run', 0),
            datetime.now().isoformat(),
            notes,
            audit_id
        ))
        self.conn.commit()

    def get_state_tests(self, state_id: int) -> List[Dict]:
        """Get all tests for a state."""
        self.cursor.execute('SELECT * FROM tests WHERE state_id = ?', (state_id,))
        return [dict(row) for row in self.cursor.fetchall()]

    def get_test_objectives(self, test_id: int) -> List[Dict]:
        """Get all objectives for a test."""
        self.cursor.execute(
            'SELECT * FROM objectives WHERE test_id = ? ORDER BY objective_index',
            (test_id,)
        )
        return [dict(row) for row in self.cursor.fetchall()]

    def get_all_states(self) -> List[Dict]:
        """Get all states."""
        self.cursor.execute('SELECT * FROM states ORDER BY name')
        return [dict(row) for row in self.cursor.fetchall()]

    def get_statistics(self) -> Dict:
        """Get database statistics."""
        stats = {}

        self.cursor.execute('SELECT COUNT(*) FROM states')
        stats['total_states'] = self.cursor.fetchone()[0]

        self.cursor.execute('SELECT COUNT(*) FROM tests')
        stats['total_tests'] = self.cursor.fetchone()[0]

        self.cursor.execute('SELECT COUNT(*) FROM objectives')
        stats['total_objectives'] = self.cursor.fetchone()[0]

        self.cursor.execute('SELECT COUNT(*) FROM objectives WHERE is_inferred = 1')
        stats['inferred_objectives'] = self.cursor.fetchone()[0]

        self.cursor.execute('SELECT COUNT(*) FROM objectives WHERE is_inferred = 0')
        stats['verified_objectives'] = self.cursor.fetchone()[0]

        return stats
