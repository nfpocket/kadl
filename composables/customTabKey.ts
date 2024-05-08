import { useMagicKeys } from "@vueuse/core";

export const focusNextElement = (backwards = false) => {
  if (!document.activeElement) return;

  const focusableElements: HTMLElement[] = Array.from(
    document.querySelectorAll("a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1']), [contenteditable]")
  );

  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

  if (backwards) {
    const nextIndex = currentIndex - 1;

    if (nextIndex >= 0) {
      focusableElements[nextIndex].focus();
    } else {
      focusableElements[focusableElements.length - 1].focus();
    }
  } else {
    const nextIndex = currentIndex + 1;

    if (nextIndex < focusableElements.length) {
      focusableElements[nextIndex].focus();
    } else {
      focusableElements[0].focus();
    }
  }
};

export const useCustomTabKey = () => {
  /**
   * Custom "Tab" behavior:
   * - When the user presses the "Tab" key, the focus will move to the next focusable element.
   * - When the user holds the "Tab" key, nothing will happen (for key combinations like "Tab + X").
   */

  const tabDelay = ref(150);
  const lastTabTime = ref<Date | null>(null);

  useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (e.key === "Tab") {
        if (e.repeat) {
          e.preventDefault();
          return;
        }

        if (e.type === "keydown" && !e.repeat) {
          e.preventDefault();

          lastTabTime.value = new Date();

          return;
        }

        if (e.type === "keyup" && lastTabTime.value) {
          const now = new Date();
          const diff = now.getTime() - lastTabTime.value.getTime();
          if (diff > tabDelay.value) {
            e.preventDefault();
          } else {
            focusNextElement(e.shiftKey);
          }
          lastTabTime.value = null;
        }

        return;
      }
    },
  });
};
