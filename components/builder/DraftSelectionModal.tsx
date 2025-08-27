"use client";

import { useState, useMemo } from "react";
import { Edit3, Plus, Clock, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Draft {
  id: string;
  name: string;
  step: number;
  lastModified: string;
  thumbnail: string;
  config: any;
  timestamp?: number;
}

interface DraftSelectionModalProps {
  drafts: Draft[];
  onSelectDraft: (draft: Draft) => void;
  onStartNew: () => void;
  onDeleteDraft: (draftId: string) => void;
}

export function DraftSelectionModal({
  drafts,
  onSelectDraft,
  onStartNew,
  onDeleteDraft,
}: DraftSelectionModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Determine latest draft by timestamp or lastModified date
  const latestDraftId = useMemo(() => {
    if (!drafts || drafts.length === 0) return null;
    return drafts.reduce((latest, d) => {
      const latestTime = Date.parse(latest.lastModified || '') || latest.timestamp || 0;
      const currentTime = Date.parse(d.lastModified || '') || (d as any).timestamp || 0;
      return currentTime > latestTime ? d : latest;
    }).id;
  }, [drafts]);

  const handleDeleteDraft = async (draftId: string) => {
    setDeletingId(draftId);
    try {
      onDeleteDraft(draftId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("draft.continueOrStartNew")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t("draft.youHaveDrafts")
              .replace("{count}", drafts.length.toString())
              .replace("{plural}", drafts.length !== 1 ? "s" : "")}
          </p>
        </div>

        {/* Start New Button */}
        <div className="mb-6">
          <button
            onClick={onStartNew}
            className="w-full btn-primary inline-flex items-center justify-center py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("draft.startNewOrder")}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              {t("draft.orContinueFromDraft")}
            </span>
          </div>
        </div>

        {/* Drafts List */}
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="card card-dark p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => onSelectDraft(draft)}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: draft.thumbnail }}
                  >
                    <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {draft.name || `Draft ${draft.id.slice(-4)}`}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Edit3 className="w-3 h-3" />
                        <span>{t("draft.stepOfFive").replace("{step}", draft.step.toString())}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{draft.lastModified}</span>
                      </div>
                    </div>

                    {/* Progress Bar - only for latest draft */}
                    {draft.id === latestDraftId && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(draft.step / 5) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteDraft(draft.id)}
                  disabled={deletingId === draft.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("draft.clickToContinue")}
          </p>
        </div>
      </div>
    </div>
  );
}
