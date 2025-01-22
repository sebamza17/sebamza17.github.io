export default function run () {
  const message = `
    <h2>⚠️ LAST SEATS ⚠️</h2>
    <p>This activity is selling fast!</p>
  `

  const target = document.querySelector('[data-extension-daily-announcement]')

  if (!target) {
    this.peekLogger.logError(`Daily Announcement Extension: Target not found: [data-extension-daily-announcement]`)
    return
  }

  const styleTag = document.createElement('style')

  styleTag.innerHTML = `
    @keyframes darkenSkyblue {
      0% {
        background-color: var(--il-color-accent-200);
      }
      50% {
        background-color: var(--il-color-accent-400);
      }
      100% {
        background-color: var(--il-color-accent-200);
      }
    }

    @keyframes shake {
      10%, 90% {
        transform: translate3d(-1px, 0, 0);
      }

      20%, 80% {
        transform: translate3d(2px, 0, 0);
      }

      30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0);
      }

      40%, 60% {
        transform: translate3d(4px, 0, 0);
      }
    }

    .extension-daily-announcement {
      padding: 16px;
      margin-top: 12px;
      margin-bottom: 12px;

      background-color: skyblue;
      color: white;
      cursor: pointer;
      border-radius: 6px 6px;
      box-shadow: var(--il-shadow-cool-base), var(--il-shadow-cool-base), var(--il-shadow-cool-raised);

      animation: darkenSkyblue 2.4s infinite linear, shake 1.2s cubic-bezier(.36,.07,.19,.97) infinite;
    }

    .extension-daily-announcement:hover {
      animation-play-state: paused;
    }

    .extension-daily-announcement h2 {
      margin-bottom: 4px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
    }

    .extension-daily-announcement p {
      text-align: center;
      margin-bottom: 0;
      font-size: 16px;
    }
  `
  document.head.appendChild(styleTag)

  target.innerHTML = message

  target.addEventListener('click', () => {
    // scroll to .iliad-date-picker
    const datePicker = document.querySelector('.iliad-date-picker')

    if (datePicker) {
      datePicker.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
