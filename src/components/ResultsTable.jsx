import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export function ResultsTable({ results }) {
    // Placeholder data if no results
    const data = results || [];

    return (
        <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            계산 결과
                            <span className="text-sm font-normal text-muted-foreground hidden sm:inline">( 상위 20개 종목 )</span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground sm:hidden">상위 20개 종목을 표시합니다.</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                    <Button variant="default" size="sm" className="bg-blue-600 rounded-full px-4 text-xs h-8">전체</Button>
                    {['IT', '금융', '헬스케어', '산업재', '소비재'].map(cat => (
                        <Button key={cat} variant="secondary" size="sm" className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs h-8">{cat}</Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">

                {/* Mobile View: Cards */}
                <div className="block md:hidden bg-gray-50">
                    {data.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            데이터가 없습니다.<br />"모멘텀 계산하기"를 눌러주세요.
                        </div>
                    ) : (
                        <div className="space-y-3 p-4">
                            {data.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                    {/* Rank Badge */}
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                                        {idx + 1}위
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight pr-12 break-keep">{item.itmsNm}</h3>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-900">{Number(item.clpr).toLocaleString()}원</div>
                                                <div className={`text-xs font-medium ${Number(item.fltRt) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {Number(item.fltRt) >= 0 ? '▲' : '▼'} {Number(item.vs).toLocaleString()} ({item.fltRt}%)
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">모멘텀 점수</span>
                                                <span className="text-lg font-bold text-red-600">{item.momentumScore?.toFixed(2)}점</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs text-gray-500">1개월 수익률</span>
                                                <span className={`font-bold ${item.returns?.m1 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {item.returns?.m1?.toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-xs text-center border-t pt-2 text-gray-600">
                                            <div>
                                                <div className="text-gray-400 mb-0.5">1주</div>
                                                <div className={`${item.returns?.w1 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.w1?.toFixed(2)}%</div>
                                            </div>
                                            <div className="border-l border-r border-gray-100 px-1">
                                                <div className="text-gray-400 mb-0.5">3개월</div>
                                                <div className={`${item.returns?.m3 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.m3?.toFixed(2)}%</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 mb-0.5">거래량</div>
                                                <div>{Math.round(item.trqu / 10000).toLocaleString()}만</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-y">
                            <tr>
                                <th className="p-3">순위</th>
                                <th className="p-3 text-left">종목명</th>
                                <th className="p-3 text-right">현재가</th>
                                <th className="p-3 text-right">등락률</th>
                                <th className="p-3 text-right">거래량(만주)</th>
                                <th className="p-3 text-right text-red-600 font-bold bg-red-50">모멘텀 점수</th>
                                <th className="p-3 text-right">1주</th>
                                <th className="p-3 text-right">1개월</th>
                                <th className="p-3 text-right">3개월</th>
                                <th className="p-3 text-right">6개월</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-muted-foreground">
                                        데이터가 없습니다. "모멘텀 점수 계산하기"를 눌러주세요.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                                        <td className="p-3 font-medium">{idx + 1}</td>
                                        <td className="p-3 text-left">
                                            <div className="font-medium text-gray-900">{item.itmsNm}</div>
                                            <div className="text-xs text-gray-400">{item.srtnCd}</div>
                                        </td>
                                        <td className="p-3 text-right font-medium">{Number(item.clpr).toLocaleString()}</td>
                                        <td className={`p-3 text-right ${Number(item.fltRt) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                            {Number(item.fltRt) >= 0 ? '+' : ''}{item.fltRt}%
                                        </td>
                                        <td className="p-3 text-right text-gray-600">{Math.round(item.trqu / 10000).toLocaleString()}</td>
                                        <td className="p-3 text-right font-bold text-red-600 bg-red-50/50">{item.momentumScore?.toFixed(2)}</td>
                                        <td className={`p-3 text-right ${item.returns?.w1 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.w1?.toFixed(2)}%</td>
                                        <td className={`p-3 text-right ${item.returns?.m1 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.m1?.toFixed(2)}%</td>
                                        <td className={`p-3 text-right ${item.returns?.m3 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.m3?.toFixed(2)}%</td>
                                        <td className={`p-3 text-right ${item.returns?.m6 >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{item.returns?.m6?.toFixed(2)}%</td>
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
