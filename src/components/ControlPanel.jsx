import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { CalendarIcon, ChevronDown, ChevronUp, Settings2 } from 'lucide-react'

export function ControlPanel({ onCalculate }) {
    const [apiKey, setApiKey] = useState('')
    const [refDate, setRefDate] = useState(new Date().toISOString().split('T')[0])
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
    const [weights, setWeights] = useState({
        w1w: 48,
        w2w: 24,
        w1m: 12,
        w3m: 4,
        w6m: 2
    })
    const [filters, setFilters] = useState({
        minVolume: 10,
        minAmount: 10,
        showCount: 20,
        compareDays: 7
    })

    return (
        <Card className="w-full shadow-md">
            <CardContent className="space-y-6 pt-6">
                {/* API Key and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-base font-medium">공공데이터포털 서비스 키</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="서비스 키 입력"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="h-12 text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="refDate" className="text-base font-medium">기준일</Label>
                        <div className="relative">
                            <Input
                                id="refDate"
                                type="date"
                                value={refDate}
                                onChange={(e) => setRefDate(e.target.value)}
                                className="h-12 w-full text-lg justify-center"
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Settings Toggle */}
                <div className="border rounded-lg p-2 bg-gray-50">
                    <button
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4" />
                            <span>상세 설정 (가중치 및 필터)</span>
                        </div>
                        {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Collapsible Content */}
                    {isAdvancedOpen && (
                        <div className="pt-4 pb-2 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Weights */}
                            <div className="mb-4">
                                <Label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">가중치 설정</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {[
                                        { id: 'w1w', label: '1주' },
                                        { id: 'w2w', label: '2주' },
                                        { id: 'w1m', label: '1개월' },
                                        { id: 'w3m', label: '3개월' },
                                        { id: 'w6m', label: '6개월' },
                                    ].map((item) => (
                                        <div key={item.id} className="space-y-1">
                                            <Label htmlFor={item.id} className="text-xs text-center block text-gray-600">{item.label}</Label>
                                            <Input
                                                id={item.id}
                                                type="number"
                                                value={weights[item.id]}
                                                onChange={(e) => setWeights({ ...weights, [item.id]: Number(e.target.value) })}
                                                className="text-center h-10 px-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div>
                                <Label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">필터 설정</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="minVolume" className="text-xs block text-gray-600">최소 거래량(만주)</Label>
                                        <Input
                                            id="minVolume"
                                            type="number"
                                            value={filters.minVolume}
                                            onChange={(e) => setFilters({ ...filters, minVolume: Number(e.target.value) })}
                                            className="text-center h-10"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="minAmount" className="text-xs block text-gray-600">최소 거래대금(억)</Label>
                                        <Input
                                            id="minAmount"
                                            type="number"
                                            value={filters.minAmount}
                                            onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                                            className="text-center h-10"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="showCount" className="text-xs block text-gray-600">표시 순위</Label>
                                        <Input
                                            id="showCount"
                                            type="number"
                                            value={filters.showCount}
                                            onChange={(e) => setFilters({ ...filters, showCount: Number(e.target.value) })}
                                            className="text-center h-10"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="compareDays" className="text-xs block text-gray-600">비교 기간(일)</Label>
                                        <Input
                                            id="compareDays"
                                            type="number"
                                            value={filters.compareDays}
                                            onChange={(e) => setFilters({ ...filters, compareDays: Number(e.target.value) })}
                                            className="text-center h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Calculate Button */}
                <Button
                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg rounded-xl transition-all"
                    onClick={() => onCalculate({ apiKey, refDate, weights, filters })}
                >
                    모멘텀 점수 계산하기
                </Button>

                <div className="text-center">
                    <div className="flex justify-center gap-4 text-sm text-gray-500 options">
                        <button className="hover:text-gray-900 border-b border-dashed border-gray-400">신규 ETF 보기 (48)</button>
                        <span>|</span>
                        <button className="hover:text-gray-900 border-b border-dashed border-gray-400">결과 분석하기</button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
