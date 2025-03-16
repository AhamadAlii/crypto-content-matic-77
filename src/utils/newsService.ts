
import { NewsArticle } from '@/types';

// Fallback mock data in case the API fails
const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Surges Past $65,000 as Institutional Interest Grows',
    source: 'CryptoNews',
    content: 'Bitcoin has surged past $65,000 as institutional investors continue to show interest in the cryptocurrency. Major financial institutions are increasingly adding Bitcoin to their portfolios, signaling growing acceptance of digital assets in traditional finance.',
    summary: 'Bitcoin breaks $65K milestone as institutional adoption accelerates with major financial players entering the market.',
    url: 'https://example.com/bitcoin-surge',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    publishedAt: '2023-04-15T14:30:00Z',
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Ethereum Completes Major Network Upgrade to Reduce Energy Consumption',
    source: 'BlockchainDaily',
    content: 'Ethereum has successfully completed a major network upgrade aimed at reducing energy consumption by over 99%. The upgrade, which has been in development for years, transitions the network from a proof-of-work to a proof-of-stake consensus mechanism.',
    summary: 'Ethereum\'s new upgrade cuts energy use by 99%, switching from proof-of-work to proof-of-stake in a long-awaited move.',
    url: 'https://example.com/ethereum-upgrade',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    publishedAt: '2023-04-14T09:15:00Z',
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'Regulatory Concerns Grow as Countries Consider Crypto Restrictions',
    source: 'CoinDesk',
    content: 'Several countries have announced plans to implement stricter regulations on cryptocurrency trading and mining. The move comes amid concerns about energy consumption, potential use in illicit activities, and financial stability risks.',
    summary: 'Multiple nations announce plans for stricter crypto regulations, citing environmental impact and financial stability concerns.',
    url: 'https://example.com/crypto-regulations',
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    publishedAt: '2023-04-13T16:45:00Z',
    sentiment: 'negative',
  },
  {
    id: '4',
    title: 'New DeFi Protocol Raises $50 Million in Funding Round',
    source: 'DeFi Today',
    content: 'A new decentralized finance protocol has raised $50 million in a funding round led by prominent venture capital firms. The protocol aims to provide innovative financial services on the blockchain, including lending, borrowing, and asset management.',
    summary: 'New DeFi platform secures $50M from top VCs to develop blockchain-based financial services.',
    url: 'https://example.com/defi-funding',
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    publishedAt: '2023-04-12T11:20:00Z',
    sentiment: 'positive',
  },
  {
    id: '5',
    title: 'NFT Market Shows Signs of Recovery After Months of Decline',
    source: 'ArtCrypto',
    content: 'The non-fungible token (NFT) market is showing signs of recovery after months of declining sales and prices. Recent high-profile sales and new project launches have reignited interest in digital collectibles, though volumes remain below peak levels.',
    summary: 'NFT market rebounds with high-profile sales and new projects, though still below previous peak trading volumes.',
    url: 'https://example.com/nft-recovery',
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    publishedAt: '2023-04-11T13:40:00Z',
    sentiment: 'neutral',
  },
  {
    id: '6',
    title: 'Major Bank Launches Cryptocurrency Custody Service for Institutional Clients',
    source: 'FinancialTimes',
    content: 'A major international bank has launched a cryptocurrency custody service for its institutional clients. The service will initially support Bitcoin and Ethereum, with plans to expand to other digital assets in the future.',
    summary: 'Global bank introduces crypto custody for institutions, starting with Bitcoin and Ethereum with more assets planned.',
    url: 'https://example.com/bank-custody',
    imageUrl: 'https://images.unsplash.com/photo-1638913662380-9799def8ffb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    publishedAt: '2023-04-10T08:50:00Z',
    sentiment: 'positive',
  }
];

// Function to fetch crypto news articles from a real API
export const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  try {
    console.log('Fetching real-time crypto news...');
    
    // Using the free CryptoCompare News API
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC,ETH,Cryptocurrency,Blockchain');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Data || !Array.isArray(data.Data)) {
      console.error('Unexpected API response format:', data);
      throw new Error('Unexpected API response format');
    }
    
    // Map API response to our NewsArticle type
    const articles: NewsArticle[] = data.Data.map((item: any, index: number) => {
      // Determine sentiment based on title (simple approach)
      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      const title = item.title.toLowerCase();
      
      if (title.includes('surge') || title.includes('gain') || title.includes('rally') || 
          title.includes('bullish') || title.includes('soar') || title.includes('high')) {
        sentiment = 'positive';
      } else if (title.includes('crash') || title.includes('drop') || title.includes('fall') || 
                title.includes('bearish') || title.includes('plunge') || title.includes('low')) {
        sentiment = 'negative';
      }
      
      return {
        id: item.id || `${index}-${Date.now()}`,
        title: item.title,
        source: item.source || 'CryptoNews',
        content: item.body || '',
        summary: item.title, // Using title as summary since API doesn't provide one
        url: item.url || '#',
        imageUrl: item.imageurl || 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        publishedAt: item.published_on ? new Date(item.published_on * 1000).toISOString() : new Date().toISOString(),
        sentiment: sentiment
      };
    });
    
    console.log(`Fetched ${articles.length} real-time news articles`);
    return articles;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    console.log('Falling back to mock data');
    
    // Return mock data as fallback
    return MOCK_NEWS_ARTICLES;
  }
};

// Function to analyze sentiment of news articles
export const analyzeSentiment = async (article: NewsArticle): Promise<'positive' | 'neutral' | 'negative'> => {
  // In a real application, this would use an NLP API to analyze sentiment
  // For now, we'll just return the existing sentiment
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return article.sentiment;
};

// Function to summarize an article
export const summarizeArticle = async (article: NewsArticle): Promise<string> => {
  // In a real application, this would use an AI service to summarize content
  // For now, we'll just return the existing summary
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return article.summary;
};
