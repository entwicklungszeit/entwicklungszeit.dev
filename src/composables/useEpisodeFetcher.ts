import { ref, onMounted } from 'vue';
import { fetchEpisodes } from '../services/episodeService';
import type { Episode } from '../types/episode';

export function useEpisodeFetcher() {
  const episodes = ref<Episode[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadEpisodes = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchEpisodes();
      episodes.value = data;
    } catch (err) {
      error.value = 'Fehler beim Laden der Folgen';
      console.error('Error loading episodes:', err);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadEpisodes();
  });

  return {
    episodes,
    isLoading,
    error,
    loadEpisodes,
  };
}
