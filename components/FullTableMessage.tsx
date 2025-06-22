export function FullTableMessage({ children }: { children: React.ReactNode }) {
    return (
      <tr>
        <td colSpan={80} className="h-96">
          <div className="flex flex-col h-full flex-1 grow items-center justify-center">{children}</div>
        </td>
      </tr>
    );
  }
  