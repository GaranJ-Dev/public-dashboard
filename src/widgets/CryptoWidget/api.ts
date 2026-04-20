import axios from "@/utils/axios";

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const AVAILABLE_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
  { id: "ripple", name: "XRP" },
  { id: "polkadot", name: "Polkadot" },
  { id: "chainlink", name: "Chainlink" },
];

export const getCryptoPrices = async (coinIds: string[]): Promise<CryptoCoin[]> => {
  if (!coinIds.length) return [];
  const response = await axios.get<CryptoCoin[]>(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        ids: coinIds.join(","),
        order: "market_cap_desc",
        sparkline: false,
      },
    },
  );
  return response.data;
};
