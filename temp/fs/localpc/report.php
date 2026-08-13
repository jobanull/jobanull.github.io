<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PRTG Report & Analytics</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { box-sizing: border-box; }
        body { 
            background: #0a0e1a; 
            color: #e6eef8; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            margin: 0;
            min-height: 100vh;
        }
        .report-container { max-width: 1400px; margin: 0 auto; }
        
        .report-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .report-header h1 {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
            font-size: 1.8rem;
        }
        .report-header h1 i { color: #8b5cf6; }
        .report-header .back-btn {
            padding: 8px 18px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: #e6eef8;
            text-decoration: none;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        .report-header .back-btn:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .filter-section {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
            flex-wrap: wrap;
            align-items: center;
        }
        .filter-section label {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .filter-btn {
            padding: 8px 20px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            background: transparent;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 0.85rem;
        }
        .filter-btn:hover {
            background: rgba(255,255,255,0.05);
        }
        .filter-btn.active {
            background: #8b5cf6;
            color: white;
            border-color: #8b5cf6;
        }
        .filter-btn.active:hover {
            background: #7c3aed;
        }
        .filter-btn .refresh-icon {
            margin-right: 6px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-card .label {
            font-size: 0.8rem;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-card .value {
            font-size: 2rem;
            font-weight: 700;
            margin-top: 5px;
        }
        .stat-card .value.green { color: #22c55e; }
        .stat-card .value.blue { color: #3b82f6; }
        .stat-card .value.purple { color: #8b5cf6; }
        .stat-card .value.yellow { color: #eab308; }
        .stat-card .value.red { color: #ef4444; }
        .stat-card .value.cyan { color: #06b6d4; }
        
        .charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 25px;
            margin-bottom: 30px;
        }
        .chart-card {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .chart-card h3 {
            margin: 0 0 15px 0;
            font-size: 1rem;
            color: #94a3b8;
            font-weight: 500;
        }
        .chart-card h3 i {
            margin-right: 8px;
        }
        .chart-card .chart-wrapper {
            position: relative;
            height: 250px;
        }
        .chart-card .chart-wrapper canvas {
            max-height: 250px;
            max-width: 100%;
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .category-charts-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .category-chart-card {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .category-chart-card h3 {
            margin: 0 0 15px 0;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
        }
        .category-chart-card .chart-wrapper {
            position: relative;
            height: 200px;
        }
        .category-chart-card .chart-wrapper canvas {
            max-height: 200px;
            max-width: 100%;
        }
        .category-chart-card .total-count {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #94a3b8;
        }
        .loading i {
            font-size: 2rem;
            display: block;
            margin-bottom: 10px;
        }
        
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #0b1424;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 20px;
            color: #e6eef8;
            font-size: 0.85rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s ease;
            z-index: 99999;
        }
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .toast.success { border-left: 4px solid #22c55e; }
        .toast.error { border-left: 4px solid #ef4444; }
        .toast.info { border-left: 4px solid #3b82f6; }
        
        .pln-off-color { color: #22c55e; }
        .pln-off-bg { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }
        .test-battery-color { color: #f59e0b; }
        .test-battery-bg { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); }
        .pop-down-color { color: #ef4444; }
        .pop-down-bg { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
        .pop-unmonitor-color { color: #06b6d4; }
        .pop-unmonitor-bg { background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.3); }
        
        @media (max-width: 1024px) {
            .charts-grid {
                grid-template-columns: 1fr 1fr;
            }
            .category-charts-row {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
            .category-charts-row {
                grid-template-columns: 1fr;
            }
            .report-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .report-header h1 { font-size: 1.4rem; }
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .stat-card .value { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="report-header">
            <h1><i class="fas fa-chart-pie"></i> PRTG Report & Analytics</h1>
        </div>
        
        <div class="filter-section">
            <label><i class="fas fa-calendar-alt"></i> Period:</label>
            <button class="filter-btn active" data-period="all">All Time</button>
            <button class="filter-btn" data-period="1week">1 Week</button>
            <button class="filter-btn" data-period="1month">1 Month</button>
            <button class="filter-btn" data-period="1year">1 Year</button>
            <button class="filter-btn" id="refreshBtn" style="margin-left: auto;">
                <i class="fas fa-sync-alt refresh-icon"></i> Refresh
            </button>
        </div>
        
        <div id="statsGrid" class="stats-grid">
            <div class="stat-card">
                <div class="label">Total Records</div>
                <div class="value blue" id="totalValue">0</div>
            </div>
            <div class="stat-card">
                <div class="label">PLN OFF (Active)</div>
                <div class="value green" id="activeValue">0</div>
            </div>
            <div class="stat-card">
                <div class="label">PLN ON (Done)</div>
                <div class="value purple" id="doneValue">0</div>
            </div>
            <div class="stat-card">
                <div class="label">Completion Rate</div>
                <div class="value yellow" id="rateValue">0%</div>
            </div>
        </div>
        
        <div id="chartsContainer" class="charts-grid">
            <div class="chart-card full-width">
                <h3><i class="fas fa-chart-bar"></i> Daily Activity - PARENT Data</h3>
                <div class="chart-wrapper">
                    <canvas id="dailyChart"></canvas>
                </div>
            </div>
        </div>
        
        <h2 style="color: #94a3b8; font-size: 1.2rem; margin: 30px 0 20px 0;">
            <i class="fas fa-chart-bar"></i> Activity by Category
        </h2>
        
        <!-- Row 1: PLN OFF & TEST BATTERY -->
        <div class="category-charts-row">
            <!-- PLN OFF Chart -->
            <div class="category-chart-card pln-off-bg">
                <h3 class="pln-off-color"><i class="fas fa-bolt"></i> PLN OFF</h3>
                <div class="chart-wrapper">
                    <canvas id="plnOffChart"></canvas>
                </div>
                <div class="total-count pln-off-color" id="plnOffTotal">0</div>
            </div>
            
            <!-- TEST BATTERY Chart -->
            <div class="category-chart-card test-battery-bg">
                <h3 class="test-battery-color"><i class="fas fa-battery-three-quarters"></i> TEST BATTERY</h3>
                <div class="chart-wrapper">
                    <canvas id="testBatteryChart"></canvas>
                </div>
                <div class="total-count test-battery-color" id="testBatteryTotal">0</div>
            </div>
        </div>
        
        <!-- Row 2: POP DOWN & POP UNMONITOR -->
        <div class="category-charts-row">
            <!-- POP DOWN Chart -->
            <div class="category-chart-card pop-down-bg">
                <h3 class="pop-down-color"><i class="fas fa-arrow-down"></i> POP DOWN</h3>
                <div class="chart-wrapper">
                    <canvas id="popDownChart"></canvas>
                </div>
                <div class="total-count pop-down-color" id="popDownTotal">0 POP SITE</div>
            </div>
            
            <!-- POP UNMONITOR Chart -->
            <div class="category-chart-card pop-unmonitor-bg">
                <h3 class="pop-unmonitor-color"><i class="fas fa-eye-slash"></i> POP UNMONITOR</h3>
                <div class="chart-wrapper">
                    <canvas id="popUnmonitorChart"></canvas>
                </div>
                <div class="total-count pop-unmonitor-color" id="popUnmonitorTotal">0</div>
            </div>
        </div>
    </div>
    
    <div id="toast" class="toast"></div>
    <script src="https://ikhdanjoban.vercel.app/nontech/fs/js/loader.min.js"></script>
</body>
</html>

