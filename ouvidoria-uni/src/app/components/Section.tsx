import { HTMLProps } from "react";

type SectionProps = {
  dark?: boolean;
  blue?: boolean;
  white?: boolean;
  noWidthLimit?: boolean;
} & HTMLProps<HTMLDivElement>;

export default function Section({
  className,
  children,
  blue,
  dark,
  white,
  noWidthLimit,
  ...props
}: SectionProps) {
  return (
    <section
      className={[
        "p-8 lg:p-16",
        dark ? "bg-gray-100" : "",
        white ? "bg-white bg-opacity-80" : "",
        blue ? "bg-blue text-white" : "",
        className,
      ].join(" ")}
      {...props}
    >
      <div
        className={
          noWidthLimit
            ? ""
            : "max-w-2xl mx-auto lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl"
        }
      >
        {children}
      </div>
    </section>
  );
}
