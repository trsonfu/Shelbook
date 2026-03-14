import ExploreGrid from '@/components/post/ExploreGrid'

export default async function ExplorePage() {
  return (
    <div className="min-h-screen py-4">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Discover amazing content from the community
          </p>
        </header>
        <ExploreGrid />
      </div>
    </div>
  )
}

