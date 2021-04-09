import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const useAsyncStorage = <T>(
  key: string,
  defaultValue: T | null = null,
): [T | null, (newValue: T) => void, boolean] => {
  const [state, setState] = useState({
    hydrated: false,
    storageValue: defaultValue,
  });
  const { hydrated, storageValue } = state;

  async function pullFromStorage() {
    const fromStorage = await SecureStore.getItemAsync(key);
    let value = defaultValue;
    if (fromStorage) {
      value = JSON.parse(fromStorage);
    }
    setState({ hydrated: true, storageValue: value });
  }

  async function updateStorage(newValue: T) {
    setState({ hydrated: true, storageValue: newValue });
    const stringifiedValue = JSON.stringify(newValue);
    await SecureStore.setItemAsync(key, stringifiedValue);
  }

  useEffect(() => {
    pullFromStorage();
  }, []);

  return [storageValue, updateStorage, hydrated];
};

export default useAsyncStorage;
