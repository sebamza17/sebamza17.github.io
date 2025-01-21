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

    .extension-daily-announcement {
      padding: 16px;
      margin-top: 12px;
      margin-bottom: 12px;

      background-color: skyblue;
      color: white;
      border-radius: 6px 6px;
      box-shadow: var(--il-shadow-cool-base), var(--il-shadow-cool-base), var(--il-shadow-cool-raised);

      animation: darkenSkyblue 2s infinite linear;
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
}