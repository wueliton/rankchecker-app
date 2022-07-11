import { createContext, useContext, useEffect, useState } from "react";

export interface KeywordResult {
  title: string | null;
  link: string | null;
  keyword: string;
  url: string | null;
  page: number | null;
  position: number | null;
}

export interface KeywordsSearchState {
  client?: string;
  website?: string;
  keywords?: string[];
  keywordsRanked?: KeywordResult[];
}

interface StorageContextProps {
  data?: null | undefined | KeywordsSearchState;
  isNewSearch?: boolean;
  setIsNewSearch: () => void;
  setKeywordsState: (data: null | undefined | KeywordsSearchState) => void;
  addResultToSearchStatus: (keywordResult: KeywordResult) => void;
}

interface StorageContextProviderProps {
  children: React.ReactNode;
}

const StorageContext = createContext({} as StorageContextProps);

export const StorageContextProvider = ({
  children,
}: StorageContextProviderProps) => {
  const [data, setData] = useState<null | undefined | KeywordsSearchState>(
    null
  );
  const [isNewSearch, setNewSearch] = useState(false);

  useEffect(() => {
    const data = getState();
    setData(data);
  }, []);

  const setState = (keywordsSearch: null | undefined | KeywordsSearchState) =>
    window.localStorage.setItem(
      "keywords",
      JSON.stringify(keywordsSearch ?? "")
    );

  const getState = () =>
    JSON.parse(
      window.localStorage.getItem("keywords") as string
    ) as KeywordsSearchState;

  const setKeywordsState = (data: null | undefined | KeywordsSearchState) => {
    setState(data);
    setData(() => data);
  };

  const addResultToSearchStatus = (keywordResult: KeywordResult) => {
    setData((prevState) => {
      const newState: KeywordsSearchState = {
        ...prevState,
        keywordsRanked: [keywordResult, ...(prevState?.keywordsRanked ?? [])],
      };
      setState(newState);
      return newState;
    });
  };

  const setIsNewSearch = () => setNewSearch(true);

  return (
    <StorageContext.Provider
      value={{
        data,
        isNewSearch,
        setKeywordsState,
        setIsNewSearch,
        addResultToSearchStatus,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => useContext(StorageContext);
