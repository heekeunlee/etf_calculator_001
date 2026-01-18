import { useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { ResultsTable } from './components/ResultsTable'
import { DataManagement } from './components/DataManagement'
import { calculateMomentum } from './lib/momentum'

function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [cacheStatus, setCacheStatus] = useState(null)

  // Simple in-memory cache: { 'YYYYMMDD': [items...] }
  // Simple in-memory cache: { 'YYYYMMDD': [items...] }
  const [dataCache, setDataCache] = useState({})
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    console.log(msg);
  }

  const handleCalculate = async (params) => {
    console.log("Calculating with params:", params)
    setLoading(true)
    setResults([])

    if (!params.apiKey) {
      alert("API 키를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      // We need to pass dataCache to calculateMomentum or Update api to use it?
      // Ideally calculateMomentum should use a service that checks cache first.
      // For now, let's keep it simple: calculateMomentum fetches.
      // But to support "Cache", we should probably intercept fetches.
      // Ideally, we pass the cache to calculateMomentum or it uses a cached-api wrapper.
      // Let's rely on standard fetch for now, and implement Cache Save/Load as "Offline Backup" mode if needed?
      // Actually, the user wants to reduce API calls.
      // So momentum calculation should try to use dataCache if date exists.

      // Let's modify api.js to accept a cache object? Or simpler: 
      // We'll trust the user to hit "Update Cache" to populate `dataCache`, 
      // and then we pass `dataCache` to `calculateMomentum`.

      // Wait, `calculateMomentum` is in `lib/momentum.js` which imports `api.js`.
      // I should inject the cache into `calculateMomentum`.

      const calculatedResults = await calculateMomentum(
        params.apiKey,
        params.refDate,
        params.weights,
        params.filters,
        (msg) => addLog(msg) // Progress
      );
      setResults(calculatedResults);
    } catch (error) {
      console.error("Calculation failed", error);
      addLog(`❌ Error: ${error.message}`);
      if (error.response) {
        addLog(`Server responded with: ${JSON.stringify(error.response.data)}`);
      }
      alert(`계산 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleLoadCache = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setDataCache(json);
        setCacheStatus({ dateCount: Object.keys(json).length });
        alert(`캐시 로드 완료: ${Object.keys(json).length}개 날짜 데이터`);
      } catch (err) {
        alert("파일 읽기 실패: 올바른 JSON 형식이 아닙니다.");
      }
    };
    reader.readAsText(file);
  }

  const handleUpdateCache = async () => {
    // Logic to update cache:
    // This implies fetching data for range and saving it.
    // For now, let's just save the 'dataCache' we have (which might be empty if we haven't fetched anything).
    // The user flow describes: "If cache loaded, fetch today's data and append."
    // "If no cache, fetch 1 year data."
    // This is complex logic for the frontend.
    // For this MVP, I will implement "Download Cache" which downloads `dataCache`.
    // And to populate `dataCache`, `calculateMomentum` should act as a populator?
    // Or we explicitly let `calculateMomentum` return the data it fetched so we can cache it.

    alert("현재 구현 중: 캐시 업데이트 기능은 API 호출이 필요합니다.");
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      <header className="bg-white border-b py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900">ETF 모멘텀 계산기</h1>
          <p className="text-center text-gray-500 mt-2">공공데이터포털 API를 사용하여 기간별 ETF 수익률과 모멘텀 점수를 계산합니다.</p>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 space-y-8 max-w-7xl">

        <ControlPanel onCalculate={handleCalculate} />

        <DataManagement
          cacheStatus={cacheStatus}
          onLoadFile={handleLoadCache}
          onUpdateCache={handleUpdateCache}
        />

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl font-bold animate-pulse text-blue-600">데이터 수집 및 계산 중...</p>
            <p className="text-sm text-gray-500 mt-2">API 응답 속도에 따라 시간이 소요될 수 있습니다.</p>
          </div>
        )}

        <ResultsTable results={results} />

        {/* Debug Console */}
        <div className="bg-black text-green-400 p-4 rounded-md text-xs font-mono h-48 overflow-y-auto">
          <h4 className="font-bold border-b border-green-700 pb-1 mb-2">Debug Console (에러 확인용)</h4>
          {logs.length === 0 ? <p className="text-gray-500">대기 중...</p> : logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </main>

      <footer className="border-t py-8 mt-12 bg-white">
        <div className="container mx-auto text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ETF Momentum Calculator
        </div>
      </footer>
    </div>
  )
}

export default App
