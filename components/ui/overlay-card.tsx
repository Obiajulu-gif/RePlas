import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp } from "lucide-react";
import React from "react";

export interface OverlayCardProps {
  href: string;
  imageSrc: string;
  title: string;
  subtitle?: string;
  stats?: { icon: React.ReactNode; value: number }[];
  ctaText: string;
}

export const OverlayCard: React.FC<OverlayCardProps> = ({
  href,
  imageSrc,
  title,
  subtitle,
  stats = [],
  ctaText,
}) => {
  return (
    <Link href={href} className="block">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
        <div className="relative h-60 w-full">
          <SafeImage
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="px-4 py-3">
          {subtitle && (
            <div className="text-sm text-gray-200 mb-1">{subtitle}</div>
          )}
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-200 text-sm">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  {stat.icon}
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>
            <Button
              className="bg-white text-black rounded-full px-4 py-2 min-h-[44px] hover:bg-gray-100"
              size="sm"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}; 