export default function run () {
  const datesWithWaitlist = ['2025-03-04', '2025-04-18']

  // subscribe to date-change events on ember
  this.subscribeToAppEvent('ActivitySlotListComponent.activitySlotDates.update', (event) => {
    console.log('[Extension code]: variable changed on Ember', event)

    disableWaitlistOnDates(datesWithWaitlist)

    if (event?.data?.value?.length > 0) {
      enableWaitlistOnDates(datesWithWaitlist, event.data.value)
    }
  })

  // test query for CORS
  fetch('http://book.peek.stack/services/api/availability-dates?c=&cache=true&end-date=2025-03-11&include=&namespace=50201dd6-1261-4c20-fb54-45413a9b58a6&pc-id=p_g7bd7&src-booking-refid=32202e97-1bde-4746-8db0-a5bdbbdddb07&start-date=2025-03-04&use-legacy-api=true', {
    method: 'get',
    headers: {
      'Authorization': 'Key 1a88a40e-4107-464d-bf92-45ad6fa8c4cf'
    }
  })
    .then(async (response) => {
      const body = await response.json()
      debugger
    })
}

/**
 * adds a click event listener to the waitlist button on the given dates
 * @param datesOnWaitlist
 * @param emberDates
 */
const enableWaitlistOnDates = (datesOnWaitlist, emberDates) => {
  const dateElements = document.querySelectorAll(`[data-test-time-slot-container-date] [data-test-time-slot]`)

  dateElements.forEach(element => {
    element.addEventListener('click', (event) => {
      // find closest ancestor element that matches the selector "[data-test-time-slot]"
      const timeSlotElement = (event.target).closest('[data-test-time-slot-container-date]')

      // check if the element exists and has the attribute "data-test-time-slot"
      if (timeSlotElement && timeSlotElement.hasAttribute('data-test-time-slot-container-date')) {
        // get value of the "data-test-time-slot" attribute
        const timeSlotValue = timeSlotElement.getAttribute('data-test-time-slot-container-date')

        // Check if the value is included in the "datesWithWaitlist" array
        if (timeSlotValue && datesOnWaitlist.includes(timeSlotValue)) {
          const emberDate = emberDates.find((date) => date.templateDate === timeSlotValue)

          if (emberDate) {
            addWaitlistElementToFixedFooter(emberDate)
          }
        } else {
          removeWaitlistElementFromFixedFooter()
        }
      }
    })
  })
}

/**
 * resets click event listeners to avoid duplicated events
 * @param dates
 */
const disableWaitlistOnDates = (dates) => {
  dates.forEach((date) => {
    const dateElements = document.querySelectorAll(`[data-test-time-slot-container-date="${date}"] [data-test-time-slot]`)

    if (dateElements.length > 0) {
      dateElements.forEach(element => {
        element.removeEventListener('click', () => {
          console.log('CLICKED DATE', date)
        })
      })
    }
  })
}

/**
 * adds a waitlist element to the fixed footer
 * @param dateObject
 */
const addWaitlistElementToFixedFooter = (dateObject) => {
  const fixedFooterElement = findFixedFooterElement()

  if (fixedFooterElement) {
    const alreadyHasWaitlistButton = fixedFooterElement.querySelector('[data-test-extension-waitlist-button-container]')

    // if the waitlist footer is present, we want to re-draw it to use the selected new date
    if (alreadyHasWaitlistButton) {
      removeWaitlistElementFromFixedFooter()
    }

    // format date as "March 4, 2025"
    const givenDate = new Date(dateObject.templateDate)
    // get utc value
    const utcDate = new Date(givenDate.getTime() + givenDate.getTimezoneOffset() * 60000)
    const formattedDate = utcDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    // disable book now button [data-test-fixed-footer-action="book-now"]
    const bookNowButton = fixedFooterElement.querySelector('[data-test-fixed-footer-action="book-now"]')
    bookNowButton?.setAttribute('disabled', '')

    const waitlistButtonContainer = document.createElement('div')
    waitlistButtonContainer.className = 'absolute left-0 top-0 right-0 bottom-0 px-4 py-2 flex items-center justify-between gap-12 bg-white'
    waitlistButtonContainer.setAttribute('data-test-extension-waitlist-button-container', '')

    // create text
    const waitlistText = document.createElement('div')
    waitlistText.className = 'text-gray-700 font-semibold text-sm'
    waitlistText.setAttribute('data-test-extension-waitlist-text', '')
    waitlistText.innerText = `We are sorting out more availability soon. Join the waitlist for ${formattedDate}, and don't miss out on your chance to book!`

    // create button
    const waitlistButton = document.createElement('button')
    waitlistButton.className = 'bg-white border-2 border-solid border-red-800 hover:border-red-900 px-2 py-3 rounded-md text-color-red-800 hover:text-color-red-900 font-semibold'
    waitlistButton.setAttribute('data-test-extension-waitlist-button', '')
    waitlistButton.innerText = 'Join Waitlist'
    waitlistButton.addEventListener('click', () => {
      openWaitlistFormModal(formattedDate)
    })

    // no need for styles as we're using tailwind
    // appendStyles()
    waitlistButtonContainer.appendChild(waitlistText)
    waitlistButtonContainer.appendChild(waitlistButton)
    fixedFooterElement.appendChild(waitlistButtonContainer)
  }
}

/**
 * removes the waitlist element from the fixed footer
 */
const removeWaitlistElementFromFixedFooter = () => {
  const fixedFooterElement = findFixedFooterElement()

  if (fixedFooterElement) {
    const waitlistButtonContainer = fixedFooterElement.querySelector('[data-test-extension-waitlist-button-container]')

    if (waitlistButtonContainer) {
      waitlistButtonContainer.remove()
    }

    // re-enable book now button [data-test-fixed-footer-action="book-now"]
    const bookNowButton = fixedFooterElement.querySelector('[data-test-fixed-footer-action="book-now"]')
    bookNowButton?.removeAttribute('disabled')
  }
}

/**
 * creates a modal that has a form and lets the user add an email and confirm that they want to joing
 * the waitlist for the date/time they selected
 */
const openWaitlistFormModal = (formattedDate) => {
  // create the modal overlay
  const overlay = document.createElement('div')
  overlay.classList.add(
    'fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50',
    'flex', 'justify-center', 'items-center', 'z-50'
  )

  // create the modal container
  const modal = document.createElement('div')
  modal.classList.add(
    'bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'w-96', 'relative'
  )

  // create the form
  const form = document.createElement('form')
  form.classList.add('flex', 'flex-col', 'gap-4')

  // create form header
  const header = document.createElement('h2')
  header.className = 'text-xl font-semibold text-gray-800'
  header.innerText = 'Join the waitlist!'

  // create explaining text
  const explainingText = document.createElement('p')
  explainingText.className = 'text-gray-700 text-sm'
  explainingText.innerText = `Enter your email to join the waitlist for ${formattedDate} and don't miss out! We'll let you know as soon as there's a spot available.`

  // create the email input
  const emailInput = document.createElement('input')
  emailInput.type = 'email'
  emailInput.placeholder = 'Enter your email'
  emailInput.classList.add(
    'p-2', 'border', 'border-gray-300', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
  )

  // create the buttons container
  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('flex', 'justify-end', 'gap-4')

  // create the close/cancel button
  const closeButton = document.createElement('button')
  closeButton.textContent = 'Find another date'
  closeButton.classList.add(
    'px-4', 'py-2', 'bg-white', 'rounded', 'hover:bg-gray-200', 'transition', 'duration-200', 'font-semibold'
  )

  // create the confirm button
  const confirmButton = document.createElement('button')
  confirmButton.textContent = 'Confirm'
  confirmButton.classList.add(
    'px-4', 'py-2', 'bg-red-800', 'text-white', 'rounded', 'hover:bg-red-900', 'transition', 'duration-200', 'font-semibold'
  )

  // append elements to the form
  form.appendChild(header)
  form.appendChild(explainingText)
  form.appendChild(emailInput)
  buttonsContainer.appendChild(closeButton)
  buttonsContainer.appendChild(confirmButton)
  form.appendChild(buttonsContainer)

  // append the form to the modal
  modal.appendChild(form)

  // append the modal to the overlay
  overlay.appendChild(modal)

  // append the overlay to the body
  document.body.appendChild(overlay)// Function to close the modal
  function closeModal () {
    document.body.removeChild(overlay)
  }

  // event listener for the close button
  closeButton.addEventListener('click', (event) => {
    event.preventDefault() // Prevent form submission
    closeModal()
  })

  // event listener for the overlay (close modal when clicking outside the modal)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal()
    }
  })

  // event listener for the confirm button
  confirmButton.addEventListener('click', (event) => {
    event.preventDefault() // Prevent form submission

    // Validate the email input
    const email = emailInput.value.trim()
    if (email && validateEmail(email)) {
      alert(`Email submitted: ${email}`)
      closeModal()
    } else {
      alert('Please enter a valid email address.')
    }
  })

  // helper function to validate email
  function validateEmail (email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
}

const findFixedFooterElement = () => {
  const fixedFooterSelector = '[data-test-fixed-footer]'
  return document.querySelector(fixedFooterSelector)
}
