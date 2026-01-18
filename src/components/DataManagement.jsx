import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function DataManagement({ cacheStatus, onLoadFile, onUpdateCache, onSaveCache }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold">데이터 캐시 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Load Cache */}
                    <div className="space-y-2">
                        <Label className="text-lg font-semibold">캐시 불러오기</Label>
                        <p className="text-sm text-muted-foreground">이전에 다운로드한 JSON 데이터 파일을 불러와 API 호출을 줄일 수 있습니다. 파일은 브라우저에만 저장되며, 새로고침 시 사라집니다.</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Input type="file" className="w-full cursor-pointer" onChange={onLoadFile} accept=".json" />
                        </div>
                        {cacheStatus && (
                            <p className="text-green-600 text-sm font-semibold mt-1">
                                ✅ 캐시 업데이트됨. {cacheStatus.dateCount}개 날짜 데이터 보유.
                            </p>
                        )}
                    </div>

                    {/* Update/Create Cache */}
                    <div className="space-y-2">
                        <Label className="text-lg font-semibold">캐시 업데이트 / 생성</Label>
                        <p className="text-sm text-muted-foreground">
                            업데이트: 불러온 캐시가 있다면, 오늘까지의 최신 데이터를 API로 가져와 캐시를 보강합니다.<br />
                            신규 생성: 캐시가 없다면, 모든 ETF의 1년치 데이터를 API로 다운로드하여 새 캐시 파일을 생성합니다. (몇 분 이상 소요)
                        </p>
                        <div className="mt-2">
                            <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold" onClick={onUpdateCache}>
                                업데이트된 캐시 저장
                            </Button>
                        </div>
                        <div className="h-4 bg-gray-100 rounded mt-2 overflow-hidden">
                            {/* Progress Bar Placeholder */}
                            <div className="h-full bg-blue-500 w-0"></div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
