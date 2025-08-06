import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import './News.css';

const News = () => {
  const { settings } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);

  const categories = [
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'markets', name: 'Markets', icon: '📈' },
    { id: 'stocks', name: 'Stocks', icon: '💼' },
    { id: 'crypto', name: 'Crypto', icon: '₿' },
    { id: 'economy', name: 'Economy', icon: '🏛️' },
    { id: 'tech', name: 'Technology', icon: '💻' }
  ];

  const newsData = [
    {
      id: 1,
      title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
      summary: 'The Federal Reserve indicated today that it may consider interest rate cuts in the coming year as inflation continues to moderate.',
      category: 'economy',
      source: 'Financial Times',
      publishedAt: '2024-01-15T10:30:00Z',
      readTime: '3 min read',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Economy',
      trending: true,
      bookmarked: false
    },
    {
      id: 2,
      title: 'Apple Stock Reaches New All-Time High After Strong Q4 Earnings',
      summary: 'Apple Inc. shares surged to a record high after the company reported better-than-expected quarterly earnings.',
      category: 'stocks',
      source: 'Bloomberg',
      publishedAt: '2024-01-15T09:15:00Z',
      readTime: '4 min read',
      image: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=Apple',
      trending: true,
      bookmarked: true
    },
    {
      id: 3,
      title: 'Bitcoin Surges Past $50,000 as Institutional Adoption Grows',
      summary: 'Bitcoin has reached a new milestone, crossing the $50,000 mark for the first time since 2021.',
      category: 'crypto',
      source: 'CoinDesk',
      publishedAt: '2024-01-15T08:45:00Z',
      readTime: '5 min read',
      image: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Crypto',
      trending: true,
      bookmarked: false
    },
    {
      id: 4,
      title: 'S&P 500 Hits Record High as Tech Stocks Lead Rally',
      summary: 'The S&P 500 index reached a new all-time high today, driven by strong performance in technology stocks.',
      category: 'markets',
      source: 'Reuters',
      publishedAt: '2024-01-15T07:30:00Z',
      readTime: '3 min read',
      image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Markets',
      trending: false,
      bookmarked: false
    },
    {
      id: 5,
      title: 'Tesla Reports Record Vehicle Deliveries in Q4',
      summary: 'Tesla delivered a record number of vehicles in the fourth quarter, exceeding analyst expectations.',
      category: 'stocks',
      source: 'CNBC',
      publishedAt: '2024-01-15T06:20:00Z',
      readTime: '4 min read',
      image: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Tesla',
      trending: false,
      bookmarked: true
    },
    {
      id: 6,
      title: 'Microsoft Announces Major AI Partnership with OpenAI',
      summary: 'Microsoft has announced a significant partnership with OpenAI to advance artificial intelligence development.',
      category: 'tech',
      source: 'TechCrunch',
      publishedAt: '2024-01-15T05:10:00Z',
      readTime: '6 min read',
      image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=AI',
      trending: true,
      bookmarked: false
    },
    {
      id: 7,
      title: 'Gold Prices Reach 3-Month High Amid Economic Uncertainty',
      summary: 'Gold prices have climbed to their highest level in three months as investors seek safe-haven assets.',
      category: 'markets',
      source: 'MarketWatch',
      publishedAt: '2024-01-15T04:30:00Z',
      readTime: '3 min read',
      image: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Gold',
      trending: false,
      bookmarked: false
    },
    {
      id: 8,
      title: 'Ethereum Network Upgrade Shows Promising Results',
      summary: 'The latest Ethereum network upgrade has demonstrated improved transaction speeds and reduced gas fees.',
      category: 'crypto',
      source: 'Decrypt',
      publishedAt: '2024-01-15T03:45:00Z',
      readTime: '5 min read',
      image: 'https://via.placeholder.com/300x200/27ae60/ffffff?text=Ethereum',
      trending: false,
      bookmarked: false
    }
  ];

  const [news, setNews] = useState(newsData);

  const toggleBookmark = (newsId) => {
    setNews(prevNews => 
      prevNews.map(item => 
        item.id === newsId 
          ? { ...item, bookmarked: !item.bookmarked }
          : item
      )
    );
  };

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = !showBookmarks || item.bookmarked;
    
    return matchesCategory && matchesSearch && matchesBookmark;
  });

  const trendingNews = news.filter(item => item.trending);
  const bookmarkedNews = news.filter(item => item.bookmarked);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="news-page">
      <div className="news-header">
        <h1 className="page-title">Financial News</h1>
        <div className="news-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className={`btn ${showBookmarks ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            🔖 Bookmarks ({bookmarkedNews.length})
          </button>
        </div>
      </div>

      <div className="news-content">
        <div className="news-sidebar">
          <div className="category-filter">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {trendingNews.length > 0 && (
            <div className="trending-news">
              <h3 className="sidebar-title">🔥 Trending</h3>
              <div className="trending-list">
                {trendingNews.slice(0, 5).map(item => (
                  <div key={item.id} className="trending-item">
                    <div className="trending-content">
                      <h4 className="trending-title">{item.title}</h4>
                      <div className="trending-meta">
                        <span className="trending-source">{item.source}</span>
                        <span className="trending-time">{formatTimeAgo(item.publishedAt)}</span>
                      </div>
                    </div>
                    <button 
                      className={`bookmark-btn ${item.bookmarked ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(item.id)}
                    >
                      {item.bookmarked ? '★' : '☆'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="news-main">
          <div className="news-filters">
            <div className="filter-stats">
              <span className="news-count">{filteredNews.length} articles</span>
              {selectedCategory !== 'all' && (
                <span className="category-badge">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
          </div>

          <div className="news-grid">
            {filteredNews.length === 0 ? (
              <div className="empty-news">
                <div className="empty-icon">📰</div>
                <h3>No news found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredNews.map(item => (
                <article key={item.id} className="news-card">
                  <div className="news-image">
                    <img src={item.image} alt={item.title} />
                    {item.trending && <span className="trending-badge">🔥 Trending</span>}
                    <button 
                      className={`bookmark-btn ${item.bookmarked ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(item.id)}
                    >
                      {item.bookmarked ? '★' : '☆'}
                    </button>
                  </div>
                  
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-category">
                        {categories.find(c => c.id === item.category)?.name}
                      </span>
                      <span className="news-time">{formatTimeAgo(item.publishedAt)}</span>
                    </div>
                    
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-summary">{item.summary}</p>
                    
                    <div className="news-footer">
                      <div className="news-source">
                        <span className="source-name">{item.source}</span>
                        <span className="read-time">{item.readTime}</span>
                      </div>
                      <button className="btn btn-sm btn-outline">Read More</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;