
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import SkeletonLoader from './SkeletonLoader';

interface CountryData {
  name: { common: string };
  capital: string[];
  population: number;
  flags: { svg: string };
  region: string;
  subregion: string;
  currencies: Record<string, { name: string, symbol: string }>;
  languages: Record<string, string>;
}

const InfoPanel = () => {
  const { selectedCountry, isPanelOpen, setSelectedCountry } = useStore();
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const countryName = selectedCountry?.properties?.ADMIN;

  useEffect(() => {
    if (isPanelOpen) {
      setAnimationClass('animate-slide-in-left');
    } else if (animationClass) { // Only animate out if it has been animated in
      setAnimationClass('animate-slide-out-left');
    }
  }, [isPanelOpen]);

  useEffect(() => {
    if (countryName) {
      const fetchData = async () => {
        setLoading(true);
        setCountryData(null);
        try {
          const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName.toLowerCase()}?fullText=true`);
          setCountryData(response.data[0]);
        } catch (error) {
          console.error("Failed to fetch country data:", error);
          // Attempt fuzzy search if exact match fails
          try {
            const fuzzyResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryName.toLowerCase()}`);
            setCountryData(fuzzyResponse.data[0]);
          } catch (fuzzyError) {
             console.error("Failed to fetch fuzzy country data:", fuzzyError);
             setCountryData(null);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [countryName]);

  const handleClose = () => {
    setSelectedCountry(null);
  };

  const currencyInfo = useMemo(() => {
    if (!countryData?.currencies) return 'N/A';
    const firstCurrencyKey = Object.keys(countryData.currencies)[0];
    const currency = countryData.currencies[firstCurrencyKey];
    return `${currency.name} (${currency.symbol})`;
  }, [countryData]);

  const languages = useMemo(() => {
    if (!countryData?.languages) return 'N/A';
    return Object.values(countryData.languages).join(', ');
  }, [countryData]);

  if (!isPanelOpen && animationClass === 'animate-slide-out-left' && !loading) {
     setTimeout(() => { if (!isPanelOpen) setAnimationClass(''); }, 500);
  }

  if (!animationClass) return null;


  return (
    <div className={`fixed top-0 left-0 h-full w-full md:w-[400px] bg-black/30 backdrop-blur-md shadow-2xl text-white p-6 z-10 overflow-y-auto ${animationClass}`}>
      <button onClick={handleClose} className="absolute top-4 right-4 text-2xl font-bold text-white/70 hover:text-white">&times;</button>
      
      {loading && <SkeletonLoader />}

      {!loading && countryData && (
        <div className="flex flex-col space-y-4 pt-8">
          <img src={countryData.flags.svg} alt={`Flag of ${countryData.name.common}`} className="w-full h-auto object-cover rounded-lg border-2 border-white/20" />
          <h1 className="text-3xl font-bold tracking-wider">{countryData.name.common}</h1>
          
          <div className="border-t border-white/20 my-4"></div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-semibold">Capital:</div><div>{countryData.capital?.[0] || 'N/A'}</div>
            <div className="font-semibold">Population:</div><div>{countryData.population.toLocaleString() || 'N/A'}</div>
            <div className="font-semibold">Region:</div><div>{countryData.region || 'N/A'}</div>
            <div className="font-semibold">Subregion:</div><div>{countryData.subregion || 'N/A'}</div>
            <div className="font-semibold">Currency:</div><div>{currencyInfo}</div>
            <div className="font-semibold col-span-2">Languages:</div><div className="col-span-2">{languages}</div>
          </div>
        </div>
      )}
      {!loading && !countryData && countryName && (
        <div className="pt-8 text-center text-white/70">
            Could not retrieve data for {countryName}.
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
