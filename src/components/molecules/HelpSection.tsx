import { Phone, Headphones, MessageCircle, Sparkles } from "lucide-react";

interface HelpSectionProps {
  phoneNumber: string;
}

export const HelpSection = ({ phoneNumber }: HelpSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-pink-50 to-orange-50 rounded-2xl p-5 sm:p-6 shadow-lg border border-orange-100">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-pink-200/30 rounded-full blur-2xl" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Butuh bantuan?
              <Sparkles className="w-4 h-4 text-orange-500" />
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Tim support kami siap membantu 24/7
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
            <Phone className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Call Center:</span>
            <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {phoneNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Live Chat</span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="relative mt-4 pt-4 border-t border-orange-100">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            Respons cepat &lt; 5 menit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
            Support 24 jam
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Konsultasi gratis
          </span>
        </div>
      </div>
    </div>
  );
};
