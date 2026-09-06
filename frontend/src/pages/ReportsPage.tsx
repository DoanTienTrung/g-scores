import { Panel } from '../components/Panel';
import { ScoreDistributionChart } from '../components/ScoreDistributionChart';
import { TopStudentsTable } from '../components/TopStudentsTable';
import { useApiResource } from '../hooks/useApiResource';
import type { Statistics, TopStudents } from '../api/types';

export function ReportsPage() {
  const statistics = useApiResource<Statistics>('/reports/statistics');
  const topStudents = useApiResource<TopStudents>('/reports/top-students?group=A');

  return (
    <div className="space-y-6">
      <Panel
        title="Phổ điểm theo môn"
        description="Số thí sinh ở từng mức điểm, tính trên toàn quốc"
        status={statistics.status}
        error={statistics.error}
        onRetry={statistics.reload}
      >
        {statistics.data && <ScoreDistributionChart statistics={statistics.data} />}
      </Panel>

      <Panel
        title={`Top 10 ${topStudents.data?.displayName ?? 'khối A'}`}
        description="Tổng điểm Toán + Vật lí + Hoá học, cao nhất xếp trước"
        status={topStudents.status}
        error={topStudents.error}
        onRetry={topStudents.reload}
      >
        {topStudents.data && <TopStudentsTable report={topStudents.data} />}
      </Panel>
    </div>
  );
}
