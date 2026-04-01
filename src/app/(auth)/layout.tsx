import { PartyPopper, Music, Camera, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    {
      icon: Music,
      text: "Sound System Profesional",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      text: "Dokumentasi Event",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: PartyPopper,
      text: "Dekorasi Lengkap",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Sparkles,
      text: "Lighting & Effect",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full">
          {/* Card with Glassmorphism Effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Event Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                🎉 EVENT RENTAL 🎉
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Right Side - Features (Desktop) */}
      <div className="hidden lg:flex w-96 bg-gradient-to-br from-orange-500/10 to-pink-500/10 backdrop-blur-sm relative z-10">
        <div className="flex flex-col justify-center p-12 w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Event Rental
            </h2>
            <p className="text-gray-600">
              Solusi lengkap untuk kebutuhan peralatan event Anda
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {feature.text}
                    </p>
                    <p className="text-xs text-gray-500">Ready to rent</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">500+</p>
                <p className="text-xs text-gray-500">Peralatan Tersedia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">1000+</p>
                <p className="text-xs text-gray-500">Event Sukses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
