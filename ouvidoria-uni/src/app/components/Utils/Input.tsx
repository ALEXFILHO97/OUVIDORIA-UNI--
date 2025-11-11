import { HTMLProps, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & {
    label?: string;
    containerClass?: string;
    error?: string;
  }
>(function Input({ className, label, containerClass, error, ...props }, ref) {
  return (
    <div className={containerClass}>
      <label>
        <div className="block text-sm font-medium text-white mb-1">{label}</div>
        <div>
          <input
            {...props}
            className={[
              "block border rounded-lg px-4 py-1 w-full focus:ring focus:outline-none transition-shadow text-black",
              error ? "border-red-500" : "border-gray-300",
              className,
            ].join(" ")}
            ref={ref}
          />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </label>
    </div>
  );
});
