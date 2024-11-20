export const getCategories = () => {
  return ["Trending", "Art", "Collectibles", "Music"];
};

export const getNewsCategories = () => {
  return [
    "Latest News",
    "NFTs",
    "Metaverse",
    "Cryptocurrency",
    "Top Gainers",
    "Top Losers",
  ];
};

export const getCarouselData = () => {
  return [
    {
      image: "/img_1.jpg",
      title: "JPMorgan Says Ethereum is Losing NFT Market Share to Solana",
      source: "coindesk.com",
      time: "56 mins ago",
    },
    {
      image: "/img_2.jpg",
      title: "Bitcoin Surges Past $50,000 Amid Optimistic Market Trends",
      source: "cryptonews.com",
      time: "2 hours ago",
    },
    {
      image: "/img_3.jpg",
      title: "Cardano Smart Contracts Reach Record Growth",
      source: "decrypt.co",
      time: "1 day ago",
    },
  ];
};

export const getNewsData = () => {
  return [
    {
      imageSrc: "/news-1.jpg",
      imageAlt: "News 1",
      title:
        "Your large text that will either wrap to two lines or get truncated if it's too long.",
      source: "newyorktimes.com",
      timeAgo: "56 mins ago",
    },
    {
      imageSrc: "/news-2.jpg",
      imageAlt: "News 2",
      title: "Breaking news: Latest developments in tech world.",
      source: "bbc.com",
      timeAgo: "1 hour ago",
    },
    {
      imageSrc: "/news-3.jpg",
      imageAlt: "News 3",
      title: "Global warming trends are worsening, scientists warn.",
      source: "theguardian.com",
      timeAgo: "3 hours ago",
    },
    {
      imageSrc: "/news-4.jpg",
      imageAlt: "News 4",
      title: "Innovations in AI: What’s next in machine learning?",
      source: "techcrunch.com",
      timeAgo: "5 hours ago",
    },
    {
      imageSrc: "/news-5.jpg",
      imageAlt: "News 5",
      title: "New era in space exploration: NASA’s latest mission.",
      source: "spacex.com",
      timeAgo: "10 hours ago",
    },
  ];
};

export const getNFTItems = () => {
  return [
    {
      imageSrc: "/img_1.jpg",
      imageAlt: "Image 1",
      title: "Mutant Handz",
      isVerified: true,
      description: "A shrouded mutant hands existing in the approximate future",
      ethAmount: "9,861.37",
      percentageChange: "+136.54%",
    },
    {
      imageSrc: "/img_2.jpg",
      imageAlt: "Image 2",
      title: "Alien Artifacts",
      isVerified: false,
      description: "Rare artifacts from distant galaxies",
      ethAmount: "5,431.50",
      percentageChange: "-2.34%",
    },
    {
      imageSrc: "/img_3.jpg",
      imageAlt: "Image 3",
      title: "Pixelated Wonders",
      isVerified: true,
      description: "Unique pixel art pieces that transcend time and space",
      ethAmount: "2,763.28",
      percentageChange: "+5.87%",
    },
    {
      imageSrc: "/img_4.jpg",
      imageAlt: "Image 4",
      title: "CryptoKitties",
      isVerified: true,
      description: "Collectible and adorable crypto-powered kitties",
      ethAmount: "3,112.42",
      percentageChange: "+0.78%",
    },
  ];
};

export const getRankingsData = () => {
  return [
    {
      rank: 1,
      avatarSrc: "/avatar.svg",
      isVerified: true,
      nftTitle: "NFT Title 1",
      nftPrice: 0.5,
      priceChange: "+12.57%",
    },
    {
      rank: 2,
      avatarSrc: "/avatar.svg",
      isVerified: false,
      nftTitle: "NFT Title 2",
      nftPrice: 0.3,
      priceChange: "-3.45%",
    },
    {
      rank: 3,
      avatarSrc: "/avatar.svg",
      isVerified: true,
      nftTitle: "NFT Title 3",
      nftPrice: 1.2,
      priceChange: "+6.75%",
    },
    {
      rank: 4,
      avatarSrc: "/avatar.svg",
      isVerified: false,
      nftTitle: "NFT Title 4",
      nftPrice: 0.8,
      priceChange: "+2.15%",
    },
  ];
};
