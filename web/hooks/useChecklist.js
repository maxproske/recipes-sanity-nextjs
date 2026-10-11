import { create } from 'zustand'

// Tap-to-check for ingredients and method steps, keyed by their Sanity _key so
// ticking an ingredient in the main list also ticks it inside its method step.
// Saved per recipe so it survives a reload or switching apps mid-cook, but
// expires so the next time you cook it starts fresh.
const TTL_MS = 12 * 60 * 60 * 1000
const storageKey = (recipeId) => `checklist:${recipeId}`

function read(recipeId) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(recipeId)))
    if (saved && Date.now() - saved.at < TTL_MS) return saved.checked
  } catch {
    // Storage blocked or corrupt — start empty.
  }
  return {}
}

function write(recipeId, checked) {
  try {
    if (Object.keys(checked).length) {
      localStorage.setItem(
        storageKey(recipeId),
        JSON.stringify({ at: Date.now(), checked })
      )
    } else {
      localStorage.removeItem(storageKey(recipeId))
    }
  } catch {
    // Storage blocked — checks just won't persist.
  }
}

export const useChecklist = create((set, get) => ({
  recipeId: null,
  checked: {},
  load: (recipeId) => set(() => ({ recipeId, checked: read(recipeId) })),
  toggle: (key) => {
    const { recipeId, checked } = get()
    const next = { ...checked }
    if (next[key]) delete next[key]
    else next[key] = true
    write(recipeId, next)
    set(() => ({ checked: next }))
  },
  clear: () => {
    write(get().recipeId, {})
    set(() => ({ checked: {} }))
  },
}))

// Props that turn any element into an accessible tap-to-check target. A tap
// only counts for the innermost target, so nested buttons (the ingredient ⓘ)
// keep working and ticking an ingredient inside a step doesn't tick the step.
export function useCheckable(key) {
  const isChecked = useChecklist((state) => !!state.checked[key])
  const toggle = useChecklist((state) => state.toggle)

  return {
    isChecked,
    props: {
      role: 'checkbox',
      'aria-checked': isChecked,
      tabIndex: 0,
      onClick: (e) => {
        if (e.target.closest('button, a, [role="checkbox"]') !== e.currentTarget)
          return
        toggle(key)
      },
      onKeyDown: (e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          toggle(key)
        }
      },
    },
  }
}
