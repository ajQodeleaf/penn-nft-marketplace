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
      id: 1,
      name: "Mutant Handz",
      description: "A shrouded mutant hands existing in the approximate future",
      metadataURI: "/img_1.jpg",
      price: "9861.37",
      isVerified: true,
    },
    {
      id: 2,
      name: "Alien Artifacts",
      description: "Rare artifacts from distant galaxies",
      metadataURI: "/img_2.jpg",
      price: "5431.50",
      isVerified: false,
    },
    {
      id: 3,
      name: "Pixelated Wonders",
      description: "Unique pixel art pieces that transcend time and space",
      metadataURI: "/img_3.jpg",
      price: "2763.28",
      isVerified: true,
    },
    {
      id: 4,
      name: "CryptoKitties",
      description: "Collectible and adorable crypto-powered kitties",
      metadataURI: "/img_4.jpg",
      price: "3112.42",
      isVerified: true,
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

export const onboardingContent = [
  {
    heading: "Welcome to the App!",
    body: "Let's get you started.",
  },
  {
    heading: "Step 1: Connect your wallet",
    body: "Connect your wallet to access all features.",
  },
  {
    heading: "Step 2: Explore the marketplace",
    body: "Discover unique NFTs and browse collections.",
  },
  {
    heading: "Step 3: Create your own NFTs",
    body: "Start trading by creating your own NFT collections.",
  },
  {
    heading: "Step 4: Stay updated",
    body: "Get news and notifications from the community.",
  },
  {
    heading: "Step 5: Manage your profile",
    body: "Track your activities and customize your profile.",
  },
  {
    heading: "Step 6: Enjoy responsive design",
    body: "Experience seamless usability across all devices.",
  },
  {
    heading: "Need help?",
    body: "Visit our Help Center for FAQs and support.",
  },
  {
    heading: "Ready to dive in?",
    body: "Start exploring now and enjoy the journey!",
  },
  {
    heading: "Thank you!",
    body: "Thank you for choosing our platform. We hope you enjoy your journey!",
  },
];
