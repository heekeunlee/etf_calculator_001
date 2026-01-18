import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export function ResultsTable({ results }) {
    // Placeholder data if no results
    const data = results || [];

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold">계산 결과</CardTitle>
                        <span className="text-sm text-muted-foreground">( 기타 102 IT 71 채권/혼합 52 산업재 12 자유소비재 9 ... )</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                    <Button variant="default" size="sm" className="bg-blue-600 rounded-full px-4">전체 보기</Button>
                    {['IT', '금융', '헬스케어', '산업재', '자유소비재', '에너지', '소재', '통신'].map(cat => (
                        <Button key={cat} variant="secondary" size="sm" className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">{cat}</Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-2 border-b">현재 순위 ▼</th>
                                <th className="p-2 border-b">순위 변동</th>
                                <th className="p-2 border-b text-left">종목명</th>
                                <th className="p-2 border-b text-right">종가</th>
                                <th className="p-2 border-b text-right">전일대비</th>
                                <th className="p-2 border-b text-right">등락률(%)</th>
                                <th className="p-2 border-b text-right">NAV</th>
                                <th className="p-2 border-b text-right">거래량 (만주)</th>
                                <th className="p-2 border-b text-right">거래대금 (억원)</th>
                                <th className="p-2 border-b text-right">시가총액 (억원)</th>
                                <th className="p-2 border-b">기준일</th>
                                <th className="p-2 border-b text-right text-red-600 font-bold">모멘텀 점수</th>
                                <th className="p-2 border-b text-right text-red-500">1주 수익률</th>
                                <th className="p-2 border-b text-right text-red-500">2주 수익률</th>
                                <th className="p-2 border-b text-right text-red-500">1개월 수익률</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="15" className="p-8 text-center text-muted-foreground">
                                        데이터가 없습니다. "모멘텀 계산하기"를 눌러주세요.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 border-b last:border-0">
                                        <td className="p-2">{idx + 1}</td>
                                        <td className="p-2 text-red-500">▲ {Math.floor(Math.random() * 100)}</td>
                                        <td className="p-2 text-left font-medium text-blue-600">{item.itmsNm}</td>
                                        <td className="p-2 text-right">{Number(item.clpr).toLocaleString()}</td>
                                        <td className="p-2 text-right text-red-500">▲ {Number(item.vs).toLocaleString()}</td>
                                        <td className="p-2 text-right text-red-500">{item.fltRt}%</td>
                                        <td className="p-2 text-right">{Number(item.nav || 0).toLocaleString()}</td>
                                        <td className="p-2 text-right">{Math.round(item.trqu / 10000).toLocaleString()}</td>
                                        <td className="p-2 text-right">{Math.round(item.trPrc / 100000000).toLocaleString()}</td>
                                        <td className="p-2 text-right">{Number(item.mrktTotAmt || 0).toLocaleString()}</td>
                                        <td className="p-2">{item.basDt}</td>
                                        <td className="p-2 text-right font-bold text-red-600">{item.momentumScore?.toFixed(2)}</td>
                                        <td className="p-2 text-right text-red-500">{item.returns?.w1?.toFixed(2)}%</td>
                                        <td className="p-2 text-right text-red-500">{item.returns?.w2?.toFixed(2)}%</td>
                                        <td className="p-2 text-right text-red-500">{item.returns?.m1?.toFixed(2)}%</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
