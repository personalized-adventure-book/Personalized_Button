"use client";

import { useState } from "react";
import { Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CancelOrderModalProps {
  onClose: () => void;
  onSaveAsDraft: () => void;
  onDeleteAndExit: () => void;
  t: (key: string) => string;
}

export function CancelOrderModal({
  onClose,
  onSaveAsDraft,
  onDeleteAndExit,
  t,
}: CancelOrderModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveAsDraft = async () => {
    setIsProcessing(true);
    try {
      onSaveAsDraft();
      router.push("/orders");
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAndExit = async () => {
    setIsProcessing(true);
    try {
      onDeleteAndExit();
      router.push("/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("modal.cancelOrder.title")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {t("modal.cancelOrder.message")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSaveAsDraft}
            disabled={isProcessing}
            className="w-full btn-primary inline-flex items-center justify-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isProcessing ? t("modal.cancelOrder.saving") : t("modal.cancelOrder.saveAsDraft")}
          </button>

          <button
            onClick={handleDeleteAndExit}
            disabled={isProcessing}
            className="w-full btn-ghost text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 inline-flex items-center justify-center disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isProcessing ? t("modal.cancelOrder.deleting") : t("modal.cancelOrder.deleteAndExit")}
          </button>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full btn-secondary disabled:opacity-50"
          >
            {t("modal.cancelOrder.continueEditing")}
          </button>
        </div>
      </div>
    </div>
  );
}
