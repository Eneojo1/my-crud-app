export default function Payslip() {
  return (
    <div className="mb-6 fixed top-0 left-0 h-full w-full bg-white flex justify-center items-center">
      <div className="max-w-3xl mx-auto mt-6">
        <p className="bg-[#cce8d3] rounded-t-lg mb-4 text-[11px] px-2 py-2.5 border border-[#00ac5b]">
          <span className="text-[#29ac5b]">
            COMPANY NAME:&nbsp;&nbsp;&nbsp;
          </span>
          CarlukeDignity Care Ltd
        </p>

        <div className="flex gap-1.5">
          {/* TABLE 1 */}
          <Table
            topSpacer={true}
            head={[
              { label: "DESCRIPTION", className: col.desc },
              { label: "HOURS", className: col.hours },
              { label: "RATE", className: col.rate },
              { label: "AMOUNT", className: col.amount },
            ]}
            rows={[
              [
                { value: "Basic Hours", className: styles.col_1 },
                { value: "87.00", className: styles.col_2 },
                { value: "13.00", className: styles.col_0 },
                { value: "1131.50", className: styles.col_0 },
              ],
              [
                { value: "Enhanced Rate", className: styles.col_1 },
                { value: "63.50", className: styles.col_2 },
                { value: "14.00", className: styles.col_0 },
                { value: "889.00", className: styles.col_0 },
              ],
              [
                { value: "Mileage", className: styles.col_1 },
                { value: "", className: styles.col_2 },
                { value: "", className: styles.col_0 },
                { value: "213.50", className: styles.col_0 },
              ],
            ]}
            fillerRows={9}
            fillerClasses={{
              0: styles.col_1,
              1: styles.col_2,
              2: styles.col_0,
              3: styles.col_0,
            }}
          />

          {/* TABLE 2 */}
          <Table
            topSpacer={true}
            head={[
              { label: "DESCRIPTION", className: col.descNarrow },
              { label: "AMOUNT", className: col.amountWide },
            ]}
            rows={[
              [
                {
                  value: "PAYE Tax",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "179.20", className: styles.col_0 },
              ],
              [
                {
                  value: "National Insurance",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "77.76", className: styles.col_0 },
              ],
              [
                {
                  value: "NEST Corporation - EE",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "75.00", className: styles.col_0 },
              ],
              [
                {
                  value: "NEST Corporation - ER",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "45.00", className: styles.col_0 },
              ],
              // [
              //   {
              //     value: "Correction",
              //     className: `${styles.fixedWidth} ${styles.des_0}`,
              //   },
              //   { value: "85.55", className: styles.col_0 },
              // ],
            ]}
            fillerRows={7}
            fillerClasses={{
              0: `${styles.fixedWidth} ${styles.col_0}`,
              1: styles.col_0,
            }}
          />

          {/* TABLE 3 */}
          <Table
            topSpacer={true}
            head={[
              { label: "DESCRIPTION", className: col.descWide },
              { label: "AMOUNT", className: "border-l text-center w-30" },
            ]}
            rows={[
              [
                { value: "Total Gross Pay TD", className: styles.des_0 },
                { value: "2605.00", className: styles.col_0 },
              ],
              [
                { value: "Gross for Tax TD", className: styles.des_0 },
                { value: "1945.00", className: styles.col_0 },
              ],
              [
                { value: "Tax Paid TD", className: styles.des_0 },
                { value: "179.20", className: styles.col_0 },
              ],
              [
                { value: "Earnings for NI TD", className: styles.des_0 },
                { value: " 2020.00", className: styles.col_0 },
              ],
              [
                {
                  value: "National Insurance TD",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "77.76", className: styles.col_0 },
              ],
              [
                {
                  value: "Ee Pension TD (inc AVC)",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "75.00", className: styles.col_0 },
              ],
              [
                {
                  value: "Employers Pension TD",
                  className: `${styles.fixedWidth} ${styles.des_0}`,
                },
                { value: "45.00", className: styles.col_0 },
              ],
              [
                { value: "=================", className: styles.des_0 },
                { value: "", className: styles.col_0 },
              ],
              [
                { value: "Earnings for NI", className: styles.des_0 },
                { value: "2020.00", className: styles.col_0 },
              ],
              [
                { value: "Gross for Tax", className: styles.des_0 },
                { value: "1945.00", className: styles.col_0 },
              ],
              [
                { value: "Total Gross Pay", className: styles.des_0 },
                { value: "2605.00", className: styles.col_0 },
              ],
              [
                { value: "NI Number", className: styles.des_0 },
                { value: "SW633011D", className: styles.col_0 },
              ],
            ]}
          />
        </div>

        <div className="mt-1.5 rounded-b-lg border border-[#00ac5b] overflow-hidden">
          <Table
            head={[
              { label: "", className: "text-center py-0.5 w-12" },
              { label: "DATE", className: "border-l text-center w-30" },
              { label: "", className: "border-l text-center w-14" },
              { label: "", className: "border-l text-center w-14" },
              { label: "TAX CODE", className: "border-l text-center w-22" },
              {
                label: "EMPLOYEE No.",
                className: "border-l text-center text-[7px] px-1",
              },
              {
                label: "EMPLOYEE NAME",
                className: "border-l text-center w-[220px]",
              },
              { label: "NET PAY", className: "border-l text-center w-[119px]" },
            ]}
            rows={[
              [
                { value: "", className: styles.col_1 },
                { value: "30 Mar 2026", className: styles.col_01 },
                { value: "", className: styles.col_0 },
                { value: "", className: styles.col_0 },
                { value: "1257L M1", className: styles.col_01 },
                { value: "", className: styles.col_0 },
                { value: "Eneojo Amobeda", className: styles.col_01 },
                { value: "1812.91", className: styles.col_02 },
              ],
            ]}
          />
        </div>
        <p className="text-end text-[#70b267] text-[8.5px] mt-1">
          &copy; 1996 Sage (UK) Limited.
        </p>
      </div>
    </div>
  );
}

const col = {
  desc: "pl-2 py-0.5 w-32",
  hours: "text-end pr-2 w-20",
  rate: "border-l text-center w-22",
  amount: "border-l text-center w-22",
  amountWide: "border-l text-center w-34",
  descNarrow: "text-center w-20 py-0.5",
  descWide: "text-center w-30 py-0.5",
};

const styles = {
  table: "border border-[#00ac5b] text-[11px]",
  col_1: "px-2 py-0 bg-linear-to-r from-[#f3f9f4] to-[#ecf6ee]",
  col_2: "text-end px-2 py-0 bg-linear-to-r from-[#ecf6ee] to-[#e4f2e6]",
  col_0: "text-end pr-8 py-0 bg-linear-to-r from-[#f3f9f4] to-[#ecf6ee]",
  col_01: "text-center bg-linear-to-r from-[#f2f9f3] to-[#e5f3e7] py-2",
  col_02:
    "text-center bg-linear-to-r from-[#f3f9f4] to-[#ecf6ee] font-bold text-[14px]",
  des_0: "px-2 py-0 bg-linear-to-r from-[#f3f9f4] to-[#e4f2e6]",
  fixedWidth: "w-26 max-w-26 whitespace-nowrap overflow-visible",
};

type HeadCell = {
  label: string;
  className?: string;
};

type BodyCell = {
  value: React.ReactNode;
  className?: string;
};

type Props = {
  head: HeadCell[];
  rows: BodyCell[][];
  fillerRows?: number;
  cols?: number;
  fillerClasses?: Record<number, string>;
  topSpacer?: boolean;
  topSpacerClass?: string;
};

const Table = ({
  head,
  rows,
  fillerRows = 0,
  fillerClasses = {},
  topSpacer = false,
  topSpacerClass = "bg-[#cce8d3] h-6",
}: Props) => {
  const cols = head.length;

  return (
    <table className={styles.table}>
      <thead>
        {topSpacer && (
          <tr className={topSpacerClass}>
            <th colSpan={cols} className="h-6"></th>
          </tr>
        )}

        <tr className="text-white bg-[#00ac5b] text-[10px]">
          {head.map((h, i) => (
            <th key={i} className={h.className}>
              {h.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((cell, j) => (
              <td key={j} className={cell.className}>
                {cell.value}
              </td>
            ))}
          </tr>
        ))}

        {Array.from({ length: fillerRows }).map((_, r) => (
          <tr key={`f-${r}`}>
            {Array.from({ length: cols }).map((_, c) => (
              <td
                key={c}
                className={`${fillerClasses[c] || ""} text-transparent`}
              >
                .
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
