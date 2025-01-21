export default function run () {
  const content = `
    <div class="flex items-center justify-between">
      <div class="w-2/5">
        <img src="https://sebamza17.github.io/images/5-star-review.png" alt="Star-Reviews">
      </div>

      <div class="extension-inline-review__right">
        <a target="_blank" href="https://www.google.com/maps/place/Bodegas+L%C3%B3pez/@-32.9608716,-68.7967151,14z/data=!4m11!1m2!2m1!1sgoogle+reviews!3m7!1s0x967e0cbfcaa37699:0x47b536c2479fd297!8m2!3d-32.9626176!4d-68.7841941!9m1!1b1!16s%2Fg%2F1tcym7mg?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D">
          See Google Reviews
        </a>
      </div>
    </div>
  `

  const target = document.querySelector('[data-extension-inline-review]')

  if (!target) {
    this.peekLogger.logError(`Daily Announcement Extension: Target not found: [data-extension-inline-review]`)
    return
  }

  const styleTag = document.createElement('style')

  styleTag.innerHTML = `
    .extension-inline-review-container {
      padding: 16px;
      margin-top: 12px;
      margin-bottom: 12px;

      border-radius: 6px 6px;
      box-shadow: var(--il-shadow-cool-base);
      cursor: pointer;

      transition: all .2s ease;
    }

    .extension-inline-review-container:hover {
      transform: translateY(-4px);
    }

    .extension-inline-review-container a {
      color: var(--il-color-accent-300);
      font-weight: 700;
      font-size: 12px;
    }
  `
  document.head.appendChild(styleTag)

  target.innerHTML = content
}
