export default function Category() {
  const Card = ({ article }) => (
    <div className=" space-y-2">
      <img src={article.image} alt="" className="rounded-xl w-full h-[160px] object-cover" />
      <div className="text-sm text-gray-600 flex items-center gap-1">
        <span className="text-black font-medium">{article.source}</span>
        • {article.time}
      </div>
      <h3 className="font-semibold text-[17px] leading-tight">{article.title}</h3>
      <div className="text-sm text-gray-600">
        <span className="text-red-500 font-medium">{article.category}</span> • {article.readTime}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 px-6 py-10 bg-white">
      {/* Business and Sport News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className='flex-1'>
          <h2 className="text-2xl font-bold mb-4">Business</h2>
          <div className="flex justify-between gap-6 ">
            {articles.business.map((item, i) => <Card key={i} article={item} />)}
          </div>
        </div>
        <div className='flex-1'>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Sport News</h2>
            <span className="text-red-500 ml-2 cursor-pointer">→</span>
          </div>
          <div className="flex gap-6 justify-between">
            {articles.sports.map((item, i) => <Card key={i} article={item} />)}
          </div>
        </div>
      </div>

    </div>
  );
}
