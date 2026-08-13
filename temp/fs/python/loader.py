# loader.py
import os
import sys
import subprocess
import requests
import time
import shutil
import hashlib
import traceback
from datetime import datetime, timedelta
import pytz
from pathlib import Path

class Loader:
    def __init__(self):
        self.url = "https://ikhdanjoban.vercel.app/reso/nontech/konten/python/live-server.py"
        self.loader_dir = os.path.dirname(os.path.abspath(__file__))
        self.temp_dir = os.path.join(self.loader_dir, 'temp')
        self.local_py = os.path.join(self.temp_dir, 'live-server.py')
        self.local_pyc = os.path.join(self.temp_dir, 'live-server.pyc')
        self.prtg_csv = os.path.join(self.temp_dir, 'prtg.csv')
        self.current_hash = None
        self.server_process = None
        self.wib_tz = pytz.timezone('Asia/Jakarta')
        self.last_update_check = None
        
    def setup_temp_directory(self):
        """Setup temp directory dan file prtg.csv"""
        # Buat folder temp
        if not os.path.exists(self.temp_dir):
            os.makedirs(self.temp_dir)
            print(f"📁 Created temp directory: {self.temp_dir}")
        else:
            print(f"📁 Temp directory exists: {self.temp_dir}")
        
        # Pastikan prtg.csv ada di temp
        self.ensure_prtg_csv()
    
    def ensure_prtg_csv(self):
        """Memastikan file prtg.csv ada di folder temp"""
        if not os.path.exists(self.prtg_csv):
            print(f"📄 Creating prtg.csv in temp folder...")
            headers = ['id', 'location', 'startTime', 'startAmPm', 'startDate', 
                       'stopTime', 'stopAmPm', 'stopDate', 'status', 'opt', 'vdc']
            
            try:
                with open(self.prtg_csv, 'w', encoding='utf-8') as f:
                    f.write(','.join(headers) + '\n')
                print(f"✅ Created: {self.prtg_csv}")
            except Exception as e:
                print(f"❌ Failed to create prtg.csv: {e}")
                # Fallback ke direktori utama
                fallback_csv = os.path.join(self.loader_dir, 'prtg.csv')
                try:
                    with open(fallback_csv, 'w', encoding='utf-8') as f:
                        f.write(','.join(headers) + '\n')
                    print(f"✅ Created fallback: {fallback_csv}")
                    self.prtg_csv = fallback_csv
                except Exception as e2:
                    print(f"❌ Failed to create fallback: {e2}")
        else:
            print(f"✅ prtg.csv exists: {self.prtg_csv}")
        
        return self.prtg_csv
    
    def get_remote_hash(self):
        """Get hash dari file remote tanpa download"""
        try:
            response = requests.head(self.url)
            response.raise_for_status()
            
            # Coba dapatkan ETag atau Last-Modified
            etag = response.headers.get('ETag')
            last_modified = response.headers.get('Last-Modified')
            
            if etag:
                return etag.strip('"')
            elif last_modified:
                return last_modified
            else:
                # Fallback: download small portion untuk hash
                response = requests.get(self.url, stream=True)
                response.raise_for_status()
                
                # Baca pertama 1KB untuk hash
                content = response.raw.read(1024)
                return hashlib.md5(content).hexdigest()
                
        except Exception as e:
            print(f"⚠️ Failed to get remote hash: {e}")
            return None
    
    def get_local_hash(self):
        """Get hash dari file lokal"""
        if not os.path.exists(self.local_py):
            return None
        
        try:
            with open(self.local_py, 'rb') as f:
                content = f.read()
                return hashlib.md5(content).hexdigest()
        except Exception as e:
            print(f"⚠️ Failed to get local hash: {e}")
            return None
    
    def download_file(self):
        """Download file dari URL"""
        try:
            print(f"📥 Downloading from: PUBLIC")
            response = requests.get(self.url, stream=True)
            response.raise_for_status()
            
            with open(self.local_py, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"✅ File downloaded to: {self.local_py}")
            return True
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return False
    
    def compile_to_pyc(self):
        """Compile Python file ke .pyc dan hapus .py asli"""
        try:
            import py_compile
            
            # Compile ke .pyc
            pyc_file = self.local_py + 'c'
            py_compile.compile(self.local_py, cfile=pyc_file, doraise=True)
            
            print(f"✅ Compiled to: {pyc_file}")
            
            # Hapus file .py asli setelah berhasil compile
            if os.path.exists(self.local_py):
                os.remove(self.local_py)
                print(f"🗑️ Removed source file: {self.local_py}")
            
            # Pindahkan ke lokasi yang benar
            if os.path.exists(pyc_file) and os.path.dirname(pyc_file) != self.temp_dir:
                shutil.move(pyc_file, self.local_pyc)
                print(f"📁 Moved pyc to: {self.local_pyc}")
            
            # Update hash
            self.current_hash = self.get_local_hash()
            
            return True
        except Exception as e:
            print(f"❌ Compilation failed: {e}")
            traceback.print_exc()
            return False
    
    def stop_server(self):
        """Stop server yang sedang berjalan"""
        if self.server_process and self.server_process.poll() is None:
            print("🛑 Stopping old server...")
            self.server_process.terminate()
            time.sleep(2)
            if self.server_process.poll() is None:
                self.server_process.kill()
            self.server_process = None
            print("✅ Server stopped")
    
    def start_server(self):
        """Start server dari pyc"""
        try:
            if not os.path.exists(self.local_pyc):
                print("❌ pyc file not found")
                return False
            
            # Stop server lama jika ada
            self.stop_server()
            
            print("=" * 60)
            print("🚀 Starting server from pyc file...")
            print("=" * 60)
            
            # Set environment variable untuk menunjukkan CSV di temp
            env = os.environ.copy()
            env['PRTG_CSV_PATH'] = self.prtg_csv
            
            # Jalankan pyc dengan subprocess
            self.server_process = subprocess.Popen(
                [sys.executable, self.local_pyc],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1,
                env=env,
                cwd=self.temp_dir  # Set working directory ke temp
            )
            
            # Tampilkan output awal
            print("📋 Server output:")
            print("-" * 60)
            
            # Baca beberapa baris pertama untuk memastikan server jalan
            for _ in range(10):  # Baca 10 baris pertama
                if self.server_process.stdout:
                    line = self.server_process.stdout.readline()
                    if line:
                        print(line, end='')
                    else:
                        break
            
            print("-" * 60)
            print("✅ Server started successfully!")
            print(f"📌 PID: {self.server_process.pid}")
            print(f"📌 CSV Path: {self.prtg_csv}")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            traceback.print_exc()
            return False
    
    def should_check_update(self):
        """Cek apakah sudah waktunya update (setiap hari jam 00:00 WIB)"""
        now_wib = datetime.now(self.wib_tz)
        
        # Cek apakah sekarang jam 00:00 (antara 00:00:00 - 00:00:59)
        if now_wib.hour == 0 and now_wib.minute == 0:
            # Cek apakah sudah pernah check hari ini
            today = now_wib.date()
            
            if self.last_update_check is None or self.last_update_check.date() != today:
                return True
        
        return False
    
    def check_and_update(self):
        """Cek apakah ada update dan lakukan jika perlu"""
        now_wib = datetime.now(self.wib_tz)
        print("\n" + "=" * 60)
        print(f"🔍 Daily update check at {now_wib.strftime('%H:%M:%S')} WIB")
        print("=" * 60)
        
        # Get remote hash
        remote_hash = self.get_remote_hash()
        if not remote_hash:
            print("⚠️ Cannot check remote version, skipping...")
            return False
        
        print(f"📌 Remote hash: {remote_hash}")
        
        # Get local hash
        local_hash = self.get_local_hash() if os.path.exists(self.local_py) else None
        print(f"📌 Local hash: {local_hash if local_hash else 'None'}")
        
        # Check if update needed
        if not local_hash or local_hash != remote_hash:
            print("🔄 New version detected! Updating...")
            
            # Download new file
            if not self.download_file():
                print("❌ Download failed, keeping old version")
                return False
            
            # Compile to pyc
            if not self.compile_to_pyc():
                print("❌ Compilation failed")
                return False
            
            # Restart server with new version
            if self.start_server():
                print("✅ Server updated and restarted successfully!")
                return True
            else:
                print("❌ Failed to restart server")
                return False
        else:
            print("✅ No updates needed, version is current")
            return False
    
    def get_next_check_time(self):
        """Hitung waktu sampai check berikutnya (besok jam 00:00 WIB)"""
        now_wib = datetime.now(self.wib_tz)
        tomorrow = now_wib + timedelta(days=1)
        next_check = datetime(
            tomorrow.year, 
            tomorrow.month, 
            tomorrow.day, 
            0, 0, 0,
            tzinfo=self.wib_tz
        )
        seconds_until = (next_check - now_wib).total_seconds()
        return seconds_until
    
    def run(self):
        """Main loop untuk loader"""
        print("=" * 60)
        print("🔄 G-BONE DataTek Loader (Daily Update)")
        print("=" * 60)
        print(f"📍 Timezone: WIB (Asia/Jakarta)")
        print(f"📍 Update schedule: Every day at 00:00 WIB")
        print("=" * 60)
        
        # Setup
        self.setup_temp_directory()
        
        # Initial download dan start
        print("📥 Initial setup...")
        if not os.path.exists(self.local_pyc):
            print("🔧 First time setup, downloading and compiling...")
            if self.download_file() and self.compile_to_pyc():
                print("✅ Initial setup completed")
                self.start_server()
            else:
                print("❌ Initial setup failed")
                return
        else:
            print("✅ Found existing pyc file")
            # Cek apakah perlu update di awal
            if self.should_check_update():
                print("🔄 Running initial daily update check...")
                self.check_and_update()
                self.last_update_check = datetime.now(self.wib_tz)
            else:
                # Start existing server
                self.start_server()
        
        # Main loop
        print("\n" + "=" * 60)
        print("🔄 Daily update monitor started")
        print(f"📌 Next check: Tomorrow at 00:00 WIB")
        print("⚠️  Press Ctrl+C to stop")
        print("=" * 60)
        
        try:
            while True:
                # Cek setiap menit apakah sudah waktunya update
                if self.should_check_update():
                    print(f"⏰ Daily update time reached!")
                    self.check_and_update()
                    self.last_update_check = datetime.now(self.wib_tz)
                
                # Tampilkan countdown setiap jam
                now_wib = datetime.now(self.wib_tz)
                if now_wib.minute == 0 and now_wib.second == 0:
                    hours_until = 24 - now_wib.hour
                    if hours_until == 24:
                        hours_until = 0
                    print(f"⏰ Next daily check in {hours_until} hours (at 00:00 WIB)")
                
                # Cek apakah server masih berjalan
                if self.server_process and self.server_process.poll() is not None:
                    print(f"⚠️ Server process died (exit code: {self.server_process.returncode})")
                    print("🔄 Attempting to restart server...")
                    self.start_server()
                
                # Sleep 60 detik sebelum cek lagi
                time.sleep(60)
                
        except KeyboardInterrupt:
            print("\n" + "=" * 60)
            print("🛑 Shutting down loader...")
            self.stop_server()
            print("👋 Loader stopped")
            print("=" * 60)
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            traceback.print_exc()
            self.stop_server()

def main():
    # Install pytz jika belum ada
    try:
        import pytz
    except ImportError:
        print("📦 Installing pytz...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pytz"])
        import pytz
    
    # Install requests jika belum ada
    try:
        import requests
    except ImportError:
        print("📦 Installing requests...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        import requests
    
    loader = Loader()
    loader.run()

if __name__ == "__main__":
    main()