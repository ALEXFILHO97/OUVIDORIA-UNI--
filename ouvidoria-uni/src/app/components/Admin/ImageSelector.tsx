"use client";
import type { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

export type ImageSelectorProps = {
  images: ImageType[];
};

export default function ImageSelector({ images }: ImageSelectorProps) {
  const [selected, setSelected] = useState<string | number>(images[0].url);

  const selectedImage = images.find((i) => i.url === selected);
  return (
    <div className="mb-5">
      <div className="mb-3">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={""}
            width={selectedImage.width || 0}
            height={selectedImage.height || 0}
            className="flex-grow bg-gray-300 rounded-2xl object-cover lg:col-span-6 w-full"
            style={{ aspectRatio: 16 / 9 }}
          />
        ) : (
          <div className="bg-gray-300 flex-grow aspect-video" />
        )}
      </div>
      <div className="flex overflow-x-auto center-flex">
        {images.map(({ width, height, url }) => (
          <Image
            src={url}
            key={url}
            alt={""}
            width={width || 0}
            height={height || 0}
            className={[
              "object-cover rounded-2xl hover:cursor-pointer hover:shadow hover:opacity-100 w-32 lg:w-48 transition-opacity mr-3",
              selected == url ? "opacity-100" : "opacity-80",
            ].join(" ")}
            style={{ aspectRatio: 5 / 4 }}
            onClick={() => setSelected(url)}
          />
        ))}
      </div>
    </div>
  );
}
