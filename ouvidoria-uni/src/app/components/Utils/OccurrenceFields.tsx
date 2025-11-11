/* eslint-disable @next/next/no-img-element */
import { HTMLProps, ReactElement, forwardRef, useState } from "react";
import { FaSpinner, FaUpload } from "react-icons/fa";

type CommonFieldProps = {
  label?: string;
  error?: string;
};

export type TextAreaFieldProps = HTMLProps<HTMLTextAreaElement> &
  CommonFieldProps;

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(function TextAreaField({ data, label, error, ...props }, ref) {
  return (
    <label className="block">
      <div className={error ? "text-red-500" : "text-gray-500"}>{label}</div>
      <textarea
        rows={6}
        {...props}
        ref={ref}
        className={[
          "p-2 rounded-lg block mb-3 border w-full",
          error ? "border-red-500" : "border-gray-200",
        ].join(" ")}
      />
    </label>
  );
});

export type TextFieldProps = HTMLProps<HTMLInputElement> & CommonFieldProps;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ data, label, error, ...props }, ref) {
    return (
      <label className="block">
        <div className="text-gray-500">{label}</div>
        <input
          {...props}
          ref={ref}
          className={[
            "p-2 rounded block mb-3 border w-full",
            error ? "border-red-500" : "border-gray-200",
          ].join(" ")}
        />
      </label>
    );
  }
);

export type FileFieldProps = HTMLProps<HTMLInputElement> & {
  onImageUploaded: (filePath: string, imageId: number) => void;
  preview?: string;
  helper?: string | ReactElement;
} & CommonFieldProps;

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  function FileField(
    { label, name, helper, onImageUploaded, preview, ...props },
    ref
  ) {
    const [isLoading, setLoading] = useState(false);

    return (
      <label className="block mb-2">
        <div className="text-gray-500">{label}</div>
        <div className="p-2 rounded mb-1 mt-1 border border-gray-200 w-full flex items-center gap-3 hover:cursor-pointer">
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaUpload />}{" "}
          Enviar arquivo
          <input
            {...props}
            type="file"
            disabled={isLoading}
            onChange={async (e) => {
              try {
                setLoading(true);
                const file = e.target.files?.[0];
                if (file == null) return;

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/files", {
                  method: "POST",
                  body: formData,
                });
                const body = await res.json();

                onImageUploaded(body.filePath, body.imageId);
              } finally {
                setLoading(false);
              }
            }}
            className="hidden"
            ref={ref}
          />
        </div>
        {helper && <p className="text-sm">{helper}</p>}
        {preview && <img src={preview} alt="" className="w-64" />}
      </label>
    );
  }
);

export const Select = forwardRef<
  HTMLSelectElement,
  HTMLProps<HTMLSelectElement> & {
    label?: string;
    containerClass?: string;
    error?: string;
  }
>(function Select({ className, label, containerClass, error, ...props }, ref) {
  return (
    <div className={containerClass}>
      <label className="block mb-2">
        <div className="text-gray-500">{label}</div>
        <select
          {...props}
          className={[
            "p-2 bg-white rounded block mb-3 border w-full",
            error ? "border-red-500" : "border-gray-200",
            className,
          ].join(" ")}
          ref={ref}
        />
        <p className="text-sm text-red-500">{error}</p>
      </label>
    </div>
  );
});
