<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

interface Recaptcha {
  ready(callback: () => void): void;
  render(container: HTMLElement, options: {
    sitekey: string;
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }): number;
  reset(widget: number): void;
}

const props = defineProps<{ siteKey: string }>();
const emit = defineEmits<{ token: [value: string] }>();
const container = ref<HTMLElement>();
const loading = ref(false);
const enabled = ref(false);
const error = ref('');
let widget: number | undefined;
let disposed = false;

function captchaApi(): Recaptcha | undefined {
  return (window as Window & { grecaptcha?: Recaptcha }).grecaptcha;
}

async function enable() {
  loading.value = true;
  error.value = '';
  try {
    if (!captchaApi()) {
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-discussion-captcha]');
        const script = existing ?? document.createElement('script');
        const timeout = window.setTimeout(() => {
          script.remove();
          reject(new Error('timeout'));
        }, 15_000);
        script.addEventListener('load', () => { clearTimeout(timeout); resolve(); }, { once: true });
        script.addEventListener('error', () => {
          clearTimeout(timeout);
          script.remove();
          reject(new Error('load'));
        }, { once: true });
        if (!existing) {
          script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=de';
          script.async = true;
          script.dataset.discussionCaptcha = '';
          document.head.appendChild(script);
        }
      });
    }
    const api = captchaApi();
    if (!api) throw new Error('unavailable');
    await new Promise<void>(resolve => api.ready(resolve));
    if (disposed || !container.value) return;
    widget = api.render(container.value, {
      sitekey: props.siteKey,
      callback: token => emit('token', token),
      'expired-callback': () => emit('token', ''),
      'error-callback': () => {
        emit('token', '');
        error.value = 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte lade sie erneut.';
      }
    });
    enabled.value = true;
  } catch {
    error.value = 'Google reCAPTCHA konnte nicht geladen werden. Prüfe deine Verbindung oder deinen Inhaltsblocker.';
  } finally {
    loading.value = false;
  }
}

function reset() {
  emit('token', '');
  if (widget !== undefined) captchaApi()?.reset(widget);
}

onBeforeUnmount(() => { disposed = true; reset(); });
defineExpose({ reset });
</script>

<template>
  <div class="space-y-3">
    <div v-if="!enabled" class="rounded-sm border border-rule bg-paper p-4 text-sm text-ink-soft">
      <p>Zum Schutz vor Bots nutzen wir Google reCAPTCHA. Erst mit dem Laden wird eine Verbindung zu Google hergestellt.</p>
      <button type="button" class="mt-3 font-semibold text-primary underline underline-offset-4 disabled:opacity-50" :disabled="loading" @click="enable">
        {{ loading ? 'Sicherheitsprüfung lädt …' : 'Google reCAPTCHA laden' }}
      </button>
      <p class="mt-2 text-xs">
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="underline">Google Datenschutz</a>
        · <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="underline">Nutzungsbedingungen</a>
      </p>
    </div>
    <div ref="container" class="max-w-full overflow-x-auto" />
    <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
    <button v-if="error && enabled" type="button" class="text-sm font-semibold text-primary underline" @click="reset(); error = ''">Prüfung zurücksetzen</button>
  </div>
</template>
