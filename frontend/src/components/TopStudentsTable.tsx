import type { TopStudents } from '../api/types';

export function TopStudentsTable({ report }: { report: TopStudents }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Số báo danh</th>
            {report.subjects.map((subject) => (
              <th key={subject.code} className="px-4 py-3 text-right font-medium">
                {subject.displayName}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {report.students.map((student) => (
            <tr
              key={student.sbd}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3 text-slate-400 tabular-nums">
                {student.rank}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900 tabular-nums">
                {student.sbd}
              </td>
              {student.scores.map((subject) => (
                <td
                  key={subject.code}
                  className="px-4 py-3 text-right text-slate-700 tabular-nums"
                >
                  {subject.score?.toFixed(2)}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-semibold text-indigo-900 tabular-nums">
                {student.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
