export default function TaskSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse h-48">
            <div className="flex justify-between items-start">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
        </div>
    );
}
