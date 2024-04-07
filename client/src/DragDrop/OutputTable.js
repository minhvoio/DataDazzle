export function OutputTable({ output }) {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-start">Column</th>
          <th className="px-4 py-2 text-start">Type</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(output).map(([key, value], index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-slate-200" : ""}>
            <td className="border px-4 py-2">{key}</td>
            <td className="border px-4 py-2">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
