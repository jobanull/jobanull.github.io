from flask import Flask, request, jsonify, send_file, send_from_directory, render_template_string
from flask_cors import CORS
import csv
import os
import json
import sys
import socket
import requests
from datetime import datetime, timedelta
from collections import defaultdict
import urllib.parse
import traceback
import fcntl
import time
import threading
from collections import deque
import uuid

app = Flask(__name__)
CORS(app)

# ==================== KONFIGURASI ====================
CSV_FILE = 'prtg.csv'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==================== FILE LOCKING & QUEUE SYSTEM ====================
request_queue = deque()
queue_lock = threading.Lock()
processing_lock = threading.Lock()

class FileLock:
    """Context manager untuk file locking dengan timeout"""
    def __init__(self, filename, timeout=30):
        self.filename = filename
        self.timeout = timeout
        self.fd = None
        
    def __enter__(self):
        start_time = time.time()
        while True:
            try:
                self.fd = open(self.filename, 'a+')
                fcntl.flock(self.fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                return self.fd
            except (IOError, OSError):
                if self.fd:
                    self.fd.close()
                    self.fd = None
                if time.time() - start_time > self.timeout:
                    raise TimeoutError(f"Could not acquire lock on {self.filename} after {self.timeout}s")
                time.sleep(0.1)
                
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.fd:
            try:
                fcntl.flock(self.fd.fileno(), fcntl.LOCK_UN)
                self.fd.close()
            except:
                pass
            self.fd = None

# ==================== QUEUE PROCESSOR ====================
class RequestProcessor:
    def __init__(self):
        self.is_processing = False
        self.processing_thread = None
        self.stop_flag = False
        self.results = {}  # Simpan hasil untuk tracking
        
    def add_request(self, request_data):
        """Tambahkan request ke antrian"""
        request_id = str(uuid.uuid4())[:8]
        with queue_lock:
            request_queue.append({
                'id': request_id,
                'data': request_data,
                'timestamp': time.time()
            })
        print(f"📥 Request {request_id} added to queue (queue size: {len(request_queue)})")
        
        # Start processor jika belum berjalan
        self.start_processor()
        return request_id
    
    def start_processor(self):
        """Start background thread untuk memproses queue"""
        with processing_lock:
            if self.is_processing:
                return
            self.is_processing = True
            self.stop_flag = False
            self.processing_thread = threading.Thread(target=self._process_queue)
            self.processing_thread.daemon = True
            self.processing_thread.start()
            print("🔄 Queue processor started")
    
    def stop_processor(self):
        """Stop queue processor"""
        self.stop_flag = True
        if self.processing_thread and self.processing_thread.is_alive():
            self.processing_thread.join(timeout=5)
        self.is_processing = False
        print("⏹️ Queue processor stopped")
    
    def _process_queue(self):
        """Process semua request dalam queue secara sequential"""
        while not self.stop_flag:
            # Ambil request dari queue
            request = None
            with queue_lock:
                if request_queue:
                    request = request_queue.popleft()
            
            if not request:
                # Queue kosong, stop processor
                with processing_lock:
                    self.is_processing = False
                print("✅ Queue processor idle (queue empty)")
                break
            
            # Proses request
            try:
                print(f"🔄 Processing request {request['id']}...")
                result = self._process_request(request['data'])
                self.results[request['id']] = result
                print(f"✅ Request {request['id']} completed")
            except Exception as e:
                print(f"❌ Request {request['id']} failed: {e}")
                self.results[request['id']] = {'success': False, 'message': str(e)}
            
            # Small delay untuk menghindari CPU spike
            time.sleep(0.01)
    
    def _process_request(self, request_data):
        """Process single request dengan file locking"""
        method = request_data.get('method', 'GET')
        endpoint = request_data.get('endpoint', '')
        data = request_data.get('data', {})
        
        print(f"🔧 Processing {method} {endpoint}")
        
        if method == 'POST' and endpoint == '/api/prtg':
            return self._add_prtg_data_with_lock(data)
        elif method == 'PUT' and endpoint == '/api/prtg/done-by-location':
            return self._update_done_by_location_with_lock(data)
        elif method == 'PUT' and endpoint == '/api/prtg/done-by-location-opt':
            return self._mark_done_by_location_opt_with_lock(data)
        elif method == 'PUT' and endpoint == '/api/prtg/pause-by-location':
            return self._pause_by_location_with_lock(data)
        elif method == 'PUT' and endpoint == '/api/prtg/unpause-by-location':
            return self._unpause_by_location_with_lock(data)
        elif method == 'DELETE' and endpoint.startswith('/api/prtg/'):
            index = int(endpoint.split('/')[-1])
            return self._delete_by_index_with_lock(index)
        elif method == 'DELETE' and endpoint == '/api/prtg/delete-by-location-opt':
            return self._delete_by_location_opt_with_lock(data)
        else:
            return {'success': False, 'message': f'Unknown request type: {method} {endpoint}'}
    
    def get_result(self, request_id):
        """Dapatkan hasil request berdasarkan ID"""
        return self.results.get(request_id)
    
    def get_queue_status(self):
        """Dapatkan status queue"""
        with queue_lock:
            return {
                'queue_size': len(request_queue),
                'is_processing': self.is_processing
            }
    
    # ===== FUNGSI DENGAN FILE LOCKING =====
    
    def _add_prtg_data_with_lock(self, data):
        """Add PRTG data dengan file locking"""
        try:
            with FileLock(CSV_FILE, timeout=30) as f:
                # Baca data
                existing_data = self._read_csv_with_fd(f)
                
                # Cek duplikat
                location = data.get('location', '').strip().upper()
                opt = data.get('opt', 'PARENT').strip().upper()
                
                if opt == 'PARENT':
                    for item in existing_data:
                        if (item.get('location', '').upper() == location and 
                            item.get('status') == 'active' and
                            item.get('opt') != 'TEST_BATTERY'):
                            return {'success': False, 'message': f'❌ "{location}" masih ACTIVE!', 'duplicate': True}
                
                # Tambahkan data
                current_time = datetime.now()
                start_date = data.get('startDate', current_time.strftime('%m/%d/%Y'))
                start_time = data.get('startTime', current_time.strftime('%I:%M:%S'))
                start_ampm = data.get('ampm', current_time.strftime('%p').upper())
                vdc = data.get('vdc', '50 V')
                
                max_id = 0
                for item in existing_data:
                    try:
                        item_id = int(item.get('id', 0))
                        if item_id > max_id:
                            max_id = item_id
                    except:
                        pass
                
                new_id = max_id + 1
                new_entry = {
                    'id': new_id,
                    'location': location,
                    'startTime': start_time,
                    'startAmPm': start_ampm,
                    'startDate': start_date,
                    'stopTime': '',
                    'stopAmPm': '',
                    'stopDate': '',
                    'status': 'active',
                    'opt': opt,
                    'vdc': vdc
                }
                
                existing_data.append(new_entry)
                
                # Tulis dengan lock
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'✅ "{location}" ditambahkan!', 'data': new_entry}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _update_done_by_location_with_lock(self, data):
        """Update done by location dengan lock"""
        try:
            location = data.get('location', '').strip().upper()
            if not location:
                return {'success': False, 'message': 'Lokasi tidak boleh kosong'}
            
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                updated_count = 0
                current_time = datetime.now()
                
                for item in existing_data:
                    if (item.get('location', '').upper() == location and 
                        item.get('status') == 'active'):
                        item['stopTime'] = current_time.strftime('%I:%M:%S')
                        item['stopAmPm'] = current_time.strftime('%p').upper()
                        item['stopDate'] = current_time.strftime('%m/%d/%Y')
                        item['status'] = 'done'
                        updated_count += 1
                
                if updated_count == 0:
                    return {'success': False, 'message': f'Tidak ada data active untuk "{location}"'}
                
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'✅ "{location}" ({updated_count}) marked DONE!', 'updated_count': updated_count}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _mark_done_by_location_opt_with_lock(self, data):
        """Mark done by location and opt dengan lock"""
        try:
            location = data.get('location', '').strip().upper()
            opt = data.get('opt', '').strip().upper()
            
            if not location or not opt:
                return {'success': False, 'message': 'Location and opt required'}
            
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                updated_count = 0
                current_time = datetime.now()
                
                for item in existing_data:
                    if (item.get('location', '').upper() == location and 
                        item.get('opt') == opt and 
                        item.get('status') == 'active'):
                        item['status'] = 'done'
                        item['stopDate'] = current_time.strftime('%m/%d/%Y')
                        item['stopTime'] = current_time.strftime('%I:%M:%S')
                        item['stopAmPm'] = current_time.strftime('%p').upper()
                        updated_count += 1
                
                if updated_count == 0:
                    return {'success': False, 'message': 'Data not found or already done'}
                
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'{updated_count} data marked done', 'updated_count': updated_count}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _pause_by_location_with_lock(self, data):
        """Pause by location dengan lock"""
        try:
            location = data.get('location', '').strip().upper()
            if not location:
                return {'success': False, 'message': 'Lokasi tidak boleh kosong'}
            
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                updated_count = 0
                current_time = datetime.now()
                
                for item in existing_data:
                    if (item.get('location', '').upper() == location and 
                        item.get('status') == 'active' and
                        item.get('opt') == 'PARENT'):
                        item['status'] = 'paused'
                        item['stopTime'] = current_time.strftime('%I:%M:%S')
                        item['stopAmPm'] = current_time.strftime('%p').upper()
                        item['stopDate'] = current_time.strftime('%m/%d/%Y')
                        updated_count += 1
                
                if updated_count == 0:
                    return {'success': False, 'message': f'Tidak ada data PARENT active untuk "{location}"'}
                
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'⏸️ "{location}" ({updated_count}) paused!', 'updated_count': updated_count}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _unpause_by_location_with_lock(self, data):
        """Unpause by location dengan lock"""
        try:
            location = data.get('location', '').strip().upper()
            if not location:
                return {'success': False, 'message': 'Lokasi tidak boleh kosong'}
            
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                updated_count = 0
                
                for item in existing_data:
                    if (item.get('location', '').upper() == location and 
                        item.get('status') == 'paused' and
                        item.get('opt') == 'PARENT'):
                        item['status'] = 'active'
                        item['stopTime'] = ''
                        item['stopAmPm'] = ''
                        item['stopDate'] = ''
                        updated_count += 1
                
                if updated_count == 0:
                    return {'success': False, 'message': f'Tidak ada data PARENT paused untuk "{location}"'}
                
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'▶️ "{location}" ({updated_count}) unpaused!', 'updated_count': updated_count}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _delete_by_index_with_lock(self, index):
        """Delete by index dengan lock"""
        try:
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                
                if index < 0 or index >= len(existing_data):
                    return {'success': False, 'message': 'Data tidak ditemukan'}
                
                location = existing_data[index].get('location', 'Unknown')
                existing_data.pop(index)
                
                if self._write_csv_with_fd(existing_data, f):
                    return {'success': True, 'message': f'🗑️ "{location}" deleted!'}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _delete_by_location_opt_with_lock(self, data):
        """Delete by location and opt dengan lock"""
        try:
            location = data.get('location', '').strip().upper()
            opt = data.get('opt', '').strip().upper()
            
            if not location or not opt:
                return {'success': False, 'message': 'Location and opt required'}
            
            with FileLock(CSV_FILE, timeout=30) as f:
                existing_data = self._read_csv_with_fd(f)
                deleted_count = 0
                new_data = []
                
                for item in existing_data:
                    if item.get('location', '').upper() == location and item.get('opt') == opt:
                        deleted_count += 1
                    else:
                        new_data.append(item)
                
                if deleted_count == 0:
                    return {'success': False, 'message': 'Data not found'}
                
                if self._write_csv_with_fd(new_data, f):
                    return {'success': True, 'message': f'Deleted {deleted_count} items', 'deleted_count': deleted_count}
                else:
                    return {'success': False, 'message': 'Gagal menyimpan data'}
                    
        except TimeoutError as e:
            return {'success': False, 'message': f'Timeout: {e}'}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    # ===== CSV HELPER FUNCTIONS =====
    
    def _read_csv_with_fd(self, fd):
        """Membaca CSV dari file descriptor yang sudah di-lock"""
        data = []
        try:
            fd.seek(0)
            content = fd.read()
            if not content.strip():
                return []
            
            fd.seek(0)
            reader = csv.DictReader(fd)
            headers = reader.fieldnames
            
            expected_headers = ['id', 'location', 'startTime', 'startAmPm', 'startDate', 'stopTime', 'stopAmPm', 'stopDate', 'status', 'opt', 'vdc']
            
            if headers != expected_headers:
                # Rebuild jika header tidak sesuai
                fd.seek(0)
                content = fd.read()
                lines = content.split('\n')
                if len(lines) > 1:
                    old_headers = lines[0].strip().split(',')
                    old_data = []
                    for line in lines[1:]:
                        if line.strip():
                            values = line.strip().split(',')
                            row = {}
                            for i, header in enumerate(old_headers):
                                if i < len(values):
                                    row[header] = values[i]
                            old_data.append(row)
                    
                    new_data = []
                    for idx, row in enumerate(old_data, 1):
                        start_time = row.get('startTime', '')
                        start_ampm = ''
                        start_time_clean = start_time
                        if ' ' in start_time:
                            parts = start_time.rsplit(' ', 1)
                            if len(parts) == 2 and parts[1].upper() in ['AM', 'PM']:
                                start_time_clean = parts[0]
                                start_ampm = parts[1].upper()
                        
                        stop_time = row.get('stopTime', '')
                        stop_ampm = ''
                        stop_time_clean = stop_time
                        if ' ' in stop_time:
                            parts = stop_time.rsplit(' ', 1)
                            if len(parts) == 2 and parts[1].upper() in ['AM', 'PM']:
                                stop_time_clean = parts[0]
                                stop_ampm = parts[1].upper()
                        
                        opt_value = row.get('opt', 'PARENT')
                        if opt_value == 'MAIN':
                            opt_value = 'PARENT'
                        elif opt_value == 'UNMAIN':
                            opt_value = 'CHILD'
                        
                        new_entry = {
                            'id': idx,
                            'location': row.get('location', ''),
                            'startTime': start_time_clean,
                            'startAmPm': start_ampm,
                            'startDate': row.get('startDate', ''),
                            'stopTime': stop_time_clean,
                            'stopAmPm': stop_ampm,
                            'stopDate': row.get('stopDate', ''),
                            'status': row.get('status', 'active'),
                            'opt': opt_value,
                            'vdc': row.get('vdc', '50 V')
                        }
                        new_data.append(new_entry)
                    
                    # Tulis ulang dengan format baru
                    self._write_csv_with_fd(new_data, fd)
                    return new_data
            
            for row in reader:
                normalized = {}
                for key in expected_headers:
                    normalized[key] = row.get(key, '')
                if not normalized.get('id') or not str(normalized.get('id')).isdigit():
                    normalized['id'] = len(data) + 1
                else:
                    normalized['id'] = int(normalized['id'])
                if not normalized.get('opt'):
                    normalized['opt'] = 'PARENT'
                if normalized.get('opt') == 'MAIN':
                    normalized['opt'] = 'PARENT'
                elif normalized.get('opt') == 'UNMAIN':
                    normalized['opt'] = 'CHILD'
                if not normalized.get('vdc'):
                    normalized['vdc'] = '50 V'
                data.append(normalized)
            
            return data
        except Exception as e:
            print(f"❌ Error reading CSV with fd: {e}")
            return []
    
    def _write_csv_with_fd(self, data, fd):
        """Menulis data ke file CSV menggunakan file descriptor yang sudah di-lock"""
        headers = ['id', 'location', 'startTime', 'startAmPm', 'startDate', 'stopTime', 'stopAmPm', 'stopDate', 'status', 'opt', 'vdc']
        
        try:
            fd.seek(0)
            fd.truncate()
            
            writer = csv.DictWriter(fd, fieldnames=headers)
            writer.writeheader()
            
            for idx, row in enumerate(data, 1):
                clean_row = {}
                for header in headers:
                    if header == 'id':
                        clean_row[header] = row.get('id', idx)
                    else:
                        clean_row[header] = row.get(header, '')
                if not clean_row.get('opt'):
                    clean_row['opt'] = 'PARENT'
                if clean_row.get('opt') == 'MAIN':
                    clean_row['opt'] = 'PARENT'
                elif clean_row.get('opt') == 'UNMAIN':
                    clean_row['opt'] = 'CHILD'
                if not clean_row.get('vdc'):
                    clean_row['vdc'] = '50 V'
                writer.writerow(clean_row)
            
            fd.flush()
            print(f"✅ Data written to {CSV_FILE} with lock")
            return True
        except Exception as e:
            print(f"❌ Error writing CSV with fd: {e}")
            return False

# Global instance
request_processor = RequestProcessor()

# ==================== CSV FUNCTIONS (PUBLIC) ====================
def read_csv():
    """Membaca file CSV (tanpa lock - untuk read only)"""
    if not os.path.exists(CSV_FILE):
        print(f"⚠️ File {CSV_FILE} tidak ditemukan, membuat baru...")
        write_csv([])
        return []
    
    data = []
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames
            
            expected_headers = ['id', 'location', 'startTime', 'startAmPm', 'startDate', 'stopTime', 'stopAmPm', 'stopDate', 'status', 'opt', 'vdc']
            
            if headers != expected_headers:
                print(f"⚠️ Header tidak sesuai, rebuild file dengan format baru...")
                old_data = []
                for row in reader:
                    old_data.append(row)
                
                new_data = []
                for idx, row in enumerate(old_data, 1):
                    start_time = row.get('startTime', '')
                    start_ampm = ''
                    start_time_clean = start_time
                    if ' ' in start_time:
                        parts = start_time.rsplit(' ', 1)
                        if len(parts) == 2 and parts[1].upper() in ['AM', 'PM']:
                            start_time_clean = parts[0]
                            start_ampm = parts[1].upper()
                    
                    stop_time = row.get('stopTime', '')
                    stop_ampm = ''
                    stop_time_clean = stop_time
                    if ' ' in stop_time:
                        parts = stop_time.rsplit(' ', 1)
                        if len(parts) == 2 and parts[1].upper() in ['AM', 'PM']:
                            stop_time_clean = parts[0]
                            stop_ampm = parts[1].upper()
                    
                    old_id = row.get('id', '')
                    if old_id and old_id.isdigit():
                        entry_id = int(old_id)
                    else:
                        entry_id = idx
                    
                    opt_value = row.get('opt', 'PARENT')
                    if opt_value == 'MAIN':
                        opt_value = 'PARENT'
                    elif opt_value == 'UNMAIN':
                        opt_value = 'CHILD'
                    
                    new_entry = {
                        'id': entry_id,
                        'location': row.get('location', ''),
                        'startTime': start_time_clean,
                        'startAmPm': start_ampm,
                        'startDate': row.get('startDate', ''),
                        'stopTime': stop_time_clean,
                        'stopAmPm': stop_ampm,
                        'stopDate': row.get('stopDate', ''),
                        'status': row.get('status', 'active'),
                        'opt': opt_value,
                        'vdc': row.get('vdc', '50 V')
                    }
                    new_data.append(new_entry)
                
                write_csv(new_data)
                return new_data
            
            for row in reader:
                normalized = {}
                for key in expected_headers:
                    normalized[key] = row.get(key, '')
                if not normalized.get('id') or not str(normalized.get('id')).isdigit():
                    normalized['id'] = len(data) + 1
                else:
                    normalized['id'] = int(normalized['id'])
                if not normalized.get('opt'):
                    normalized['opt'] = 'PARENT'
                if normalized.get('opt') == 'MAIN':
                    normalized['opt'] = 'PARENT'
                elif normalized.get('opt') == 'UNMAIN':
                    normalized['opt'] = 'CHILD'
                if not normalized.get('vdc'):
                    normalized['vdc'] = '50 V'
                data.append(normalized)
                
        print(f"📊 Loaded {len(data)} rows from CSV")
        return data
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return []

def write_csv(data):
    """Menulis data ke file CSV (dengan lock)"""
    headers = ['id', 'location', 'startTime', 'startAmPm', 'startDate', 'stopTime', 'stopAmPm', 'stopDate', 'status', 'opt', 'vdc']
    
    try:
        with FileLock(CSV_FILE, timeout=30) as fd:
            fd.seek(0)
            fd.truncate()
            
            writer = csv.DictWriter(fd, fieldnames=headers)
            writer.writeheader()
            
            for idx, row in enumerate(data, 1):
                clean_row = {}
                for header in headers:
                    if header == 'id':
                        clean_row[header] = row.get('id', idx)
                    else:
                        clean_row[header] = row.get(header, '')
                if not clean_row.get('opt'):
                    clean_row['opt'] = 'PARENT'
                if clean_row.get('opt') == 'MAIN':
                    clean_row['opt'] = 'PARENT'
                elif clean_row.get('opt') == 'UNMAIN':
                    clean_row['opt'] = 'CHILD'
                if not clean_row.get('vdc'):
                    clean_row['vdc'] = '50 V'
                writer.writerow(clean_row)
            
            fd.flush()
            print(f"✅ Data written to {CSV_FILE}")
            return True
    except TimeoutError as e:
        print(f"❌ Timeout writing CSV: {e}")
        return False
    except Exception as e:
        print(f"❌ Error writing CSV: {e}")
        return False

# ==================== HTML TEMPLATE FIBERSTAR ====================
FIBERSTAR_HTML = '''
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FS Documentation</title>
    <link rel="stylesheet" href="https://ikhdanjoban.vercel.app/reso/nontech/konten/style.min.css">
    <link rel="stylesheet" href="https://ikhdanjoban.vercel.app/reso/nontech/konten/md.min.css">
    <link rel="stylesheet" href="https://ikhdanjoban.vercel.app/reso/nontech/konten/sidebar.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>   
    <!-- Burger Menu Button -->
    <button class="burger-menu" id="burgerMenu" aria-label="Toggle navigation">
        <div class="burger-icon">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
        </div>
    </button>
   
    <!-- Sidebar Overlay (for mobile) -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
   
    <main>
        <nav class="card" aria-label="Navigation">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <span>G</span>
                </div>
                <div class="sidebar-title">
                    <h2>
                        <a href="https://ikhdanjoban.vercel.app/reso/nontech/eng/index.html"
                           style="color: inherit; text-decoration: none; cursor: default;">
                            G-BONE
                        </a>
                    </h2>
                    <p class="sidebar-subtitle">FS Documentation</p>
                </div>
            </div>

            <!-- Tombol akses cepat -->
            <div class="quick-md-access">
                <button id="goToMdBtn">
                    <i class="fas fa-server"></i> Master Device
                </button>
            </div>
           
            <h3>CONVERTER</h3>
            <ul class="nav-list">
                <li><button data-target="konverter-olt">OLT</button></li>
                <li><button data-target="up-down">Inactive OLT</button></li>
                <li><button data-target="sns-shut-noshut">SNS</button></li>  
                <li><button data-target="power">Power</button></li>
                <li><button data-target="prtg" class="active">PRTG Recti</button></li>
            </ul>
            <h3>Case Categories</h3>
            <ul class="nav-list">
                <li><button data-target="cek-users">Check List User ONT</button></li>
                <li><button data-target="cek-int-stat">Check Interface Status PE</button></li>
                <li><button data-target="cek-mac">Check MAC Address</button></li>
                <li><button data-target="cek-desc-port">Check Description Port</button></li>
                <li><button data-target="cek-uptime">Check Uptime</button></li>
                <li><button data-target="cek-power">Check Power RX/TX</button></li>
                <li><button data-target="cek-sfp">Check Type SFP</button></li>
                <li><button data-target="change-sn">Change SN ONT</button></li>
                <li><button data-target="cek-crc">Check & Clear CRC</button></li>
                <li><button data-target="shut-interface">Shut/No Shut Interface</button></li>
                <li><button data-target="cbn">Under CBN</button></li>
                <li><button data-target="dwdm">Under DWDM</button></li>
                <li><button data-target="lms">Under LMS</button></li>
                <li><button data-target="ptt">Add</button></li>
            </ul>

            <h3>MPLS</h3>
            <ul class="nav-list">
                <li><button data-target="cisco">Cisco</button></li>  
                <li><button data-target="huawei">Huawei</button></li>  
                <li><button data-target="mikrotik">Mikrotik</button></li>  
            </ul>
        </nav>
       
        <section class="card content" id="content">
            <div id="loading">Loading content...</div>
        </section>
    </main>
   
    <div class="master-overlay" id="masterOverlay">
        <div class="master-overlay-content" id="masterOverlayContent">
            <button class="master-overlay-close" id="masterOverlayClose" aria-label="Tutup">
                <i class="fas fa-times"></i>
            </button>
            <div id="masterOverlayBody">
            </div>
        </div>
    </div>
   
    <script src="https://ikhdanjoban.vercel.app/reso/nontech/konten/loader.min.js"></script>
</body>
</html>
'''

# ==================== FIND FILE FUNCTION ====================
def find_file(filename):
    """Cari file di berbagai lokasi"""
    search_paths = [
        BASE_DIR,
        os.path.join(BASE_DIR, "temp"),
        os.path.join(BASE_DIR, ".."),
        os.path.dirname(BASE_DIR),
        os.path.join(os.path.dirname(BASE_DIR), "temp"),
        os.path.join(BASE_DIR, "..", "temp")
    ]
    
    for search_dir in search_paths:
        file_path = os.path.join(search_dir, filename)
        if os.path.exists(file_path):
            print(f"[FIND] Found {filename} at {file_path}")
            return file_path
    
    print(f"[FIND] {filename} not found in any search path")
    return None

# ==================== SERVE HTML FILES ====================
@app.route('/')
def serve_index():
    """Serve main page - fiberstar.html integrated"""
    return render_template_string(FIBERSTAR_HTML)

@app.route('/fiberstar.html')
def serve_fiberstar():
    """Serve fiberstar.html from integrated template"""
    return render_template_string(FIBERSTAR_HTML)

# ==================== STATUS & PING ENDPOINTS ====================
@app.route('/status')
def handle_status():
    """Status endpoint"""
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        
        queue_status = request_processor.get_queue_status()
        
        return jsonify({
            "status": "running",
            "port": 5001,
            "timestamp": datetime.now().isoformat(),
            "base_dir": BASE_DIR,
            "cwd": os.getcwd(),
            "python_version": sys.version,
            "server_host": hostname,
            "server_ip": local_ip,
            "queue": queue_status
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ping')
def handle_ping():
    """Ping endpoint"""
    return jsonify({
        "status": "pong",
        "timestamp": datetime.now().isoformat()
    })

# ==================== PRTG API ROUTES (DENGAN QUEUE) ====================

@app.route('/api/prtg', methods=['GET'])
def get_prtg_data():
    """GET data - tetap langsung (read-only, no lock needed)"""
    data = read_csv()
    return jsonify({
        'success': True,
        'data': data,
        'total': len(data)
    })

@app.route('/api/prtg', methods=['POST'])
def add_prtg_data():
    """POST data - menggunakan queue"""
    try:
        req = request.get_json()
        print(f"📥 POST received: {req}")
        
        # Validasi dasar
        location = req.get('location', '').strip()
        if not location:
            return jsonify({'success': False, 'message': 'Lokasi tidak boleh kosong'}), 400
        
        # Tambahkan ke queue
        request_data = {
            'method': 'POST',
            'endpoint': '/api/prtg',
            'data': req
        }
        request_id = request_processor.add_request(request_data)
        
        # Return response awal
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 "{location}" ditambahkan ke antrian (ID: {request_id})',
            'queue_position': len(request_queue)
        })
        
    except Exception as e:
        print(f"❌ POST Error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/status/<request_id>', methods=['GET'])
def get_request_status(request_id):
    """Cek status request di queue dan hasilnya"""
    # Cek apakah sudah selesai
    result = request_processor.get_result(request_id)
    if result:
        return jsonify({
            'status': 'completed',
            'result': result
        })
    
    # Cek apakah masih di queue
    with queue_lock:
        for req in request_queue:
            if req.get('id') == request_id:
                position = list(request_queue).index(req) + 1
                return jsonify({
                    'status': 'queued',
                    'position': position,
                    'total': len(request_queue)
                })
    
    return jsonify({
        'status': 'not_found',
        'message': 'Request ID tidak ditemukan'
    })

@app.route('/api/prtg/queue-status', methods=['GET'])
def get_queue_status():
    """Endpoint untuk melihat status queue"""
    queue_status = request_processor.get_queue_status()
    
    with queue_lock:
        sample = []
        for i, req in enumerate(request_queue):
            if i >= 5:
                break
            sample.append({
                'id': req.get('id'),
                'method': req.get('data', {}).get('method'),
                'endpoint': req.get('data', {}).get('endpoint'),
                'timestamp': datetime.fromtimestamp(req.get('timestamp', 0)).isoformat()
            })
    
    return jsonify({
        'queue_size': queue_status['queue_size'],
        'is_processing': queue_status['is_processing'],
        'sample': sample
    })

@app.route('/api/prtg/done-by-location', methods=['PUT'])
def update_done_by_location():
    try:
        req = request.get_json()
        location = req.get('location', '').strip()
        
        if not location:
            return jsonify({'success': False, 'message': 'Lokasi tidak boleh kosong'}), 400
        
        request_data = {
            'method': 'PUT',
            'endpoint': '/api/prtg/done-by-location',
            'data': {'location': location}
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 "{location}" added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/done-by-location-opt', methods=['PUT'])
def mark_done_by_location_opt():
    try:
        req = request.get_json()
        
        request_data = {
            'method': 'PUT',
            'endpoint': '/api/prtg/done-by-location-opt',
            'data': req
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 Request added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/pause-by-location', methods=['PUT'])
def pause_prtg_by_location():
    try:
        req = request.get_json()
        location = req.get('location', '').strip()
        
        if not location:
            return jsonify({'success': False, 'message': 'Lokasi tidak boleh kosong'}), 400
        
        request_data = {
            'method': 'PUT',
            'endpoint': '/api/prtg/pause-by-location',
            'data': {'location': location}
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 "{location}" added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/unpause-by-location', methods=['PUT'])
def unpause_prtg_by_location():
    try:
        req = request.get_json()
        location = req.get('location', '').strip()
        
        if not location:
            return jsonify({'success': False, 'message': 'Lokasi tidak boleh kosong'}), 400
        
        request_data = {
            'method': 'PUT',
            'endpoint': '/api/prtg/unpause-by-location',
            'data': {'location': location}
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 "{location}" added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/<int:index>', methods=['DELETE'])
def delete_prtg_data(index):
    try:
        request_data = {
            'method': 'DELETE',
            'endpoint': f'/api/prtg/{index}',
            'data': {'index': index}
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 Delete request added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/delete-by-location-opt', methods=['DELETE'])
def delete_prtg_by_location_opt():
    try:
        req = request.get_json()
        
        request_data = {
            'method': 'DELETE',
            'endpoint': '/api/prtg/delete-by-location-opt',
            'data': req
        }
        request_id = request_processor.add_request(request_data)
        
        return jsonify({
            'success': True,
            'queued': True,
            'request_id': request_id,
            'message': f'📤 Delete request added to queue (ID: {request_id})'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/prtg/reset', methods=['POST'])
def reset_prtg_data():
    try:
        if write_csv([]):
            return jsonify({
                'success': True,
                'message': '🗑️ All data reset!'
            })
        else:
            return jsonify({'success': False, 'message': 'Gagal reset data'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== REPORT & STATISTICS ====================
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%m/%d/%Y')
    except:
        try:
            return datetime.strptime(date_str, '%m/%d/%y')
        except:
            return None

def filter_data_by_date(data, period):
    if period == 'all':
        return data
    
    now = datetime.now()
    filtered = []
    
    for item in data:
        start_date = parse_date(item.get('startDate', ''))
        if not start_date:
            continue
            
        if period == '1week':
            if now - start_date <= timedelta(days=7):
                filtered.append(item)
        elif period == '1month':
            if now - start_date <= timedelta(days=30):
                filtered.append(item)
        elif period == '1year':
            if now - start_date <= timedelta(days=365):
                filtered.append(item)
    
    return filtered

@app.route('/api/report', methods=['GET'])
def get_report_data():
    period = request.args.get('period', 'all')
    
    all_data = read_csv()
    filtered_data = filter_data_by_date(all_data, period)
    
    opt_breakdown = {}
    for item in filtered_data:
        opt = item.get('opt', 'Unknown')
        opt_breakdown[opt] = opt_breakdown.get(opt, 0) + 1
    
    return jsonify({
        'success': True,
        'data': filtered_data,
        'total': len(filtered_data),
        'period': period,
        'opt_breakdown': opt_breakdown
    })

@app.route('/api/debug', methods=['GET'])
def debug_data():
    data = read_csv()
    
    opt_breakdown = {}
    for item in data:
        opt = item.get('opt', 'Unknown')
        opt_breakdown[opt] = opt_breakdown.get(opt, 0) + 1
    
    return jsonify({
        'total': len(data),
        'opt_breakdown': opt_breakdown,
        'sample': data[:5] if data else [],
        'all_data': data
    })

# ==================== MAIN ====================
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 G-BONE DataTek Server (DENGAN QUEUE SYSTEM)")
    print("=" * 60)
    print(f"📍 Server URL: http://localhost:5001")
    print(f"📍 Fiberstar: http://localhost:5001/")
    print(f"📍 Fiberstar alt: http://localhost:5001/fiberstar.html")
    print(f"📍 Status: http://localhost:5001/status")
    print(f"📍 Ping: http://localhost:5001/ping")
    print(f"📍 Debug: http://localhost:5001/api/debug")
    print(f"📍 PRTG API: http://localhost:5001/api/prtg")
    print(f"📍 Queue Status: http://localhost:5001/api/prtg/queue-status")
    print(f"📍 Check Request: http://localhost:5001/api/prtg/status/<request_id>")
    print(f"📁 CSV file: {CSV_FILE}")
    print("=" * 60)
    print("📊 QUEUE SYSTEM ACTIVE")
    print("   - Multiple users dapat mengirim request secara bersamaan")
    print("   - Request diproses secara sequential (FIFO)")
    print("   - File locking mencegah data corruption")
    print("   - Setiap request mendapat ID unik untuk tracking")
    print("=" * 60)
    print("✅ Server AKTIF!")
    print("⚠️  Tekan Ctrl+C untuk STOP")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5001)