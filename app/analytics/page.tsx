import { 
  getPopularDimensions, 
  getPopularColors, 
  getPopularFormats,
  getPopularFeatures,
  getTotalEvents
} from "@/lib/analytics";

export const metadata = {
  title: "Analytics - imges.dev",
  description: "Usage analytics for imges.dev placeholder image generator",
};

export default async function AnalyticsPage() {
  const [
    totalEvents,
    popularDimensions,
    popularBgColors,
    popularFgColors,
    popularFormats,
    popularFeatures,
  ] = await Promise.all([
    getTotalEvents(),
    getPopularDimensions(10),
    getPopularColors("bg", 10),
    getPopularColors("fg", 10),
    getPopularFormats(),
    getPopularFeatures(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Usage statistics for imges.dev
          </p>
          <div className="mt-6 inline-block bg-blue-100 rounded-lg px-6 py-3">
            <span className="text-2xl font-bold text-blue-600">
              {totalEvents.toLocaleString()}
            </span>
            <span className="text-gray-600 ml-2">total images generated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Popular Dimensions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Dimensions
            </h2>
            <div className="space-y-2">
              {popularDimensions.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-700">
                    {item.dimension}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
              {popularDimensions.length === 0 && (
                <p className="text-gray-400 text-sm">No data yet</p>
              )}
            </div>
          </div>

          {/* Popular Background Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Background Colors
            </h2>
            <div className="space-y-2">
              {popularBgColors.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: `#${item.color}` }}
                    />
                    <span className="font-mono text-sm text-gray-700">
                      #{item.color}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
              {popularBgColors.length === 0 && (
                <p className="text-gray-400 text-sm">No data yet</p>
              )}
            </div>
          </div>

          {/* Popular Foreground Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Text Colors
            </h2>
            <div className="space-y-2">
              {popularFgColors.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: `#${item.color}` }}
                    />
                    <span className="font-mono text-sm text-gray-700">
                      #{item.color}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
              {popularFgColors.length === 0 && (
                <p className="text-gray-400 text-sm">No data yet</p>
              )}
            </div>
          </div>

          {/* Popular Formats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Formats
            </h2>
            <div className="space-y-2">
              {popularFormats.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="uppercase font-mono text-sm text-gray-700">
                    {item.format}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: totalEvents > 0
                            ? `${(item.count / totalEvents) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {(totalEvents > 0 ? (item.count / totalEvents) * 100 : 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              {popularFormats.length === 0 && (
                <p className="text-gray-400 text-sm">No data yet</p>
              )}
            </div>
          </div>

          {/* Popular Features */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Popular Features
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {popularFeatures.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.feature.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: totalEvents > 0 
                            ? `${(item.count / totalEvents) * 100}%` 
                            : "0%"
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {popularFeatures.length === 0 && (
                <p className="text-gray-400 text-sm col-span-2">No data yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Analytics are tracked in production only. Data is updated in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
