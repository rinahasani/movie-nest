"use client";

import { Part } from "@/constants/types/Collection";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Card from "../Card";

interface CollectionMoviesProps {
  parts: Part[];
}

const CollectionMovies: React.FC<CollectionMoviesProps> = ({ parts }) => {
  const t = useTranslations("collectionsPage");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {parts.length > 0 ? (
            parts.map((movieCollection: Part) => (
              <Card
                key={movieCollection.id}
                data={movieCollection}
                isExpanded={movieCollection.id === expandedCardId}
                onClick={(id) =>
                  setExpandedCardId((prev) => (prev === id ? null : id))
                }
                onHover={(id) => {
                  if (expandedCardId !== null && expandedCardId !== id) {
                    setExpandedCardId(null);
                  }
                }}
                type={"collectionMovie"}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              {t("noCollectionsFound")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default CollectionMovies;
