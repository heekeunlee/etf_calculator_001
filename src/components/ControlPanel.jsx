import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'

export function ControlPanel({ onCalculate }) {
    const [apiKey, setApiKey] = useState('')
    const [refDate, setRefDate] = useState(new Date().toISOString().split('T')[0])
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

    // Format date for display like "2026. 01. 18."
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}.`;
    }

    return (
        <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
                {/* API Key and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-base">공공데이터포털 서비스 키</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="서비스 키 입력"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="refDate" className="text-base">기준일</Label>
                        <div className="relative">
                            <Input
                                id="refDate"
                                type="date"
                                value={refDate}
                                onChange={(e) => setRefDate(e.target.value)}
                                className="h-12 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Weights & Filters Row */}
                <div className="flex flex-wrap items-end justify-center gap-4 pt-4">
                    {/* Weights */}
                    {[
                        { id: 'w1w', label: '1주 가중치' },
                        { id: 'w2w', label: '2주 가중치' },
                        { id: 'w1m', label: '1개월 가중치' },
                        { id: 'w3m', label: '3개월 가중치' },
                        { id: 'w6m', label: '6개월 가중치' },
                    ].map((item) => (
                        <div key={item.id} className="w-20 space-y-2 text-center">
                            <Label htmlFor={item.id} className="text-xs font-semibold">{item.label}</Label>
                            <Input
                                id={item.id}
                                type="number"
                                value={weights[item.id]}
                                onChange={(e) => setWeights({ ...weights, [item.id]: Number(e.target.value) })}
                                className="text-center h-10 px-1"
                            />
                        </div>
                    ))}

                    {/* Filters */}
                    <div className="w-24 space-y-2 text-center">
                        <Label htmlFor="minVolume" className="text-xs font-semibold">최소 거래량 (만주)</Label>
                        <Input
                            id="minVolume"
                            type="number"
                            value={filters.minVolume}
                            onChange={(e) => setFilters({ ...filters, minVolume: Number(e.target.value) })}
                            className="text-center h-10 px-1"
                        />
                    </div>
                    <div className="w-28 space-y-2 text-center">
                        <Label htmlFor="minAmount" className="text-xs font-semibold">최소 거래대금 (억원)</Label>
                        <Input
                            id="minAmount"
                            type="number"
                            value={filters.minAmount}
                            onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                            className="text-center h-10 px-1"
                        />
                    </div>
                    <div className="w-20 space-y-2 text-center">
                        <Label htmlFor="showCount" className="text-xs font-semibold">표시 순위</Label>
                        <Input
                            id="showCount"
                            type="number"
                            value={filters.showCount}
                            onChange={(e) => setFilters({ ...filters, showCount: Number(e.target.value) })}
                            className="text-center h-10 px-1"
                        />
                    </div>
                    <div className="w-24 space-y-2 text-center">
                        <Label htmlFor="compareDays" className="text-xs font-semibold">순위 비교 기간(일)</Label>
                        <Input
                            id="compareDays"
                            type="number"
                            value={filters.compareDays}
                            onChange={(e) => setFilters({ ...filters, compareDays: Number(e.target.value) })}
                            className="text-center h-10 px-1"
                        />
                    </div>

                    {/* Action Buttons */}
                    <Button
                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold ml-2"
                        onClick={() => onCalculate({ apiKey, refDate, weights, filters })}
                    >
                        모멘텀 계산하기
                    </Button>

                    <Button variant="secondary" className="h-10 px-6 font-bold" disabled>
                        신규 ETF 보기 (48)
                    </Button>

                </div>

                {/* Extra Filters */}
                <div className="border-t pt-4">
                    <div className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                        <span>▶ 보조 지표 필터링 (선택 사항)</span>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <Button variant="secondary" className="w-32 bg-gray-500 hover:bg-gray-600 text-white font-bold">
                        결과 분석하기
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}
